"use client";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "../ui/input";
import { createPerson } from "@/app/actions/create-person";



const personSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
});

export function PeopleDialog() {
  const [submitted, setSubmitted] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
    const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof personSchema>>({
    resolver: zodResolver(personSchema),
    defaultValues: { name: "" },
  });


  const mutation = useMutation({
    mutationFn: (name: string) => createPerson(name),
    onSuccess: (person) => {
      queryClient.invalidateQueries({ queryKey: ["people"] });
      setOpen(false);
      if ("id" in person) {
        router.push(`/view-person/${person.id}`);
      }
    },
    onError: (error) => {
      console.error("Failed to create person:", error);
    },
  });

  const handleSubmit = async () => {
    setSubmitted(true);
    const data = form.getValues();
    mutation.mutate(data.name);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">Add a Person</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md w-full p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Add a New Person</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter the person's name" {...field} className="w-full" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="submit" disabled={submitted} className="w-full sm:w-auto">
                Submit
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={() => setOpen(false)}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
