"use client";
import { TaskItem } from "@/services/types";
import Image from "next/image";
import { useEffect, useState } from "react";
import ProcedureModelEdit from "./ProcedureModelEdit";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";

const TaskCard = (item: TaskItem) => {
  const [open, setIsOpen] = useState(false);
  const [formattedDate, setFormattedDate] = useState("");

  const modelOpen = () => {
    setIsOpen(true);
  };

  const closeModel = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const date = new Date(item.date);
    setFormattedDate(format(date, "dd/MM/yyyy", { locale: enUS }));
  }, [item.date]);

  return (
    <>
      <div
        className="w-full max-w-[300px] flex flex-wrap rounded-md w-76 bg-white p-[20px]"
        onClick={(e) => {
          e.preventDefault();
          modelOpen();
        }}
      >
        <div className="w-full max-w-[260px] flex flex-col gap-[10px]">
          <div className="w-full flex gap-[10px]">
            <div className="rounded-full p-[2px_10px] bg-[rgba(99,91,255,0.05)] flex justify-center">
              {Array.from(Array(item.priority)).map((_, i) => (
                <Image
                  src="/image/fire 1.png"
                  alt="fire"
                  width={12}
                  height={12}
                  key={i}
                  className="h-[12px] w-[12px]"
                />
              ))}
            </div>
            <div className="w-full max-w-[75px] text-xs font-medium border rounded-full text-gray-700 border-gray-300 flex items-center justify-center">
              <div className="w-full h-[16px] font-normal leading-[16px] text-[10px] font-inter text-center">
                {item.label}
              </div>
            </div>
          </div>
          <span className="w-[260px] lett font-semibold font-inter leading-[24px] text-[16px] text-grey-text tracking-wide">
            {item.description}
          </span>
          <div className="w-full max-w-[89px] flex gap-[5px]">
            <Image
              src="/image/profile.svg"
              alt="profile"
              width={24}
              height={24}
            />
            <span className="w-full max-w-[60px] leading-[20px] font-medium text-[12px] text-[#1C274C] font-inter">
              {item.user}
            </span>
          </div>
          <hr className="w-full" />
          <div className="flex justify-between items-center w-full h-[16px]">
            <div className="flex gap-[6px] items-center rounded-full px-[0.4rem] py-[0.25rem] bg-light-grey">
              <Image
                src="/image/History.svg"
                alt="history"
                width={12}
                height={12}
              />
              <span className="text-[12px] leading-[10px] font-semibold text-[#1C274C] font-inter">
                Due date: {formattedDate}
              </span>
            </div>
            <div className="flex items-center gap-[5px]">
              <Image
                src="/image/Chat Round Line.svg"
                alt="Chat Round Line"
                width={14}
                height={14}
              />
              <span className="text-[12px] font-semibold text-secondary-text font-inter">
                1
              </span>
            </div>
          </div>
        </div>
      </div>

      {open && <ProcedureModelEdit closeModel={closeModel} item={item} />}
    </>
  );
};

export default TaskCard;
