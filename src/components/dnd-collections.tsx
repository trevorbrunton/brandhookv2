'use client'

import React, { useState } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'

import { Input } from '@/components/ui/input'

// Define types for our data structure
type Item = {
  id: string
  content: string
}

type Column = {
  id: string
  title: string
  items: Item[]
}

type BoardState = {
  columns: {
    [key: string]: Column
  }
}

const initialData: BoardState = {
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'To Do',
      items: [
        { id: 'item-1', content: 'First task' },
        { id: 'item-2', content: 'Second task' },
      ],
    },
    'column-2': {
      id: 'column-2',
      title: 'In Progress',
      items: [
        { id: 'item-3', content: 'Third task' },
      ],
    },
    'column-3': {
      id: 'column-3',
      title: 'Done',
      items: [
        { id: 'item-4', content: 'Fourth task' },
      ],
    },
  },
}

export function Kanban() {
  const [board, setBoard] = useState<BoardState>(initialData)
  const [newColumnTitle, setNewColumnTitle] = useState('')

  const onDragEnd = (result: DropResult) => {
    const { source, destination, type } = result

    if (!destination) return

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    if (type === 'COLUMN') {
      const newColumnOrder = Object.keys(board.columns)
      const [removed] = newColumnOrder.splice(source.index, 1)
      newColumnOrder.splice(destination.index, 0, removed)

      const newColumns: BoardState['columns'] = {}
      newColumnOrder.forEach((key) => {
        newColumns[key] = board.columns[key]
      })

      setBoard({ columns: newColumns })
      return
    }

    const sourceColumn = board.columns[source.droppableId]
    const destColumn = board.columns[destination.droppableId]
    const sourceItems = [...sourceColumn.items]
    const destItems = [...destColumn.items]
    const [removed] = sourceItems.splice(source.index, 1)
    destItems.splice(destination.index, 0, removed)

    setBoard({
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
    })
  }





  return (
    <div className="p-4 w-full overflow-x-auto">
      <h1 className="text-2xl font-bold mb-4">Kanban Board</h1>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="board" type="COLUMN" direction="horizontal">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="flex flex-col sm:flex-row gap-4 min-w-full sm:min-w-0"
            >
              {Object.values(board.columns).map((column, index) => (
                <Draggable key={column.id} draggableId={column.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="bg-gray-100 p-4 rounded-lg shadow-sm min-w-[250px] w-full sm:w-[250px] mb-4 sm:mb-0"
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
                              <Draggable key={item.id} draggableId={item.id} index={index}>
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="bg-white p-2 mb-2 rounded shadow-sm cursor-move"
                                  >
                                    {item.content}
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

      </div>
    </div>
  )
}

