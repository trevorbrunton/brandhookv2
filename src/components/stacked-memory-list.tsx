"use client";

import { type Memory } from "@prisma/client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MemoryList } from "./memory-list";

interface StackedMemoryListProps {
  memories: Memory[];
  collectionId: string;
}

export function StackedMemoryList({ memories, collectionId }: StackedMemoryListProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <AnimatePresence>
        {memories.map((memory, index) => (
          <motion.div
            key={memory.id}
            layout
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md"
            style={{ zIndex: memories.length - index }}
          >
            <motion.div
              className="bg-card rounded-xl shadow-lg overflow-hidden cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleExpand(index)}
            >
              <AnimatePresence>
                {expandedIndex === index ? (
                  <motion.div
                    key="expanded"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <MemoryList memories={[memory]} collectionId={collectionId} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="collapsed"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-4"
                  >
                    <h3 className="text-lg font-semibold truncate">{memory.title}</h3>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

