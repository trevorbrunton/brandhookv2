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

interface CollectionFormProps {
  userEmail: string;
  userId: string;
  collectionId: string;
}

const formSchema = z.object({
  collectionName: z.string().min(1, "Collection name is required"),
  collectionDetails: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateCollectionForm({
  userEmail,
  userId,
  collectionId,
}: CollectionFormProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      collectionName: "",
      collectionDetails: "",
    },
  });

  function onSubmit(values: FormValues) {
    console.log(values, userEmail, userId, collectionId);
    setOpen(false);
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
