"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MultipleSelector } from "@/components/dialogs/generalised-multiple-selector";

const memorySchema = z.object({
  people: z.array(z.string()),
  memories: z.array(z.string()),
  events: z.array(z.string()),
  places: z.array(z.string()),
  picUrl: z.string().url().optional().or(z.literal("")),
});

type MemoryFormData = z.infer<typeof memorySchema>;

interface PeopleFormProps {
  initialData?: MemoryFormData;
  people: { label: string; value: string }[];
  events: { label: string; value: string }[];
  places: { label: string; value: string }[];
}

export function MemoryDetailsForm({
  initialData,
  people,
  events,
  places,
}: PeopleFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<MemoryFormData>({
    resolver: zodResolver(memorySchema),
    defaultValues: initialData || {
      people: [],
      memories: [],
      events: [],
      places: [],

    },
  });

  const handleSubmit = async (data: MemoryFormData) => {
    setIsSubmitting(true);
    try {
      console.log("Submitting form data:", data);
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
          {initialData ? "Update Memory" : "Add New Memory"}
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
              name="people"
              render={() => (
                <FormItem>
                  <FormLabel>People</FormLabel>
                  <FormControl>
                    <Controller
                      name="people"
                      control={form.control}
                      render={({ field }) => (
                        <MultipleSelector
                          options={people}
                          value={field.value}
                          onChange={field.onChange}
                          type="people"
                        />
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="events"
              render={() => (
                <FormItem>
                  <FormLabel>Events</FormLabel>
                  <FormControl>
                    <Controller
                      name="events"
                      control={form.control}
                      render={({ field }) => (
                        <MultipleSelector
                          options={events}
                          value={field.value}
                          onChange={field.onChange}
                          type="events"
                        />
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="places"
              render={() => (
                <FormItem>
                  <FormLabel>Places</FormLabel>
                  <FormControl>
                    <Controller
                      name="places"
                      control={form.control}
                      render={({ field }) => (
                        <MultipleSelector
                          options={places}
                          value={field.value}
                          onChange={field.onChange}
                          type="places"
                        />
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Submitting..."
                : initialData
                ? "Update Memory"
                : "Add Memory"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

