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
import { createPlace } from "@/app/actions/create-place";

const placeSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  geolocation: z.string().optional(),
});

export function PlaceDialog() {
  const [submitted, setSubmitted] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof placeSchema>>({
    resolver: zodResolver(placeSchema),
    defaultValues: { name: "", geolocation: "" },
  });

  const handleSubmit = async () => {
    setSubmitted(true);
    const data = form.getValues();
    try {
      const place = await createPlace(data.name);
      setOpen(false);
      router.push(`/view-place/${place.id}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">Add a Place</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md w-full p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Add a New Place</DialogTitle>
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
                      <Input placeholder="Enter the place name" {...field} className="w-full" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="geolocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Geolocation (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter geolocation" {...field} className="w-full" />
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

