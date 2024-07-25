import React from "react";
import { Draggable } from "react-beautiful-dnd";
import TaskCard from "./TaskCard";
import { TaskStatusColProps } from "@/services/types";

const TaskStatusCol: React.FC<TaskStatusColProps> = ({
  title,
  color,
  items,
}) => {
  return (
    <div className="flex flex-col gap-5 items-start w-[300px]">
      <div className="flex gap-2.5 items-center">
        <div className={`bg-${color} rounded-full w-4 h-4`} />
        <div className="text-primary-text text-sm font-black text-[14px] leading-[22px]">
          {title} ({items.length})
        </div>
      </div>
      {items.map((item, index) => (
        <Draggable key={item.id} draggableId={item.id} index={index}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className="w-full"
            >
              <TaskCard {...item} />
            </div>
          )}
        </Draggable>
      ))}
    </div>
  );
};

export default TaskStatusCol;
