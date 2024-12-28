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
import { PeopleMultipleSelector } from "@/components/dialogs/people-multiple-selector";
import { ThingsMultipleSelector } from "@/components/dialogs/things-multiple-selector";
import { updateMemoryDetails } from "@/app/actions/update-memory-details";
import { EventComboBox } from "@/components/dialogs/event-combo-box";
import { PlaceComboBox } from "@/components/dialogs/place-combo-box";


const memorySchema = z.object({
  id: z.string(),
  people: z.array(z.string()),
  event: z.string(),
  place: z.string(),
  title: z.string().min(1),
  things: z.array(z.string()),
});

type MemoryFormData = z.infer<typeof memorySchema>;

interface MemoryFormProps {
  initialData?: MemoryFormData;
  allPeople: { label: string; value: string, personId: string }[];
  allEvents: { label: string; value: string, eventId:string}[];
  allPlaces: { label: string; value: string, placeId: string }[];
  allThings: { label: string; value: string, thingId: string }[];

}

export function MemoryDetailsForm({
  initialData,
  allPeople,
  allEvents,
  allPlaces,
  allThings,

}: MemoryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);


  const form = useForm<MemoryFormData>({
    resolver: zodResolver(memorySchema),
    defaultValues: initialData || {
      people: [],
      event: "",
      place: "",
      title: "",
      things: [],
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
      //look up thingId from thing name in allThings for each selected thing  
      const thingsIds = data.things
        .map((thing) => allThings.find((t) => t.value === thing)?.thingId)
        .filter((id): id is string => id !== undefined);
      
      //look up eventId from event name in allEvents
      const eventId = allEvents.find((e) => e.value === data.event)?.eventId;

      //look up placeId from place name in allPlaces
      const placeId = allPlaces.find((p) => p.value === data.place)?.placeId;

   
      await updateMemoryDetails(data.id, peopleIds, thingsIds, eventId || "", placeId || "");
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
            <FormField
              control={form.control}
              name="things"
              render={() => (
                <FormItem>
                  <FormLabel>Things</FormLabel>
                  <FormControl>
                    <Controller
                      name="things"
                      control={form.control}
                      render={({ field }) => (
                        <ThingsMultipleSelector
                          options={allThings}
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
