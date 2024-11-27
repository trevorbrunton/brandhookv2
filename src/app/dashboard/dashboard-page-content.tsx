"use client";

import { LoadingSpinner } from "@/components/loading-spinner";
import { Button, buttonVariants } from "@/components/ui/button";
import { Modal } from "@/components/modal";
// import { client } from "@/lib/client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { format } from "date-fns";
import { ArrowRight, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { z } from "zod";
import { DashboardEmptyState } from "./dashboard-empty-state";
import { deleteCategoryFetch } from "./delete-category-fetch";

export const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  color: z.number().optional(),
  emoji: z.string().nullable().optional(),
  createdAt: z.string(),
  lastPing: z.date().optional(),
  uniqueFieldCount: z.number().optional(),
  eventsCount: z.number().optional(),
});

const CategoryArraySchema = z.array(CategorySchema);

type Category = z.infer<typeof CategorySchema>;
type CategoryArray = z.infer<typeof CategoryArraySchema>;

export const DashboardPageContent = () => {
  const [deletingCategory, setDeletingCategory] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const {
    data: categories,
    isLoading: isEventCategoriesLoading,
    isError,
  } = useQuery<CategoryArray>({
    queryKey: ["user-event-categories"],
    queryFn: async (): Promise<CategoryArray> => {
      const res = await fetch("/api/get-event-categories");
      const { categories } = await res.json();
      return CategoryArraySchema.parse(categories);
    },
  });

  if (isError) {
    throw new Error("An error occurred while fetching event categories");
  }

  const { mutate: deleteCategory, isPending: isDeletingCategory } = useMutation(
    {
      mutationFn: async (name: string) => {
        await deleteCategoryFetch(name);
      },
      onMutate: async (name: string) => {
        await queryClient.cancelQueries({
          queryKey: ["user-event-categories"],
        });

        const previousCategories = queryClient.getQueryData<CategoryArray>([
          "user-event-categories",
        ]);

        queryClient.setQueryData<CategoryArray>(
          ["user-event-categories"],
          (old) => (old ? old.filter((category) => category.name !== name) : [])
        );

        return { previousCategories };
      },
      onError: (err, name, context) => {
        if (context) {
          queryClient.setQueryData(
            ["user-event-categories"],
            context.previousCategories
          );
        }
        console.error("Error deleting category:", err);
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["user-event-categories"] });
        setDeletingCategory(null);
      },
    }
  );

  if (isDeletingCategory || isEventCategoriesLoading) {
    return (
      <div className="flex items-center justify-center flex-1 h-full w-full">
        <LoadingSpinner />
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return <DashboardEmptyState />;
  }

  return (
    <>
      <ul className="grid max-w-6xl grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {categories.map((category: Category) => (
          <li
            key={category.id}
            className="relative group z-10 transition-all duration-200 hover:-translate-y-0.5"
          >
            <div className="absolute z-0 inset-px rounded-lg bg-white" />

            <div className="pointer-events-none z-0 absolute inset-px rounded-lg shadow-sm transition-all duration-300 group-hover:shadow-md ring-1 ring-black/5" />

            <div className="relative p-6 z-10">
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="size-12 rounded-full"
                  style={{
                    backgroundColor: category.color
                      ? `#${category.color.toString(16).padStart(6, "0")}`
                      : "#f3f4f6",
                  }}
                />

                <div>
                  <h3 className="text-sm/7 font-medium tracking-tight text-gray-950">
                    {category.emoji || "📂"} {category.name}
                  </h3>
                  <p className="text-xs/6 font-semibold text-gray-600">
                    {format(category.createdAt, "MMM d, yyyy")}
                  </p>
                </div>
              </div>

              {/* <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm/5 text-gray-600">
                  <Clock className="size-4 mr-2 text-brand-500" />
                  <span className="font-medium">Last ping:</span>
                  <span className="ml-1">
                    {category.lastPing
                      ? formatDistanceToNow(category.lastPing) + " ago"
                      : "Never"}
                  </span>
                </div>
                <div className="flex items-center text-sm/5 text-gray-600">
                  <Database className="size-4 mr-2 text-brand-500" />
                  <span className="font-medium">Unique fields:</span>
                  <span className="ml-1">{category.uniqueFieldCount || 0}</span>
                </div>
                <div className="flex items-center text-sm/5 text-gray-600">
                  <BarChart2 className="size-4 mr-2 text-brand-500" />
                  <span className="font-medium">Events this month:</span>
                  <span className="ml-1">{category.eventsCount || 0}</span>
                </div>
              </div> */}

              <div className="flex items-center justify-between mt-4">
                <Link
                  href={`/dashboard/category/${category.name}`}
                  className={buttonVariants({
                    variant: "outline",
                    size: "sm",
                    className: "flex items-center gap-2 text-sm",
                  })}
                >
                  View all <ArrowRight className="size-4" />
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-red-600 transition-colors"
                  aria-label={`Delete ${category.name} category`}
                  onClick={() => setDeletingCategory(category.name)}
                >
                  <Trash2 className="size-5" />
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <Modal
        showModal={!!deletingCategory}
        setShowModal={() => setDeletingCategory(null)}
        className="max-w-md p-8"
      >
        <div className="space-y-6">
          <div>
            <h2 className="text-lg/7 font-medium tracking-tight text-gray-950">
              Delete Category
            </h2>
            <p className="text-sm/6 text-gray-600">
              Are you sure you want to delete the category &quot;
              {deletingCategory}&quot;? This action cannot be undone.
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setDeletingCategory(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                deletingCategory && deleteCategory(deletingCategory)
              }
              disabled={isDeletingCategory}
            >
              {isDeletingCategory ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
