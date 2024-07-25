"use client";

import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import TaskStatusCol from "./TaskStatusCol";
import { Columns, TaskItem } from "@/services/types";
import { HomeServices } from "@/services/home.services";

const initialColumns: Columns = {
  todo: {
    id: "todo",
    title: "Todo",
    color: "[#0CBE5E]",
    items: [],
  },
  doing: {
    id: "doing",
    title: "On doing",
    color: "[#FFDD0F]",
    items: [],
  },
  done: {
    id: "done",
    title: "Done",
    color: "primary",
    items: [],
  },
  waiting: {
    id: "waiting",
    title: "Waiting",
    color: "[#64748B]",
    items: [],
  },
};

const TasksManagerBox: React.FC<{
  selectedName: string;
  selectedCategory: string;
  searchInput: string;
  startDate?: Date;
  endDate?: Date;
}> = ({ selectedName, selectedCategory, searchInput, startDate, endDate }) => {
  const [columns, setColumns] = useState<Columns>(initialColumns);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const procedures = await HomeServices.getProcedues();

        if (Array.isArray(procedures)) {
          const newColumns: Columns = { ...initialColumns };

          const filteredProcedures = procedures.filter((procedure) => {
            const matchesName =
              !selectedName || procedure.user.userName === selectedName;
            const matchesCategory =
              !selectedCategory ||
              procedure.category[0]?.categoryName === selectedCategory;
            const matchesSearch =
              !searchInput ||
              procedure.title.toLowerCase().includes(searchInput.toLowerCase());

            const taskCreatedDate = new Date(procedure.createAt);
            const taskDueDate = new Date(procedure.dueDate);

            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;

            const matchesDateRange =
              (!start || taskCreatedDate >= start) &&
              (!end || taskDueDate <= end);

            return (
              matchesName &&
              matchesCategory &&
              matchesSearch &&
              matchesDateRange
            );
          });
          filteredProcedures.forEach((procedure) => {
            const taskDate = new Date(procedure.dueDate);
            const task: TaskItem = {
              id: procedure._id,
              label: procedure.category[0]?.categoryName || "",
              description: procedure.title,
              user: procedure.user.userName,
              date: taskDate.toLocaleDateString(),
              priority: procedure.priority,
            };

            const columnItems = newColumns[procedure.column]?.items || [];
            if (!columnItems.some((item) => item.id === task.id)) {
              newColumns[procedure.column] = {
                ...newColumns[procedure.column],
                items: [...columnItems, task],
              };
            }
          });

          setColumns(newColumns);
        } else {
          console.error("Procedures is not an array:", procedures);
        }
      } catch (error) {
        console.error("Failed to fetch procedures:", error);
      }
    };

    fetchData();
  }, [selectedName, selectedCategory, searchInput, startDate, endDate]);

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
      setColumns((prevColumns) => ({
        ...prevColumns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
      }));
    } else {
      destItems.splice(destination.index, 0, removed);
      setColumns((prevColumns) => ({
        ...prevColumns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      }));

      try {
        await HomeServices.updateProcedures({
          _id: removed.id,
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
        {Object.entries(columns)?.map(([id, column]) => (
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
        ))}
      </div>
    </DragDropContext>
  );
};

export default TasksManagerBox;
