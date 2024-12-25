"use client";

import { type Memory } from "@prisma/client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AddMemoryToCollectionDialog } from "./add-memory-to-collection-dialog";
import { removeMemoryFromCollection } from "@/app/actions/remove-memory-from-collection";
import { useRouter } from "next/navigation";
import { MemoryCard } from "@/components/MemoryCard";

interface MemoryIconListProps {
  memories: Memory[];
  collectionId: string;
}

export function MemoryList({ memories, collectionId }: MemoryIconListProps) {
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [selectedMemoryForCollection, setSelectedMemoryForCollection] =
    useState<Memory | null>(null);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  const handleClick = (memory: Memory) => {
    setSelectedMemory(memory);
    router.push(`/view-memory/${memory.id}`);
  };

  const handleOpenDialog = (memory: Memory) => {
    setSelectedMemoryForCollection(memory);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedMemoryForCollection(null);
  };

  async function handleRemove(memoryId: string) {
    setIsLoading(memoryId);
    try {
      await removeMemoryFromCollection(memoryId, collectionId);
    } catch (error) {
      console.error("Error removing memory:", error);
    } finally {
      setIsLoading(null);
    }
  }

  return (
    <div className="p-4 bg-gradient-to-br from-background to-secondary/20 flex justify-center">
      <AnimatePresence>
        <motion.div 
          className="flex flex-col w-96 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          {memories.map((memory) => (
            <MemoryCard
              key={memory.id}
              memory={memory}
              isSelected={selectedMemory?.id === memory.id}
              isLoading={isLoading === memory.id}
              onSelect={handleClick}
              onAddToCollection={handleOpenDialog}
              onRemove={handleRemove}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      <AddMemoryToCollectionDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        selectedMemoryForCollection={selectedMemoryForCollection}
      />
    </div>
  );
}

