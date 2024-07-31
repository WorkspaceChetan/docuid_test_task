"use client";
import { Category, Users } from "@/services/types";
import { format, parseISO } from "date-fns";
import Image from "next/image";
import { useEffect, useState } from "react";
import { HomeServices } from "@/services/home.services";
import { toast } from "react-toastify";
import Dropdown from "../UIComponents/Dropdown";
import { useRouter, useSearchParams } from "next/navigation";
import Datepicker, { DateValueType } from "react-tailwindcss-datepicker";
import { FilterProps } from "@/types/FilterProps";

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
  const router = useRouter();
  const searchParams = useSearchParams();
  const [users, setUsers] = useState<Users[]>([]);
  const [labels, setLabels] = useState<Category[]>([]);
  const [dateRange, setDateRange] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: startDate || null,
    endDate: endDate || null,
  });

  const handleDateChange = (value: DateValueType) => {
    if (value && value.startDate && value.endDate) {
      const newStartDate =
        typeof value.startDate === "string"
          ? parseISO(value.startDate)
          : value.startDate;
      const newEndDate =
        typeof value.endDate === "string"
          ? parseISO(value.endDate)
          : value.endDate;

      setDateRange({
        startDate: newStartDate,
        endDate: newEndDate,
      });
      setStartDate(newStartDate || undefined);
      setEndDate(newEndDate || undefined);
    } else {
      setDateRange({
        startDate: null,
        endDate: null,
      });
      setStartDate(undefined);
      setEndDate(undefined);
    }
  };

  const updateSearchParams = (params: Record<string, string | undefined>) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newSearchParams.set(key, value);
      } else {
        newSearchParams.delete(key);
      }
    });

    router.replace(`?${newSearchParams.toString()}`);
  };

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

  useEffect(() => {
    updateSearchParams({
      search: searchInput,
      user: selectedUser,
      label: selectedLabel,
      startDate: startDate ? format(startDate, "yyyy-MM-dd") : undefined,
      endDate: endDate ? format(endDate, "yyyy-MM-dd") : undefined,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput, selectedUser, selectedLabel, startDate, endDate]);

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

        <div className="w-full max-w-[931px] h-auto lg:h-[44px] gap-[10px] relative flex flex flex-col lg:flex-row lg:justify-end">
          <div className="gap-[10px] relative flex lg:justify-end">
            <Dropdown
              items={users}
              selectedItem={selectedUser}
              setSelectedItem={setSelectedUser}
              itemRenderer={(item) => item.userName}
              placeholder="Select User"
              iconSrc="/image/User.svg"
              widthClass="lg:w-[128px]"
              handleRemove={() => setSelectedUser("")}
            />
            <Dropdown
              items={labels}
              selectedItem={selectedLabel}
              setSelectedItem={setSelectedLabel}
              itemRenderer={(item) => item.categoryName}
              placeholder="Select Category"
              iconSrc="/image/Widget.svg"
              widthClass="lg:w-[250px]"
              handleRemove={() => setSelectedLabel("")}
            />
          </div>

          <div className="relative w-full lg:w-[194px] h-[46px] rounded-lg border text-base">
            <Datepicker value={dateRange} onChange={handleDateChange} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filter;
