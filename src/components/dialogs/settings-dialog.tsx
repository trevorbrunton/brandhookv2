"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUserByUserId } from "@/app/actions/fetch-user-by-id";
import { updateBusinessDetails } from "@/app/actions/update-business-details";
import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PrivacyDialog } from "@/components/legal/privacy-dialog";
import { TOUDialog } from "@/components/legal/tou-dialog";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowRight, UserRoundPen } from "lucide-react";

interface SettingsDialogProps {
  userId: string;
}

const SettingsFormSchema = z.object({
  businessDetails: z
    .string()
    .min(2, { message: "Please enter your business details" }),
  businessStage: z
    .string()
    .min(2, { message: "Please enter the stage of your business" }),
  marketChannel: z
    .string()
    .min(2, { message: "Please enter the market channel of your business" }),
});

export const SettingsDialog = ({userId}: SettingsDialogProps) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();



  const {
    data: userRecord,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {

      return fetchUserByUserId(userId);
    },
 // Only run the query when id is available
  });

  const updateUserMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: z.infer<typeof SettingsFormSchema>;
    }) =>
      updateBusinessDetails(
        id,
        data.businessDetails,
        data.businessStage,
        data.marketChannel
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      setOpen(false);
    },
  });

  const form = useForm<z.infer<typeof SettingsFormSchema>>({
    resolver: zodResolver(SettingsFormSchema),
    defaultValues: async () => {
      if (!userRecord) {
        return {
          businessDetails: "",
          businessStage: "",
          marketChannel: "",
        };
      }
      return {
        businessDetails: userRecord.businessDetails || "",
        businessStage: userRecord.businessStage || "",
        marketChannel: userRecord.marketChannel || "",
      };
    },
  });

  const onSubmit = (data: z.infer<typeof SettingsFormSchema>) => {
    if (userRecord && userRecord.id) {
      updateUserMutation.mutate({ id: userRecord.id, data });
    } else {
      console.error("User ID not available");
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading user data</div>;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="flex items-center text-zinc-500 group-hover:text-zinc-700 -my-2">
          <UserRoundPen size={16} />
          Edit Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-[900px] max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Edit Settings
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Update your business details here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 sm:space-y-6 mt-4"
          >
            <FormField
              control={form.control}
              name="businessDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">
                    Business Details
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter a description of your business"
                      className="min-h-[120px] text-sm p-3 border border-input bg-background rounded-md focus:border-primary focus:ring-1 focus:ring-primary transition duration-200"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <FormField
                control={form.control}
                name="businessStage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">
                      Business Stage
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="border border-input bg-background rounded-md focus:border-primary focus:ring-1 focus:ring-primary transition duration-200">
                          <SelectValue placeholder="Select your business stage" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Revenue generating">
                          Revenue generating
                        </SelectItem>
                        <SelectItem value="MVP">MVP</SelectItem>
                        <SelectItem value="Pre-product">Pre-product</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="marketChannel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">
                      Market
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="border border-input bg-background rounded-md focus:border-primary focus:ring-1 focus:ring-primary transition duration-200">
                          <SelectValue placeholder="Select your market channel" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="B2C">B2C</SelectItem>
                        <SelectItem value="B2B">B2B</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col justify-between items-center gap-4">
              <Button
                type="submit"
                disabled={updateUserMutation.isPending}
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 px-4 rounded-md transition duration-200"
              >
                {updateUserMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>

              <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 w-full">
                <PrivacyDialog />
                <TOUDialog />
              </div>
            </div>
          </form>
        </Form>
        <div className="mt-6 w-full sm:w-auto">
          <Button
            asChild
            className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-medium py-2 px-4 rounded-md transition duration-200"
          >
            <Link
              href="https://www.loom.com/share/2220733b64c54ece9da24f88118c9389?sid=6a6dc055-eae5-41f3-9b0e-8f7adae7c144"
              className="flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              Watch Brandhook Discover AI Tool Explainer
              <ArrowRight size={16} className="hidden sm:inline" />
            </Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
