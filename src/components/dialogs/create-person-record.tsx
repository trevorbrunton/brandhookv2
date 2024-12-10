"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
    DialogTitle,
  DialogTrigger
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
import { Trash2Icon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const names = ["Trevor Brunton", "Sophie Brunton"];
const personSchema = z.object({
  people: z.array(z.object({ name: z.string() })),
});



export function PeopleDialog() {
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
        <Button variant="ghost">Add a Person</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>People</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center space-x-2">
                <FormField
                  control={form.control}
                  name={`people.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Name..." />
                          </SelectTrigger>
                          <SelectContent>
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
                <Button size="sm" type="button" onClick={() => remove(index)}>
                  <Trash2Icon className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button type="button" onClick={() => append({ name: "" })}>
              Add Person
            </Button>
            <div className="flex justify-end space-x-2">
              <Button type="submit" disabled={submitted}>
                Submit
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
