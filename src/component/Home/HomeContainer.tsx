"use client";
import { GetProcedures, Category, Users } from "@/services/types";
import { format } from "date-fns";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TasksManagerBox from "./TasksManagerBox";
import { HomeServices } from "@/services/home.services";
import useRebounceSearch from "@/hooks/useRebounceSearch";
import Filter from "./Filter";

const HomeContainer = ({ procedures }: { procedures: GetProcedures[] }) => {
  const [searchInput, setSearchInput] = useState<string>("");
  const debouncedSearchInput = useRebounceSearch(searchInput, 500);
  const [selectedUser, setSelectedUser] = useState<string>("");

  const [selectedLabel, setSelectedLabel] = useState<string>("");

  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  return (
    <div className="flex flex-col gap-7.5">
      <Filter
        searchInput={searchInput}
        selectedLabel={selectedLabel}
        selectedUser={selectedUser}
        startDate={startDate}
        endDate={endDate}
        setStartDate={(val) => setStartDate(val)}
        setEndDate={(val) => setEndDate(val)}
        setSearchInput={(val) => setSearchInput(val)}
        setSelectedLabel={(val) => setSelectedLabel(val)}
        setSelectedUser={(val) => setSelectedUser(val)}
      />
      <TasksManagerBox
        selectedName={selectedUser}
        selectedCategory={selectedLabel}
        searchInput={debouncedSearchInput}
        startDate={startDate}
        endDate={endDate}
      />
    </div>
  );
};

export default HomeContainer;
