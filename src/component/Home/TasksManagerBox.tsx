"use client";
import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import TaskStatusCol from "./TaskStatusCol";
import { Columns, TaskItem } from "@/services/types";
import { HomeServices } from "@/services/home.services";

const TasksManagerBox: React.FC<{
  columns: Columns;
  handleChangeColumns: (val: Columns) => void;
}> = ({ columns, handleChangeColumns }) => {
  const isDataAvailable = Object.values(columns).some(
    (column) => column.items.length > 0
  );

  const onDragEnd = async (result: any) => {
    const { source, destination } = result;

    if (!destination) return;

    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = Array.from(sourceColumn.items);
    const destItems = Array.from(destColumn.items);
    const [removed] = sourceItems.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      sourceItems.splice(destination.index, 0, removed);
      handleChangeColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
      });
    } else {
      destItems.splice(destination.index, 0, removed);
      handleChangeColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      });

      try {
        await HomeServices.updateProcedures({
          id: removed.id,
          column: destination.droppableId,
        });
      } catch (error) {
        console.error("Failed to update procedure column:", error);
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-7.5 overflow-auto pb-5">
        {isDataAvailable ? (
          Object.entries(columns)?.map(([id, column]) => (
            <Droppable key={id} droppableId={id}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex flex-col gap-5 items-start"
                >
                  <TaskStatusCol
                    title={column.title}
                    color={column.color}
                    items={column.items}
                  />
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))
        ) : (
          <div className="flex items-center justify-center w-full h-full text-gray-500">
            No tasks available
          </div>
        )}
      </div>
    </DragDropContext>
  );
};

export default TasksManagerBox;
