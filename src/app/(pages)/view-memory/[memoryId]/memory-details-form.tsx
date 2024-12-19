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
// import { MultipleSelector } from "@/components/dialogs/generalised-multiple-selector";
import { PeopleMultipleSelector } from "@/components/dialogs/people-multiple-selector";
import { X } from "lucide-react";
import { updateMemoryDetails } from "@/app/actions/update-memory-details";
import { EventComboBox } from "@/components/dialogs/event-combo-box";
import { PlaceComboBox } from "@/components/dialogs/place-combo-box";


const memorySchema = z.object({
  id: z.string(),
  people: z.array(z.string()),
  event: z.string(),
  place: z.string(),
  title: z.string().min(1),
  userId: z.string(),
});

type MemoryFormData = z.infer<typeof memorySchema>;

interface MemoryFormProps {
  initialData?: MemoryFormData;
  allPeople: { label: string; value: string, personId: string }[];
  allEvents: { label: string; value: string, eventId:string}[];
  allPlaces: { label: string; value: string, placeId: string }[];

}

export function MemoryDetailsForm({
  initialData,
  allPeople,
  allEvents,
  allPlaces,

}: MemoryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);


  const form = useForm<MemoryFormData>({
    resolver: zodResolver(memorySchema),
    defaultValues: initialData || {
      people: [],
      event: "",
      place: "",
      title: "",
    },
  });
  console.log("Initial data:", initialData);
  console.log("Form data:", form.getValues());
  console.log("All people:", allPeople);
  console.log("All events:", allEvents);
  console.log("All places:", allPlaces);


  const handleSubmit = async (data: MemoryFormData) => {
    setIsSubmitting(true);
    try {
      console.log("Submitting form data:", data);

      //look up personId from person name in allPeople for each selected person
      const peopleIds = data.people
        .map((person) => allPeople.find((p) => p.value === person)?.personId)
        .filter((id): id is string => id !== undefined);
      
      //look up eventId from event name in allEvents
      const eventId = allEvents.find((e) => e.value === data.event)?.eventId;

      //look up placeId from place name in allPlaces
      const placeId = allPlaces.find((p) => p.value === data.place)?.placeId;

   
      await updateMemoryDetails(data.id, peopleIds, eventId || "", placeId || "");
      form.reset(data);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePeopleChange = (people: string[]) => {
    form.setValue("people", people);
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
                        <PeopleMultipleSelector
                          options={allPeople}
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
            <div className="flex flex-wrap gap-2 mt-2">
              {form.watch("people").map((person) => (
                <div
                  key={person}
                  className="bg-gray-100 text-sm px-2 py-1 rounded-full flex items-center"
                >
                  {person}
                  <button
                    type="button"
                    onClick={() =>
                      handlePeopleChange(
                        form.watch("people").filter((p) => p !== person)
                      )
                    }
                    className="ml-1 text-Foreground hover:text-blue-900 focus:outline-none"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>

            <FormField
              control={form.control}
              name="event"
              render={() => (
                <FormItem>
                  <FormLabel>Event</FormLabel>
                  <FormControl>
                    <Controller
                      name="event"
                      control={form.control}
                      render={({ field }) => (
                        <EventComboBox
                          options={allEvents}
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
              name="place"
              render={() => (
                <FormItem>
                  <FormLabel>Place</FormLabel>
                  <FormControl>
                    <Controller
                      name="place"
                      control={form.control}
                      render={({ field }) => (
                        <PlaceComboBox
                          options={allPlaces}
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

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Updating..."
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
