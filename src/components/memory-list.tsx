"use client";

import { type Memory } from "@prisma/client";
import { File, Folder, Image, Video, Music, FileText } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

interface MemoryIconListProps {
  memories: Memory[];
}

const iconMap = {
  file: File,
  folder: Folder,
  image: Image,
  video: Video,
  audio: Music,
  document: FileText,
};

export function MemoryList({ memories }: MemoryIconListProps) {
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);

  const handleClick = (memory: Memory) => {
    setSelectedMemory(memory);
    console.log("Memory clicked:", memory);
  };

  const getIcon = (type: string) => {
    const IconComponent = iconMap[type as keyof typeof iconMap] || File;
    return <IconComponent className="w-12 h-12" />;
  };

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
                ? "bg-primary text-primary-foreground"
                : "bg-card hover:bg-accent"
            }`}
            aria-label={memory.title}
          >
            {getIcon(memory.docType || "file")}
            <span className="mt-2 text-sm font-medium text-center line-clamp-2">
              {memory.title}
            </span>
          </motion.div>
        ))}
      </div>
      {selectedMemory && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 p-6 bg-card rounded-lg shadow-lg"
        >
          <h2 className="text-2xl font-bold mb-4">{selectedMemory.title}</h2>
          <p className="text-muted-foreground">{selectedMemory.fileUrl}</p>
        </motion.div>
      )}
    </div>
  );
}
