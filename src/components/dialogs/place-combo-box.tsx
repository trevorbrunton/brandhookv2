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

interface PlaceCommandProps {
  options: Framework[];
  value: string;
  onChange: (value: string) => void;
}

export function PlaceComboBox({ options, value, onChange }: PlaceCommandProps) {
  const [selectedValue, setSelectedValue] = React.useState(value);
  const [newplace, setNewplace] = React.useState("");
  const [localOptions, setLocalOptions] = React.useState(options);

  const handleSetValue = (newValue: string) => {
    setSelectedValue(newValue);
    onChange(newValue);
  };

  const handleAddplace = (place: string) => {
    if (place && !localOptions.some((option) => option.value === place)) {
      const newOption = { label: place, value: place };
      setLocalOptions([...localOptions, newOption]);
      onChange(place);
      setNewplace("");
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
            : "Select place..."}
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
                  value={newplace}
                  onChange={(e) => setNewplace(e.target.value)}
                  placeholder="Add an place"
                />
                <button onClick={() => handleAddplace(newplace)}>
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
