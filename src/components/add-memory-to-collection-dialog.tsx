import { useState } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { Memory } from "@prisma/client";
import {type Collection } from "@prisma/client";




interface AddMemoryToCollectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  collections: Collection[];
  selectedMemoryForCollection: Memory | null;
}

export function AddMemoryToCollectionDialog({
  isOpen,
  onClose,
  collections,
  selectedMemoryForCollection,
}: AddMemoryToCollectionDialogProps) {
  const [selectedCollection, setSelectedCollection] = useState("");
  const { toast } = useToast();
  console.log("collections", collections);

  const handleSelect = async () => {
    console.log("Selected Collection:", selectedCollection);
    console.log("Selected Memory:", selectedMemoryForCollection);
    try {
      const response = await fetch("/api/add-memory-to-collection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          memoryId: selectedMemoryForCollection?.id || "",
          collectionId: selectedCollection,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add memory to collection");
      }
      toast({
        title: "Success",
        description: "Memory added to collection successfully",
      });
      onClose();
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
              <SelectItem key={collection.id} value={collection.collectionId}>
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
    </Dialog>
  );
}
