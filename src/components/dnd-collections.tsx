"use client";

import React, { useState, useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { useToast } from "@/hooks/use-toast";

import { Collection, Memory } from "@prisma/client";

import { addMemoryToCollection } from "@/app/actions/add-memory-to-collection";
import { nanoid } from "@/lib/utils";

interface DNDCollectionProps {
  collections: Collection[];
  memories: Memory[];
}

type Item = {
  id: string;
  memoryId: string;
  title: string;
  fileUrl: string;
};

type Column = {
  id: string;
  title: string;
  items: Item[];
};

type BoardState = {
  columns: {
    [key: string]: Column;
  };
};

export function DNDCollection({ collections, memories }: DNDCollectionProps) {
  const [board, setBoard] = useState<BoardState>({ columns: {} });
  const { toast } = useToast();

   useEffect(() => {
     const initialColumns = collections.reduce((acc, collection, index) => {
       acc[`column${index + 1}`] = {
         id: `column${index + 1}`,
         title: collection.collectionName,
         items: collection.memories.map((memoryId) => {
           const memory = memories.find((m) => m.id === memoryId);
           return {
             id: nanoid(),
             memoryId,
             title: memory?.title || "Unknown Memory",
             fileUrl: memory?.fileUrl || "",
           };
         }),
       };
       return acc;
     }, {} as { [key: string]: Column });

     setBoard({ columns: initialColumns });
   }, [collections, memories]);

  const onDragEnd = async (result: DropResult) => {
    const { source, destination, type, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (type === "COLUMN") {
      const newColumnOrder = Object.keys(board.columns);
      const [removed] = newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, removed);

      const newColumns: BoardState["columns"] = {};
      newColumnOrder.forEach((key) => {
        newColumns[key] = board.columns[key];
      });

      setBoard({ columns: newColumns });
      return;
    }

    const sourceColumn = board.columns[source.droppableId];
    const destColumn = board.columns[destination.droppableId];
    const draggedItem = sourceColumn.items.find(
      (item) => item.id === draggableId
    );

    if (!draggedItem) return;

    // Check if the destination column already contains a memory with the same memoryId
    const isDuplicateMemory = destColumn.items.some(
      (item) => item.memoryId === draggedItem.memoryId
    );

    if (isDuplicateMemory) {
      toast({
        title: "Duplicate Memory",
        description: "This memory already exists in the destination collection.",
      });
      return;
    }

    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
    // lookup the memoryId from the result.draggableId
    const memoryId = sourceColumn.items.find(
      (item) => item.id === draggableId
    )?.memoryId;
    // lookup collectionId from the source.droppableId  
    let collectionId = collections[0].id;
    if (source.droppableId == "column1") collectionId = collections[1].id;
    // Call the server action to update the collection
    console.log("memoryId", memoryId);
    console.log("collectionId", collectionId);
    await addMemoryToCollection(memoryId!, collectionId);

    const newBoard = {
      columns: {
        ...board.columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      },
    };

    setBoard(newBoard);

    // Call the server action to update the collection
    // await addMemoryToCollection(removed.memoryId, destination.droppableId);
    console.log("result", result);  
  };


  return (
    <div className="flex flex-col items-center min-w-full">
      <h1 className="text-2xl font-bold mb-12">Collections</h1>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="board" type="COLUMN" direction="horizontal">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="flex flex-col sm:flex-row gap-4 min-w-full sm:min-w-0 space-x-12"
            >
              {Object.values(board.columns).map((column, index) => (
                <Draggable
                  key={column.id}
                  draggableId={column.id}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="bg-gray-100 p-4 rounded-lg shadow-sm min-w-[250px] flex-1 max-w-[350px] mb-4"
                    >
                      <h2
                        {...provided.dragHandleProps}
                        className="font-semibold mb-2 text-lg cursor-move"
                      >
                        {column.title}
                      </h2>
                      <Droppable droppableId={column.id} type="ITEM">
                        {(provided) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="min-h-[100px]"
                          >
                            {column.items.map((item, index) => (
                              <Draggable
                                key={item.id}
                                draggableId={item.id}
                                index={index}
                              >
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="flex items-center bg-white p-2 mb-2 rounded shadow-sm cursor-move text-sm"
                                  >
                                    <img
                                      src={item.fileUrl}
                                      alt={item.title}
                                      className="w-10 h-10 mr-2 rounded object-cover"
                                    />
                                    <span className="truncate">
                                      {item.title}
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
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

    </div>
  );
}
