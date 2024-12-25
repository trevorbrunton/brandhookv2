"use client";

import { type Memory } from "@prisma/client";
import { Draggable } from '@hello-pangea/dnd';
import { MemoryCard } from "./MemoryCard";

interface MemoryListProps {
  memories: Memory[];
  collectionId: string;
}

export function MemoryList({ memories, collectionId }: MemoryListProps) {
  return (
    <div className="space-y-4">
      {memories.map((memory, index) => (
        <Draggable key={memory.id} draggableId={memory.id} index={index}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              <MemoryCard
                memory={memory}
                isSelected={false}
                isLoading={false}
                onSelect={() => {}}
                onAddToCollection={() => {}}
                onRemove={() => {}}
              />
            </div>
          )}
        </Draggable>
      ))}
    </div>
  );
}

