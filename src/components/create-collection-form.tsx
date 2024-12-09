"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { nanoid } from "@/lib/utils";
interface CollectionFormProps {
  userEmail: string;
  userId: string;
}
import { useRouter } from "next/navigation";

const formSchema = z.object({
  collectionName: z.string().min(1, "Collection name is required"),
  collectionDetails: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateCollectionForm({
  userEmail,
  userId,
}: CollectionFormProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      collectionName: "",
      collectionDetails: "",
    },
  });
  const router = useRouter();


  async function onSubmit(values: FormValues) {
    try {
      const collectionId = nanoid();
      console.log("Collection ID:", collectionId);
      const response = await fetch("/api/create-collection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          userEmail,
          userId,
          collectionId: collectionId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create collection");
      }

      const data = await response.json();
      console.log("Collection created:", data);
      toast({
        title: "Success",
        description: "Collection created successfully",
      });
      setOpen(false);
      router.push(`/collection/${collectionId}`);
    } catch (error) {
      console.error("Error creating collection:", error);
      toast({
        title: "Error",
        description: "Failed to create collection",
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Create New Collection</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Collection</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">


            <FormField
              control={form.control}
              name="collectionName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Collection Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter collection name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="collectionDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Collection Details</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter collection details"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Create Collection
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
