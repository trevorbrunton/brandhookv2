"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

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
  const [selectedValue, setSelectedValue] = React.useState(value);
  const [newEvent, setNewEvent] = React.useState("");
  const [localOptions, setLocalOptions] = React.useState(options);

  const handleSetValue = (newValue: string) => {
    setSelectedValue(newValue);
    onChange(newValue);
  };

  const handleAddEvent = (event: string) => {
    if (event && !localOptions.some((option) => option.value === event)) {
      const newOption = { label: event, value: event };
      setLocalOptions([...localOptions, newOption]);
      onChange(event);
      setNewEvent("");
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-full justify-between"
        >
          {value
            ? localOptions.find((option) => option.value === value)?.label
            : "Select event..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search framework..." className="h-9" />
          <CommandList>
            <CommandEmpty>
              <div>
                <Input
                  type="text"
                  value={newEvent}
                  onChange={(e) => setNewEvent(e.target.value)}
                  placeholder="Add an event"
                />
                <button onClick={() => handleAddEvent(newEvent)}>
                  Add Person
                </button>
              </div>
            </CommandEmpty>
            <CommandGroup>
              {localOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    handleSetValue(
                      currentValue === selectedValue ? "" : currentValue
                    );
                  }}
                >
                  {option.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
