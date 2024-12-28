"use client";

import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useQuery } from "@tanstack/react-query";
import { Collection, Memory } from "@prisma/client";
import { fetchMemoriesByCollection } from "@/app/actions/fetch-memories-by-collection";
import { fetchCollectionsByUserId } from "@/app/actions/fetch-collections-by-userId";


interface CollectionSelectorProps {
  setCollection: (collection: Collection) => void;
  setMemories: (memories: Memory[]) => void;
}

export function CollectionSelector({setCollection, setMemories}: CollectionSelectorProps) {
  const [selectedCollection, setSelectedCollection] = useState<string | null>(
    null
  );

  const { data: collections } = useQuery<Collection[]>({
    queryKey: ["collections"],
    queryFn: async (): Promise<Collection[]> => {
      const response = await fetchCollectionsByUserId();
      if (!Array.isArray(response)) {
        throw new Error("Invalid response format");
      }
      console.log("collections from query", response);
      setCollection(
        collections?.find((c) => c.id === selectedCollection) as Collection
      );
      return response;
    },
  });


  const {} = useQuery<Memory[]>({
    queryKey: ["memories", selectedCollection],
    queryFn: async () => {
      if (selectedCollection === null) return [];
      const collection = collections?.find((c) => c.id === selectedCollection);
      if (!collection) return [];
      const memories = await fetchMemoriesByCollection(collection);
      setMemories(memories as Memory[]);
      return Array.isArray(memories) ? memories : [];
    },
    enabled: !!selectedCollection && !!collections,
  });





  const handleSelectCollection = (collectionId: string) => {
    setSelectedCollection(collectionId);
    setCollection(collections?.find((c) => c.id === collectionId) as Collection);
    
  };

  return (
    <>

      {!collections ? null : (
        <div className="grid gap-4 py-4 lg:min-w-64 min-w-52">
          <Select onValueChange={handleSelectCollection}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a collection" />
            </SelectTrigger>
            <SelectContent>
              {collections.map((collection) => (
                <SelectItem key={collection.id} value={collection.id}>
                  {collection.collectionName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </>
  );
}
