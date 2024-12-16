"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
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
import { MultipleSelector } from "@/components/dialogs/multiple-selector";

const personSchema = z.object({
  name: z.string().min(1, "Name is required"),
  dateOfBirth: z.string().optional(),
  memories: z.array(z.string()),
  events: z.array(z.string()),
  places: z.array(z.string()),
  picUrl: z.string().url().optional().or(z.literal("")),
});

type PersonFormData = z.infer<typeof personSchema>;

interface PeopleFormProps {
  initialData?: PersonFormData;
  memories: { label: string; value: string }[];
  events: { label: string; value: string }[];
  places: { label: string; value: string }[];
}

export function PersonDetailsForm({
  initialData,
  memories,
  events,
  places,
}: PeopleFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PersonFormData>({
    resolver: zodResolver(personSchema),
    defaultValues: initialData || {
      name: "",
      dateOfBirth: "",
      memories: [],
      events: [],
      places: [],
      picUrl: "",
    },
  });

  const handleSubmit = async (data: PersonFormData) => {
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
          {initialData ? "Update Person" : "Add New Person"}
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
              render={({field}) => (
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
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="memories"
              render={() => (
                <FormItem>
                  <FormLabel>Memories</FormLabel>
                  <FormControl>
                    <Controller
                      name="memories"
                      control={form.control}
                      render={({ field }) => (
                        <MultipleSelector
                          options={memories}
                          value={field.value}
                          onChange={field.onChange}
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
                ? "Update Person"
                : "Add Person"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
