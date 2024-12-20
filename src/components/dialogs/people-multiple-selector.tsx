"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandList,
  CommandItem,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Check, ChevronsUpDown, X, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { createPerson } from "@/app/actions/create-person";
import { Badge } from "@/components/ui/badge";

interface Framework {
  label: string;
  value: string;
}

interface MultipleSelectorProps {
  options: Framework[];
  value: string[];
  onChange: (value: string[]) => void;
}

export function PeopleMultipleSelector({
  options,
  value,
  onChange,
}: MultipleSelectorProps) {
  const [newPerson, setNewPerson] = useState("");
  const [localOptions, setLocalOptions] = useState(options);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setLocalOptions(options);
  }, [options]);

  const handleAddPerson = async (person: string) => {
    if (person && !localOptions.some((option) => option.value === person)) {
      const newOption = { label: person, value: person };
      setLocalOptions([...localOptions, newOption]);
      onChange([...value, person]);
      await createPerson(person);
      setNewPerson("");
    }
  };

  const handleSetValue = (selectedValue: string) => {
    if (value.includes(selectedValue)) {
      onChange(value.filter((v) => v !== selectedValue));
    } else {
      onChange([...value, selectedValue]);
    }
  };

  const removeValue = (valueToRemove: string) => {
    onChange(value.filter((v) => v !== valueToRemove));
  };

  return (
    <div className="w-full space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between text-left font-normal"
          >
            <span className="truncate">
              {value.length > 0
                ? `${value.length} selected`
                : "Select people..."}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 sm:w-[480px]">
          <Command className="max-h-[300px] overflow-y-auto">
            <CommandInput placeholder="Search people..." />
            <CommandEmpty>
              <div className="flex items-center space-x-2 p-2">
                <Input
                  type="text"
                  value={newPerson}
                  onChange={(e) => setNewPerson(e.target.value)}
                  placeholder="Add a person"
                  className="flex-grow"
                />
                <Button
                  size="sm"
                  onClick={() => handleAddPerson(newPerson)}
                  disabled={!newPerson}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add
                </Button>
              </div>
            </CommandEmpty>
            <CommandGroup>
              <CommandList>
                {localOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => {
                      handleSetValue(option.value);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value.includes(option.value)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandList>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      <div className="flex flex-wrap gap-2">
        {value.map((val) => (
          <Badge key={val} variant="secondary" className="animate-fadeIn">
            {val}
            <button
              className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  removeValue(val);
                }
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onClick={() => removeValue(val)}
            >
              <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
}
