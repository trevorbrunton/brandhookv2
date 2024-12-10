"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Trash2Icon, PlusIcon } from "lucide-react";
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

  const form = useForm<z.infer<typeof personSchema>>({
    resolver: zodResolver(personSchema),
    defaultValues: { people: [{ name: "" }] },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "people",
  });

  const handleSubmit = async () => {
    setSubmitted(true);
    const data = form.getValues();
    console.log(data);
    console.log(memoryId);
    // Simulate adding people to a database or other state
    try {
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const peopleOptions = names.map((name) => ({ label: name, value: name }));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline"className="text-xl">Tag People</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle >
            Tag People
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="flex flex-col md:flex-row items-center md:space-x-4 space-y-4 md:space-y-0"
              >
                <FormField
                  control={form.control}
                  name={`people.${index}.name`}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full bg-white text-gray-800 border-none focus:ring-2 focus:ring-purple-500">
                            <SelectValue placeholder="Select a name..." />
                          </SelectTrigger>
                          <SelectContent className="bg-white text-gray-800">
                            {peopleOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  size="icon"
                  type="button"
                  variant="ghost"
                 
                  onClick={() => remove(index)}
                >
                  <Trash2Icon className="w-5 h-5" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => append({ name: "" })}
            >
              <PlusIcon className="w-5 h-5" />
              <span>Add Another Person</span>
            </Button>
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
