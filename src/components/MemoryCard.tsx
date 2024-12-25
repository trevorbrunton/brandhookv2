"use client";

import { type Memory } from "@prisma/client";
import { File, Folder, Image, Video, Music, FileText } from 'lucide-react';
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

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
  onSelect
}: MemoryCardProps) {
  const getIcon = (type: string) => {
    const IconComponent = iconMap[type as keyof typeof iconMap] || File;
    return <IconComponent className="w-8 h-8 text-primary" />;
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(memory)}
      className={`flex items-center justify-between p-2 rounded-xl shadow-sm transition-all duration-300 cursor-pointer overflow-hidden w-full h-20 ${
        isSelected
          ? "border-2 border-primary bg-primary/10"
          : "bg-card hover:bg-accent"
      }`}
      aria-label={memory.title}
    >
      <div className="flex items-center space-x-4 flex-1 min-w-0">
        {memory.docType === "image" ? (
          <img
            src={memory.fileUrl ? memory.fileUrl : "/placeholder.svg?height=64&width=64"}
            alt={memory.title}
            className="w-16 h-16 object-cover rounded-lg"
          />
        ) : (
          <div className="w-16 h-16 flex items-center justify-center bg-primary/5 rounded-lg">
            {getIcon(memory.docType || "file")}
          </div>
        )}
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-medium truncate">
            {memory.title}
          </span>
          <Badge variant="secondary" className="mt-1">
            {memory.docType || "file"}
          </Badge>
        </div>
      </div>
    </motion.div>
  );
}

