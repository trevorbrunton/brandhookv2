"use client";
//DEV NOTE UPDATE THIS TO USER MULTISELECT++++++++++++++++++++
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
import { fetchPeopleByUserId } from "@/app/actions/fetch-people-by-userId";
import { useQuery } from "@tanstack/react-query";

type Person = {
  id: string;
  name: string;
};

export function PersonSelectorDialog() {
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  console.log("baingan");

  const { data: people } = useQuery<Person[]>({
    queryKey: ["people"],
    queryFn: async () => {
      const thePeople = await fetchPeopleByUserId();
      if (!Array.isArray(thePeople)) {
        throw new Error(thePeople.error);
      }
      return thePeople;
    },
  });

  const handleSelectPerson = (personId: string) => {
    setSelectedPerson(personId);
  };

  const handleGoToPerson = () => {
    if (selectedPerson) {
      setOpen(false);
      router.push(`/view-person/${selectedPerson}`);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost">Go to People</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Choose a Person</DialogTitle>
          </DialogHeader>
          {people && people.length ? (
            <div className="grid gap-4 py-4">
              <Select onValueChange={handleSelectPerson}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a person" />
                </SelectTrigger>
                <SelectContent>
                  {people.map((person) => (
                    <SelectItem key={person.id} value={person.id}>
                      {person.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => router.push("/view-person/new")}
                >
                  Add a new person?
                </Button>
                <Button onClick={handleGoToPerson} disabled={!selectedPerson}>
                  Go to Person
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="outline"
              onClick={() => router.push("/view-person/new")}
            >
              You have no people yet. Add one?
            </Button>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
