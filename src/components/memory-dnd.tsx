"use client";

import React, { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
// import { useToast } from "@/hooks/use-toast";

import { Collection, Memory } from "@prisma/client";

// import { addMemoryToCollection } from "@/app/actions/add-memory-to-collection";


interface MemoryDndProps {
  collections: Collection[];
  memories: Memory[][];
}


export function MemoryDnd({ collections, memories }: MemoryDndProps) {
  const [board, setBoard] = useState([collections[0], collections[1]]);
  const [savedMemories, setMemories] = useState([memories[0], memories[1]]); 
  // const { toast } = useToast();



  useEffect(() => {
    setBoard([collections[0], collections[1]]);
    setMemories([memories[0], memories[1]]);
  }, [collections, memories]);

  if (collections.length < 2) return null;

  const onDragEnd = async (result: DropResult) => {
    
    const { source, destination, draggableId } = result;

      if (!destination) return;

      if (source.droppableId === destination.droppableId) {
        return;
      }
    const destinationCollectionId = destination.droppableId;

  //find destinationCollectionId in collections and return the index of the collection
    const destinationCollectionIndex = collections.findIndex(
      (collection) => collection.id === destinationCollectionId
    );

    const memoryId = draggableId.split("*")[1];
    //find the memoryId in memories and return the first memory
    const flattenedMemories = memories.flat();
    const memory = flattenedMemories.find((memory) => memory.id === memoryId);
 
    //Add memory to memories[destinationCollectionIndex]
    const newMemories = [...memories];
    if (memory) {
      // if memory.id is not in destinationCollection, add it
      if (!newMemories[destinationCollectionIndex].find((m) => m.id === memory.id))
      newMemories[destinationCollectionIndex].push(memory);
    }
    setMemories(newMemories);
    
    



    // add memoryId to destinationCollection
    // await addMemoryToCollection({
    //   memoryId,
    //   collectionId: destinationCollectionId,
    // });


    console.log("memoryId", memoryId);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-2 gap-12 mx-40">
        {board[0] &&
          board[1] &&
          board.map((collection, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-4">
              {collection.collectionName}
              <Droppable droppableId={collection.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="min-h-full "
                  >
                  {Array.isArray(savedMemories[index]) &&
                    savedMemories[index].map((memory, index) => (
                      <Draggable
                        key={memory.id}
                        draggableId={collection.id+ "*" + memory.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="flex items-center bg-white rounded-lg border-2 p-2 mt-2"
                          >
                            <img
                              src={memory.fileUrl || ""}
                              alt={memory.title || ""}
                              className="w-10 h-10 mr-2 rounded object-cover"
                            />
                            <span className="truncate">
                              {memory.title || ""}
                            </span>
                           
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
                )}
              </Droppable>
            </div>
          ))}
      </div>
    </DragDropContext>
  );
}
