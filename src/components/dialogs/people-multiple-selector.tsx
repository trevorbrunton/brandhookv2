import { useState } from "react";
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
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

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

  const handleAddPerson = (person: string) => {
    if (person && !localOptions.some((option) => option.value === person)) {
      const newOption = { label: person, value: person };
      setLocalOptions([...localOptions, newOption]);
      onChange([...value, person]);
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

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          <div className="truncate">
            {value.length > 0
              ? value.map((val) => (
                  <span key={val} className="mr-2">
                    {val}
                  </span>
                ))
              : "Select people..."}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[480px] p-0">
        <Command>
          <CommandInput placeholder="Search people..." />
          <CommandEmpty>
            <div>
              <input
                type="text"
                value={newPerson}
                onChange={(e) => setNewPerson(e.target.value)}
                placeholder="Add new person"
              />
              <button onClick={() => handleAddPerson(newPerson)}>
                Add Person
              </button>
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
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value.includes(option.value) ? "opacity-100" : "opacity-0"
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
  );
}
