"use client";

import { type Memory } from "@prisma/client";
import { File, Folder, Image, Video, Music, FileText, Plus, Trash2 } from 'lucide-react';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


interface MemoryCardProps {
  memory: Memory;
  isSelected: boolean;
  isLoading: boolean;
  onSelect: (memory: Memory) => void;
  onAddToCollection: (memory: Memory) => void;
  onRemove: (memoryId: string) => void;
}

const iconMap = {
  file: File,
  folder: Folder,
  image: Image,
  video: Video,
  audio: Music,
  document: FileText,
};

export function MemoryCard({ 
  memory, 
  isSelected, 
  isLoading, 
  onSelect, 
  onAddToCollection, 
  onRemove 
}: MemoryCardProps) {
  const getIcon = (type: string) => {
    const IconComponent = iconMap[type as keyof typeof iconMap] || File;
    return <IconComponent className="w-8 h-8 text-primary" />;
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onSelect(memory)}
      className={`flex items-center justify-between p-2 rounded-xl shadow-lg transition-all duration-300 cursor-pointer overflow-hidden w-96 h-20 ${
        isSelected
          ? "border-2 border-primary bg-primary/10"
          : "bg-card hover:bg-accent"
      }`}
      aria-label={memory.title}
    >
      <div className="flex items-center space-x-4">
        {memory.docType === "image" ? (
          <img
            src={memory.fileUrl ? memory.fileUrl : ""}
            alt={memory.title}
            className="w-16 h-16 object-cover rounded-lg"
          />
        ) : (
          <div className="w-16 h-16 flex items-center justify-center bg-primary/5 rounded-lg">
            {getIcon(memory.docType || "file")}
          </div>
        )}
        <span className="text-sm font-medium line-clamp-2 flex-1">
          {memory.title}
        </span>
      </div>
      <div className="flex space-x-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCollection(memory);
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
                  onRemove(memory.id);
                }}
                variant="outline"
                size="icon"
                className="w-8 h-8"
                disabled={isLoading}
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
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
  );
}

