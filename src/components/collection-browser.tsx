"use client";
import { type Memory } from "@prisma/client";


import { File } from "lucide-react";

interface MemoryIconListProps {
  memories: Memory[];
}

export function MemoryIconList({ memories }: MemoryIconListProps) {
  const handleClick = (memory: Memory) => {
    console.log("Memory clicked:", memory);
  };

  return (
    <div className="flex flex-wrap gap-4">
      {memories.map((memory) => {
        return (
          <div
            key={memory.id}
            onClick={() => handleClick(memory)}
            className="flex flex-col items-center gap-2 p-2 rounded-lg shadow-sm hover:bg-gray-100 focus:outline-none"
            aria-label={memory.title}
          >
            <File className="w-8 h-8 text-gray-600" />
            <span className="text-sm text-gray-700">{memory.title}</span>
          </div>
        );
      })}
    </div>
  );
}