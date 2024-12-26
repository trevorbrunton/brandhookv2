"use client";

import React, { useState, useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { useToast } from "@/hooks/use-toast";

import { Input } from "@/components/ui/input";
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
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const initialData: BoardState = {
      columns: collections.reduce((acc, collection, index) => {
        const columnId = `column${index + 1}`;
        acc[columnId] = {
          id: columnId,
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
      }, {} as BoardState["columns"]),
    };

    //create of lookup table for item.id to memoryId
    const itemMemoryMap: Record<string, string> = {};
    collections.forEach((collection) => {
      collection.memories.forEach((memoryId) => {
        itemMemoryMap[memoryId] = collection.id;
      });
    });
    //create a lookup table for columnId to collectionId
    const columnCollectionMap: Record<string, string> = {};
    collections.forEach((collection, index) => {
      columnCollectionMap[`column${index + 1}`] = collection.id;
    });
    setBoard(initialData);
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

  const addNewColumn = () => {
    if (newColumnTitle.trim() === "") return;

    const newColumnId = `column${Object.keys(board.columns).length + 1}`;
    setBoard({
      columns: {
        ...board.columns,
        [newColumnId]: {
          id: newColumnId,
          title: newColumnTitle,
          items: [],
        },
      },
    });
    setNewColumnTitle("");
  };

  return (
    <div className="p-4 w-full overflow-x-auto">
      <h1 className="text-2xl font-bold mb-4">Collections</h1>
      <div className="flex flex-wrap gap-4 mb-4">
        {collections.map((collection) => (
          <div
            key={collection.id}
            className="bg-white p-4 rounded-lg shadow-sm flex-1 min-w-[250px]"
          >
            <h2 className="font-semibold mb-2 text-lg">
              {collection.collectionName}
            </h2>
            <p className="text-sm text-gray-600">
              {collection.collectionDetails}
            </p>
          </div>
        ))}
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="board" type="COLUMN" direction="horizontal">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="flex flex-col sm:flex-row gap-4 min-w-full sm:min-w-0"
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
      <div className="mt-4 flex flex-col sm:flex-row gap-2">
        <Input
          type="text"
          value={newColumnTitle}
          onChange={(e) => setNewColumnTitle(e.target.value)}
          placeholder="New column title"
          className="max-w-full sm:max-w-xs mb-2 sm:mb-0"
        />
        <button
          onClick={addNewColumn}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Add Column
        </button>
      </div>
    </div>
  );
}
