"use client";

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
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "../ui/input";
import { createEvent } from "@/app/actions/create-event";

const eventSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  dateOfEvent: z.string().optional(),
});

export function EventDialog() {
  const [submitted, setSubmitted] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: { name: "", dateOfEvent: "" },
  });

  const handleSubmit = async () => {
    setSubmitted(true);
    const data = form.getValues();
    try {
      const event = await createEvent(data.name);
      setOpen(false);
      router.push(`/view-event/${event.id}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">Add an Event</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md w-full p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Add a New Event</DialogTitle>
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
                      <Input placeholder="Enter the event name" {...field} className="w-full" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dateOfEvent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Date of Event (optional)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} className="w-full" />
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

