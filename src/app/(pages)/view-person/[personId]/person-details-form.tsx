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
import { updatePersonDetails } from "@/app/actions/update-person-details";

const personSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  dateOfBirth: z.string().optional(),
  picUrl: z.string().url().optional().or(z.literal("")),
});

type PersonFormData = z.infer<typeof personSchema>;

interface PeopleFormProps {
  initialData?: PersonFormData;
}

export function PersonDetailsForm({ initialData }: PeopleFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  console.log("initialData", initialData);

  const form = useForm<PersonFormData>({
    resolver: zodResolver(personSchema),
    defaultValues: initialData || {
      name: "",
      dateOfBirth: "",
      picUrl: "",
    },
  });

  const handleSubmit = async (data: PersonFormData) => {
    setIsSubmitting(true);
    try {
      console.log("Submitting form data:", data);
      updatePersonDetails(initialData?.id ?? "",data.name, data.dateOfBirth ?? "", data.picUrl ?? "");
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
