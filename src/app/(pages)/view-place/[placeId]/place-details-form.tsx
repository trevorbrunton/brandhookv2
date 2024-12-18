"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updatePlaceDetails } from "@/app/actions/update-place-details";

const placeSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  geolocation: z.string().optional(),
  picUrl: z.string().url().optional().or(z.literal("")),
});

type PlaceFormData = z.infer<typeof placeSchema>;

interface PlaceFormProps {
  initialData?: PlaceFormData;
}

export function PlaceDetailsForm({ initialData }: PlaceFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PlaceFormData>({
    resolver: zodResolver(placeSchema),
    defaultValues: initialData || {
      name: "",
      geolocation: "",
      picUrl: "",
    },
  });

  const handleSubmit = async (data: PlaceFormData) => {
    setIsSubmitting(true);
    try {
      console.log("Submitting form data:", data);
      updatePlaceDetails(initialData?.id ?? "", data.name, data.geolocation ?? "", data.picUrl ?? "");
      form.reset(data);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {initialData ? "Update Place" : "Add New Place"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <FormLabel>Geolocation</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Latitude, Longitude" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="picUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Picture URL</FormLabel>
                  <FormControl>
                    <Input type="url" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Submitting..."
                : initialData
                ? "Update Place"
                : "Add Place"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

