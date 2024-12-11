"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,

  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";


const names = ["Trevor Brunton", "Sophie Brunton"];
const personSchema = z.object({
  people: z.array(z.object({ name: z.string() })),
});

interface AddPersonProps {
  memoryId: string;
}



export function AddPerson({ memoryId }: AddPersonProps) { 
  const [submitted, setSubmitted] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedPeople, setSelectedPeople] = useState<string[]>(
          []
        );

  const form = useForm<z.infer<typeof personSchema>>({
    resolver: zodResolver(personSchema),
    defaultValues: { people: [{ name: "" }]},
  });


  const handleSubmit = async () => {
    setSubmitted(true);
    const data = form.getValues();
    console.log(data);
    console.log(memoryId)
    // Simulate adding people to a database or other state
    try {
      setOpen(false);
      setSubmitted(false);
    } catch (error) {
      console.error(error);
    }
  };

  const peopleOptions = names.map((name) => ({ label: name, value: name }));



    const handlePersonSelect = (person: string) => {
      if (!selectedPeople.includes(person)) {
        const updatedPeople = [...selectedPeople, person];
        setSelectedPeople(updatedPeople);
        form.setValue("people", updatedPeople.map((value) => ({ name: value })));
      }
    };

    const handleRemovePerson = (rValue: string) => {
      const updatedRValues = selectedPeople.filter((s) => s !== rValue);
      setSelectedPeople(updatedRValues);
      form.setValue("people", updatedRValues.map((value) => ({ name: value })));
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
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="mt-8">
              <FormLabel>Select people</FormLabel>
              <Controller
                name="people"
                control={form.control}
                render={() => (
                  <Select onValueChange={handlePersonSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a person" />
                    </SelectTrigger>
                    <SelectContent>
                      {peopleOptions.map((person) => (
                        <SelectItem key={person.label} value={person.label}>
                          {person.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedPeople.map((person) => (
                <div
                  key={person}
                  className="bg-gray-100 text-sm px-2 py-1 rounded-full flex items-center"
                >
                  {person}
                  <button
                    type="button"
                    onClick={() => handleRemovePerson(person)}
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
