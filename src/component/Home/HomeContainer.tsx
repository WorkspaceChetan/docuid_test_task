"use client";
import { Procedures, Columns, TaskItem } from "@/services/types";
import React, { useCallback, useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import TasksManagerBox from "./TasksManagerBox";
import { HomeServices } from "@/services/home.services";
import Filter from "./Filter";
import HeadingBox from "./HeadingBox";

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

const HomeContainer = ({ procedures }: { procedures: Procedures[] }) => {
  const [searchInput, setSearchInput] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<string>("");

  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const getProcessedColumns = (data?: Procedures[]) => {
    const collection = data?.length ? data : procedures;
    if (Array.isArray(collection)) {
      const newColumns: Columns = { ...initialColumns };

      const filteredProcedures = collection.filter((procedure) => {
        const matchesName =
          !selectedUser || procedure.user.userName === selectedUser;
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
          (!start || taskCreatedDate >= start) && (!end || taskDueDate <= end);

        return (
          matchesName && matchesCategory && matchesSearch && matchesDateRange
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

      return newColumns;
    }

    return initialColumns;
  };

  const [columns, setColumns] = useState<Columns>(getProcessedColumns());

  const fetchData = useCallback(async () => {
    try {
      const procedures = await HomeServices.getProcedues();
      if (typeof procedures !== "string") {
        setColumns(getProcessedColumns(procedures));
      }
    } catch (error) {
      console.error("Failed to fetch procedures:", error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchData();
  }, [
    selectedUser,
    selectedCategory,
    searchInput,
    startDate,
    endDate,
    fetchData,
  ]);

  const handleChangeColumns = (val: Columns) => {
    setColumns(val);
  };

  return (
    <>
      <HeadingBox fetchData={fetchData} />
      <div className="flex flex-col gap-7.5">
        <Filter
          searchInput={searchInput}
          selectedLabel={selectedCategory}
          selectedUser={selectedUser}
          startDate={startDate}
          endDate={endDate}
          setStartDate={(val) => setStartDate(val)}
          setEndDate={(val) => setEndDate(val)}
          setSearchInput={(val) => setSearchInput(val)}
          setSelectedLabel={(val) => setSelectedCategory(val)}
          setSelectedUser={(val) => setSelectedUser(val)}
        />
        <TasksManagerBox
          columns={columns}
          handleChangeColumns={handleChangeColumns}
        />
      </div>
    </>
  );
};

export default HomeContainer;
