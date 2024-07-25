"use client";
import { Category, Users } from "@/services/types";
import { format } from "date-fns";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { HomeServices } from "@/services/home.services";
import { toast } from "react-toastify";

type FilterProps = {
  searchInput: string;
  setSearchInput: (val: string) => void;
  selectedUser: string;
  setSelectedUser: (val: string) => void;
  selectedLabel: string;
  setSelectedLabel: (val: string) => void;
  startDate: Date | undefined;
  setStartDate: (val: Date | undefined) => void;
  endDate: Date | undefined;
  setEndDate: (val: Date | undefined) => void;
};

const Filter = ({
  searchInput,
  setSearchInput,
  selectedUser,
  setSelectedUser,
  selectedLabel,
  setSelectedLabel,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}: FilterProps) => {
  // const [searchInput, setSearchInput] = useState<string>("");
  const [users, setUsers] = useState<Users[]>([]);
  // const [selectedUser, setSelectedUser] = useState<string>("");

  const [labels, setLabels] = useState<Category[]>([]);
  // const [selectedLabel, setSelectedLabel] = useState<string>("");

  // const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  // const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isLabelDropdownOpen, setIsLabelDropdownOpen] = useState(false);
  const [isDateOpen, setIsDateOpen] = useState(false);

  const formattedStartDate = startDate ? format(startDate, "dd/MM/yy") : "";
  const formattedEndDate = endDate ? format(endDate, "dd/MM/yy") : "";
  const nameDropdownRef = useRef<HTMLDivElement>(null);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);

  const toggleLabelDropdown = () => setIsLabelDropdownOpen((prev) => !prev);

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen((prev) => !prev);
  };

  const handleUserSelect = async (name: string) => {
    setSelectedUser(name);
    setIsUserDropdownOpen(false);
  };

  const handleLabelSelect = async (name: string) => {
    setSelectedLabel(name);
    setIsLabelDropdownOpen(false);
  };

  const handleRemoveUser = () => {
    setSelectedUser("");
  };

  const handleRemoveLabel = () => {
    setSelectedLabel("");
  };

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start ?? undefined);
    setEndDate(end ?? undefined);
    if (end) setIsDateOpen(false);
  };

  const openDatePicker = () => {
    setIsDateOpen(true);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      nameDropdownRef.current &&
      !nameDropdownRef.current.contains(event.target as Node)
    ) {
      setIsUserDropdownOpen(false);
    }
    if (
      categoryDropdownRef.current &&
      !categoryDropdownRef.current.contains(event.target as Node)
    ) {
      setIsLabelDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchUserProcedures = async () => {
      const res = await HomeServices.getUsers();
      if (typeof res !== "string") setUsers(res);
      else toast.error(res);
    };

    const fetchLabelProcedures = async () => {
      const res = await HomeServices.getCategories();
      if (typeof res !== "string") setLabels(res);
      else toast.error(res);
    };

    fetchUserProcedures();
    fetchLabelProcedures();
  }, []);

  return (
    <div className="flex flex-col gap-7.5">
      <div className="w-full max-w-[1290px] h-auto lg:h-[68px] rounded-[10px] p-[12px_12px_12px_14px] lg:gap-[33px] gap-[10px] bg-white flex flex-wrap lg:flex-nowrap">
        <div className="w-full lg:w-[300px] h-[44px] flex gap-[15px] border border-gray-300 rounded-[8px] p-[10px_18px] bg-[#F9FAFB]">
          <Image
            src="/image/Search.svg"
            alt="Search Icon"
            width={20}
            height={20}
            className="object-contain"
          />
          <input
            type="text"
            placeholder="Search procedure"
            className="w-full h-full border-none outline-none text-[16px] leading-[24px] font-[400] text-[#64748B] bg-[#F9FAFB]"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        <div className="w-full max-w-[931px] h-auto lg:h-[44px] gap-[10px] relative flex flex-wrap lg:flex-nowrap lg:justify-end">
          <div
            className="relative w-full lg:w-[128px] h-[44px] rounded-[8px] border p-[10px_18px_10px_12px] gap-[8px] text-[#F9FAFB] bg-[#F9FAFB] flex items-center cursor-pointer"
            ref={nameDropdownRef}
            onClick={toggleUserDropdown}
          >
            <div className="w-full lg:w-[70px] h-[24px] text-[14px] leading-[24px] font-[500] text-[#495270] whitespace-nowrap">
              {selectedUser}
            </div>
            {selectedUser ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-500 ml-2 cursor-pointer"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                onClick={handleRemoveUser}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <Image
                src="/image/User.svg"
                alt="User Icon"
                width={20}
                height={20}
                className="object-contain"
              />
            )}

            {isUserDropdownOpen && (
              <div className="absolute top-[100%] left-0 mt-2 w-full bg-[#E5E7EB] border rounded-[8px] shadow-lg z-10">
                {users.map((procedure) => (
                  <div
                    key={procedure._id}
                    className="p-2 text-[14px] text-[#495270] hover:bg-[#D1D5DB] cursor-pointer"
                    onClick={() => handleUserSelect(procedure.userName)}
                  >
                    {procedure.userName}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div
            className="relative w-full lg:w-[250px] h-[44px] rounded-[8px] border p-[10px_18px_10px_12px] gap-[8px] text-[#F9FAFB] bg-[#F9FAFB] flex items-center cursor-pointer"
            ref={categoryDropdownRef}
            onClick={toggleLabelDropdown}
          >
            <div className="w-full lg:w-[192px] h-[24px] text-[14px] leading-[24px] font-[500] text-[#64748B] whitespace-nowrap">
              {selectedLabel}
            </div>
            {selectedLabel ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-500 ml-2 cursor-pointer"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                onClick={handleRemoveLabel}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <Image
                src="/image/Widget.svg"
                alt="Widget Icon"
                width={20}
                height={20}
                className="object-contain"
              />
            )}

            {isLabelDropdownOpen && (
              <div className="absolute top-[100%] left-0 mt-2 w-full bg-[#E5E7EB] border rounded-[8px] shadow-lg z-10">
                {labels.map((procedure) => (
                  <div
                    key={procedure._id}
                    className="p-2 text-[14px] text-[#495270] hover:bg-[#D1D5DB] cursor-pointer"
                    onClick={() => handleLabelSelect(procedure.categoryName)}
                  >
                    {procedure.categoryName}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="relative w-full lg:w-[194px] h-[44px] rounded-lg border p-2 bg-[#F9FAFB] flex items-center cursor-pointer">
            <div className="flex-1 text-sm font-medium text-[#64748B] text-[14px]">
              {formattedStartDate && formattedEndDate
                ? `${formattedStartDate} - ${formattedEndDate}`
                : "Select Date Range"}
            </div>
            <DatePicker
              selected={startDate}
              onChange={handleDateChange}
              startDate={startDate}
              endDate={endDate}
              selectsRange
              dateFormat="dd/MM/yyyy"
              open={isDateOpen}
              onClickOutside={() => setIsDateOpen(false)}
              className="absolute inset-0 w-full h-full rounded-lg border-none bg-transparent opacity-0 cursor-pointer"
            />
            <Image
              src="/image/Calendar.svg"
              alt="Calendar Icon"
              width={20}
              height={20}
              className="object-contain ml-auto"
              onClick={openDatePicker}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filter;
