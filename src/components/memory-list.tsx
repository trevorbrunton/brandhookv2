"use client";

import { type Memory } from "@prisma/client";
import { File, Folder, Image, Video, Music, FileText } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { AddMemoryToCollectionDialog } from "./add-memory-to-collection-dialog";
import { removeMemoryFromCollection } from "@/app/actions/remove-memory-from-collection";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";


interface MemoryIconListProps {
  memories: Memory[];
  collectionId: string;
}

const iconMap = {
  file: File,
  folder: Folder,
  image: Image,
  video: Video,
  audio: Music,
  document: FileText,
};

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

  const getIcon = (type: string) => {
    const IconComponent = iconMap[type as keyof typeof iconMap] || File;
    return <IconComponent className="w-12 h-12" />;
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
    <div className="p-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {memories.map((memory) => (
          <motion.div
            key={memory.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleClick(memory)}
            className={`flex flex-col items-center justify-center p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer ${
              selectedMemory?.id === memory.id
                ? "border-2 border-brand-500"
                : "bg-card hover:bg-accent"
            }`}
            aria-label={memory.title}
          >
            {memory.docType === "image" ? (
              <img
                src={memory.fileUrl ? memory.fileUrl : ""}
                alt={memory.title}
                className="w-24 "
              />
            ) : (
              getIcon(memory.docType || "file")
            )}
            <span className="mt-2 text-sm font-medium text-center line-clamp-2">
              {memory.title}
            </span>
            <div className="flex flex-col items-start mt-2">
              {!isLoading && (
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenDialog(memory);
                  }}
                  variant="ghost"
                  size="sm"
                >
                  Add to Collection
                </Button>
              )}
              <Button
                onClick={() => handleRemove(memory.id)}
                variant="ghost"
                size="sm"
                disabled={isLoading === memory.id}
              >
                {isLoading === memory.id
                  ? "Removing..."
                  : "Remove from collection"}
              </Button>

            </div>
          </motion.div>
        ))}
      </div>

      <AddMemoryToCollectionDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        selectedMemoryForCollection={selectedMemoryForCollection}
      />
    </div>
  );
}
