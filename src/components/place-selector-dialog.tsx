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
import { fetchPlacesByUserId } from "@/app/actions/fetch-places-by-userId";
import { useQuery } from "@tanstack/react-query";

type Place = {
  id: string;
  name: string;
};

export function PlaceSelectorDialog() {
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const { data: places } = useQuery<Place[]>({
    queryKey: ["places"],
    queryFn: async () => {
      const thePlaces = await fetchPlacesByUserId();
      if (!Array.isArray(thePlaces)) {
        throw new Error(thePlaces.error);
      }
      return thePlaces;
    },
  });

  const handleSelectPlace = (placeId: string) => {
    setSelectedPlace(placeId);
  };

  const handleGoToPlace = () => {
    if (selectedPlace) {
      setOpen(false);
      router.push(`/view-place/${selectedPlace}`);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost">Go to Places</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Choose a Place</DialogTitle>
          </DialogHeader>
          {places && places.length ? (
            <div className="grid gap-4 py-4">
              <Select onValueChange={handleSelectPlace}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a place" />
                </SelectTrigger>
                <SelectContent>
                  {places.map((place) => (
                    <SelectItem key={place.id} value={place.id}>
                      {place.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => router.push("/view-place/new")}
                >
                  Add a new place?
                </Button>
                <Button onClick={handleGoToPlace} disabled={!selectedPlace}>
                  Go to Place
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="outline"
              onClick={() => router.push("/view-place/new")}
            >
              You have no places yet. Add one?
            </Button>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

