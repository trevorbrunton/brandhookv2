"use client";

import * as React from "react";
import { Check, ChevronsUpDown, PlusCircle, X } from 'lucide-react';

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
import { Badge } from "@/components/ui/badge";
import { createEvent } from "@/app/actions/create-event";

interface Framework {
  label: string;
  value: string;
}

interface EventCommandProps {
  options: Framework[];
  value: string;
  onChange: (value: string) => void;
}

export function EventComboBox({ options, value, onChange }: EventCommandProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(value);
  const [newEvent, setNewEvent] = React.useState("");
  const [localOptions, setLocalOptions] = React.useState(options);

  console.log("selected value", selectedValue);

  const handleSetValue = (newValue: string) => {
    if (newValue === selectedValue) {
      setSelectedValue("");
      onChange("");
    } else {
      setSelectedValue(newValue);
      onChange(newValue);
    }
    setOpen(false);
  };

  const handleAddEvent = async (event: string) => {
    if (event && !localOptions.some((option) => option.value === event)) {
      const newOption = { label: event, value: event };
      setLocalOptions([...localOptions, newOption]);
      onChange(event);
      await createEvent(event);
      setNewEvent("");
      setOpen(false);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedValue("");
    onChange("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between mt-1.5"
          id="event-select"
        >
          {value ? (
             <div className="flex items-center truncate">
              {localOptions.find((option) => option.value === value)?.label}
              <X
                className="ml-1 h-3 w-3 shrink-0 opacity-50 hover:opacity-100"
                onClick={handleClear}
              />
            </div>
          ) : (
            "Select event..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command className="w-full">
          <CommandInput placeholder="Search events..." className="h-9" />
          <CommandList>
            <CommandEmpty>
              <div className="p-2 text-sm text-muted-foreground">
                No events found.
              </div>
            </CommandEmpty>
            <CommandGroup>
              {localOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => handleSetValue(option.value)}
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
                handleAddEvent(newEvent);
              }}
              className="flex items-center space-x-2"
            >
              <Input
                type="text"
                value={newEvent}
                onChange={(e) => setNewEvent(e.target.value)}
                placeholder="Add new event"
                className="flex-grow"
              />
              <Button type="submit" size="sm" disabled={!newEvent}>
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

