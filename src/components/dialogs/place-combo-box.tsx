"use client";

import * as React from "react";
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { createPlace } from "@/app/actions/create-place";
import { Label } from "@/components/ui/label";

interface Framework {
  label: string;
  value: string;
}

interface PlaceCommandProps {
  options: Framework[];
  value: string;
  onChange: (value: string) => void;
}

export function PlaceComboBox({ options, value, onChange }: PlaceCommandProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(value);
  const [newPlace, setNewPlace] = React.useState("");
  const [localOptions, setLocalOptions] = React.useState(options);

  console.log("selected value", selectedValue);

  const handleSetValue = (newValue: string) => {
    setSelectedValue(newValue);
    onChange(newValue);
    setOpen(false);
  };

  const handleAddPlace = async (place: string) => {
    if (place && !localOptions.some((option) => option.value === place)) {
      const newOption = { label: place, value: place };
      setLocalOptions([...localOptions, newOption]);
      onChange(place);
      await createPlace(place);
      setNewPlace("");
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Label
        htmlFor="place-select"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Select Place
      </Label>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between mt-1.5"
          id="place-select"
        >
          {value
            ? localOptions.find((option) => option.value === value)?.label
            : "Select place..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command className="w-full">
          <CommandInput placeholder="Search places..." className="h-9" />
          <CommandList>
            <CommandEmpty>
              <div className="p-2 text-sm text-muted-foreground">
                No places found.
              </div>
            </CommandEmpty>
            <CommandGroup>
              {localOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={handleSetValue}
                  className="flex items-center justify-between"
                >
                  {option.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <div className="p-2 border-t">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddPlace(newPlace);
              }}
              className="flex items-center space-x-2"
            >
              <Input
                type="text"
                value={newPlace}
                onChange={(e) => setNewPlace(e.target.value)}
                placeholder="Add new place"
                className="flex-grow"
              />
              <Button type="submit" size="sm" disabled={!newPlace}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add
              </Button>
            </form>
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
