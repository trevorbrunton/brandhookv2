"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { fetchEventsByUserId } from "@/app/actions/fetch-events-by-userId";
import { useQuery } from "@tanstack/react-query";

type Event = {
  id: string;
  name: string;
};

export function EventSelectorDialog() {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const { data: events } = useQuery<Event[]>({
    queryKey: ["events"],
    queryFn: async () => {
      const theEvents = await fetchEventsByUserId();
      if (!Array.isArray(theEvents)) {
        throw new Error(theEvents.error);
      }
      return theEvents;
    },
  });

  const handleSelectEvent = (eventId: string) => {
    setSelectedEvent(eventId);
  };

  const handleGoToEvent = () => {
    if (selectedEvent) {
      setOpen(false);
      router.push(`/view-event/${selectedEvent}`);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost">Go to Events</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Choose an Event</DialogTitle>
          </DialogHeader>
          {events && events.length ? (
            <div className="grid gap-4 py-4">
              <Select onValueChange={handleSelectEvent}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an event" />
                </SelectTrigger>
                <SelectContent>
                  {events.map((event) => (
                    <SelectItem key={event.id} value={event.id}>
                      {event.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => router.push("/view-event/new")}
                >
                  Add a new event?
                </Button>
                <Button onClick={handleGoToEvent} disabled={!selectedEvent}>
                  Go to Event
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="outline"
              onClick={() => router.push("/view-event/new")}
            >
              You have no events yet. Add one?
            </Button>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

