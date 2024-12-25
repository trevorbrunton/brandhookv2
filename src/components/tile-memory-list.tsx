"use client";

import { type Memory } from "@prisma/client";
import {
  File,
  Folder,
  Image,
  Video,
  Music,
  FileText,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AddMemoryToCollectionDialog } from "./add-memory-to-collection-dialog";
import { removeMemoryFromCollection } from "@/app/actions/remove-memory-from-collection";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

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
    return <IconComponent className="w-8 h-8 md:w-12 md:h-12 text-primary" />;
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
    <div className="p-4 bg-gradient-to-br from-background to-secondary/20">
      <AnimatePresence>
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          {memories.map((memory) => (
            <motion.div
              key={memory.id}
              whileHover={{
                scale: 1.05,
                boxShadow:
                  "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleClick(memory)}
              className={`flex flex-col items-center justify-between p-4 rounded-xl shadow-lg transition-all duration-300 cursor-pointer overflow-hidden ${
                selectedMemory?.id === memory.id
                  ? "border-2 border-primary bg-primary/10"
                  : "bg-card hover:bg-accent"
              }`}
              aria-label={memory.title}
            >
              <div className="flex flex-col items-center">
                {memory.docType === "image" ? (
                  <img
                    src={memory.fileUrl ? memory.fileUrl : ""}
                    alt={memory.title}
                    className=" h-24 md:h-32 object-cover rounded-lg mb-2"
                  />
                ) : (
                  <div className="w-full h-24 md:h-32 flex items-center justify-center bg-primary/5 rounded-lg mb-2">
                    {getIcon(memory.docType || "file")}
                  </div>
                )}
                <span className="text-sm font-medium text-center line-clamp-2 mb-2">
                  {memory.title}
                </span>
              </div>
              <Badge variant="secondary" className="mb-2">
                {memory.docType || "file"}
              </Badge>
              <div className="flex justify-center space-x-2 w-full">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDialog(memory);
                        }}
                        variant="outline"
                        size="icon"
                        className="w-8 h-8"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Add to Collection</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemove(memory.id);
                        }}
                        variant="outline"
                        size="icon"
                        className="w-8 h-8"
                        disabled={isLoading === memory.id}
                      >
                        {isLoading === memory.id ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.div>
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Remove from collection</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </motion.div>
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
