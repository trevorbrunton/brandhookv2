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
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { MultipleSelector } from "./multiple-selector";
import { addPeopleToMemory } from "@/app/actions/add-people-to-memory";

const names = ["Trevor Brunton", "Sophie Brunton"];
const personSchema = z.object({
  people: z.array(z.object({ personId: z.string() })),
});

interface AddPersonProps {
  memoryId: string;
}

export function AddPerson({ memoryId }: AddPersonProps) {
  const [submitted, setSubmitted] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);

  const form = useForm<z.infer<typeof personSchema>>({
    resolver: zodResolver(personSchema),
    defaultValues: { people: [] },
  });

  const handleSubmit = async () => {
    setSubmitted(true);
    const data = form.getValues();
    try {
      setSubmitted(false);
      //create an array of personIds
      const personIds = data.people.map((person) => person.personId);
      // addPeopleToMemory(memoryId, personIds);
      console.log("MemoryId", memoryId);
      console.log("PersonIds", personIds);
      form.reset();
      setSubmitted(false);
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePeopleChange = (people: string[]) => {
    setSelectedPeople(people);
    form.setValue(
      "people",
      people.map((person) => ({ personId: person }))
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-xl">
          Tag People
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tag People</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <MultipleSelector
              options={names.map((name) => ({ label: name, value: name }))}
              value={selectedPeople}
              onChange={handlePeopleChange}
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedPeople.map((person) => (
                <div
                  key={person}
                  className="bg-gray-100 text-sm px-2 py-1 rounded-full flex items-center"
                >
                  {person}
                  <button
                    type="button"
                    onClick={() =>
                      handlePeopleChange(
                        selectedPeople.filter((p) => p !== person)
                      )
                    }
                    className="ml-1 text-Foreground hover:text-blue-900 focus:outline-none"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex flex-col-reverse md:flex-row justify-end md:space-x-4 space-y-4 md:space-y-0 mt-8">
              <Button
                type="button"
                variant="destructive"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitted}
                className="w-full md:w-auto bg-white text-indigo-600 hover:bg-gray-100 transition-colors"
              >
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
