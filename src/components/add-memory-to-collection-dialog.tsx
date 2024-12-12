"use client";
import { useState, useEffect } from "react";
import { addMemoryToCollection } from "@/app/actions/add-memory-to-collection";
import { useToast } from "@/hooks/use-toast";
import { type Collection } from "@prisma/client";
import { type Memory } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface AddMemoryToCollectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMemoryForCollection: Memory | null;
}

export function AddMemoryToCollectionDialog({
  isOpen,
  onClose,
  selectedMemoryForCollection,
}: AddMemoryToCollectionDialogProps) {
  const [selectedCollection, setSelectedCollection] = useState("");
  const [collections, setCollections] = useState<Collection[]>([]);
  const { toast } = useToast();
const router = useRouter();


  //DEV NOTE - CHANGE THIS TO USE REACT-QUERY
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await fetch("/api/fetch-collections-by-userId");
        const data = await response.json();
        setCollections(data);
      } catch (error) {
        console.error("Failed to fetch collections:", error);
      }
    };

    fetchCollections();
  }, []);

  const handleSelect = async () => {
    console.log("Selected Collection:", selectedCollection);
    console.log("Selected Memory:", selectedMemoryForCollection);
    try {
      if (selectedMemoryForCollection) {
        await addMemoryToCollection(
          selectedMemoryForCollection.id,
          selectedCollection
        );
        toast({
          title: "Success",
          description: "Memory added to collection successfully",
        });
        router.push(`/collection/${selectedCollection}`);
        onClose();
      } else {
        throw new Error("No memory selected");
      }
    } catch (error) {
      console.error("Error adding memory to collection:", error);
      toast({
        title: "Error",
        description: "Failed to add memory to collection",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      {!collections ? null : (  
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add to Collection</DialogTitle>
          </DialogHeader>
          <Select
            onValueChange={setSelectedCollection}
            value={selectedCollection}
          >
            <SelectTrigger>
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
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSelect} disabled={!selectedCollection}>
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>)}
    </>
  );
}
