"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
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


interface Framework {
  value: string;
  label: string;
}

const initialFrameworks: Framework[] = [
  { value: "next.js", label: "Next.js" },
  { value: "sveltekit", label: "SvelteKit" },
  { value: "nuxt.js", label: "Nuxt.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
];

export function MultipleSelector() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<string[]>([]);
  const [frameworks, setFrameworks] =
    React.useState<Framework[]>(initialFrameworks);
  const [newFramework, setNewFramework] = React.useState("");

  const handleToggleFramework = (frameworkValue: string) => {
    setValue((current) =>
      current.includes(frameworkValue)
        ? current.filter((value) => value !== frameworkValue)
        : [...current, frameworkValue]
    );
  };

  const handleAddFramework = () => {
    if (
      newFramework &&
      !frameworks.some((f) => f.value === newFramework.toLowerCase())
    ) {
      const newFrame = {
        value: newFramework.toLowerCase(),
        label: newFramework,
      };
      setFrameworks([...frameworks, newFrame]);
      setValue([...value, newFrame.value]);
      setNewFramework("");
    }
  };

  const handleRemoveFramework = (frameworkValue: string) => {
    setValue((current) => current.filter((value) => value !== frameworkValue));
  };

  return (
    <div className="w-[300px] space-y-4">
      {value.length > 0 && (
        <div className="rounded-md border border-input bg-transparent p-2">
          <h4 className="mb-2 text-sm font-medium">Selected Frameworks:</h4>
          <ul className="space-y-2">
            {value.map((val) => (
              <li key={val} className="flex items-center justify-between">
                <span className="text-sm">
                  {frameworks.find((f) => f.value === val)?.label}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => handleRemoveFramework(val)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            <span className="truncate">
              {value.length > 0
                ? `${value.length} framework${
                    value.length > 1 ? "s" : ""
                  } selected`
                : "Select frameworks..."}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Search framework..." />
            <CommandList>
              <CommandEmpty>
                <div className="p-2 text-sm text-muted-foreground">
                  No framework found. Add a new one?
                </div>
                <div className="p-2 flex items-center gap-2">
                  <input
                    type="text"
                    value={newFramework}
                    onChange={(e) => setNewFramework(e.target.value)}
                    placeholder="New framework"
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <Button size="sm" onClick={handleAddFramework}>
                    Add
                  </Button>
                </div>
              </CommandEmpty>
              <CommandGroup>
                {frameworks.map((framework) => (
                  <CommandItem
                    key={framework.value}
                    value={framework.value}
                    onSelect={() => handleToggleFramework(framework.value)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value.includes(framework.value)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {framework.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
