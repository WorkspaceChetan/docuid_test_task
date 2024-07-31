"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { HomeServices } from "@/services/home.services";
import {
  createProceduesParam,
  Category,
  AddUser,
  AddCategory,
} from "@/services/types";
import { toast } from "react-toastify";
import Dropdown from "../UIComponents/DropDownAdd";
import Datepicker, { DateValueType } from "react-tailwindcss-datepicker";
import { parseISO } from "date-fns/parseISO";

const validationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  priority: z.number().min(1, "Priority is required"),
  userId: z.string().min(1, "Username is required"),
  categoryId: z.string().min(1, "Category is required"),
  startDate: z
    .date({
      required_error: "Date is required",
      invalid_type_error: "That's not a date!",
    })
    .nullable(),
  column: z.string().optional(),
  endDate: z.date().optional().nullable(),
});

type FormValues = z.infer<typeof validationSchema>;

const HeadingBox = ({ fetchData }: { fetchData: () => Promise<void> }) => {
  const [showModal, setShowModal] = useState(false);
  const [userProcedures, setUserProcedures] = useState<AddUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>("");

  const [category, setCategory] = useState<AddCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const [selectedPriority, setSelectedPriority] = useState<number>(1);

  const [dateRange, setDateRange] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: null,
    endDate: null,
  });

  const {
    register,
    handleSubmit,
    setValue,
    resetField,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      title: "",
      priority: 1,
      userId: selectedUser,
      categoryId: selectedCategory,
      column: "todo",
      startDate: dateRange.startDate ?? null,
      endDate: dateRange.endDate ?? null,
    },
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
        startDate: newStartDate || null,
        endDate: newEndDate || null,
      });
      setValue("startDate", newStartDate || null);
      setValue("endDate", newEndDate || null);
    } else {
      setDateRange({
        startDate: null,
        endDate: null,
      });
      setValue("startDate", null);
      setValue("endDate", null);
    }
  };

  const handleSave = async (data: FormValues) => {
    try {
      const createAt = data.startDate
        ? format(data.startDate, "yyyy-MM-dd")
        : "";
      const dueDate = data.endDate ? format(data.endDate, "yyyy-MM-dd") : ""; // Handle null case
      const payload = {
        ...data,
        createAt,
        dueDate,
      };
      await HomeServices.createProcedues(
        payload as unknown as createProceduesParam
      );
      setShowModal(false);
      await fetchData();
      resetField("title");
      resetField("categoryId");
      toast.success("Success");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    const fetchUserProcedures = async () => {
      const data = await HomeServices.getUsers();

      if (typeof data !== "string") {
        setUserProcedures(data);
        if (data.length > 0) {
          setSelectedUser(data[0].userName);
          setValue("userId", data[0].id);
        }
      }
    };

    const fetchCategories = async () => {
      const data = await HomeServices.getCategories();

      if (typeof data !== "string") {
        setCategory(data);
        if (data.length > 0) {
          setSelectedCategory(data[0].name);
          setValue("categoryId", data[0].id);
        }
      }
    };

    fetchUserProcedures();
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="flex justify-between items-start md:items-end gap-3 flex-col md:flex-row">
        <div className="flex gap-1 items-start flex-col">
          <span className="text-2xl font-black text-primary-text">
            Projet champion 💪
          </span>
          <span className="text-sm font-normal text-secondary-text">
            Home / Projects / Projet champion 💪
          </span>
        </div>
        <button
          className="flex gap-2 h-11 rounded-lg py-2.5 pl-3 pr-4.5 bg-primary text-white font-black text-base"
          onClick={() => setShowModal(true)}
        >
          <Image src="/image/Add Square.svg" alt="add" width={20} height={20} />
          Create a new procedure
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-[40%] p-6 max-sm:w-3/4">
            <h2 className="text-xl font-semibold mb-4">Procedure</h2>
            <form onSubmit={handleSubmit(handleSave)}>
              <div className="mb-2">
                <label className="block text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  {...register("title")}
                  placeholder="Title"
                  className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-0 text-[14px]  text-[#495270] bg-[#F9FAFB]"
                />
                {errors.title && (
                  <div className="text-red-600 text-sm">
                    {errors.title.message}
                  </div>
                )}
              </div>
              <div className="mb-2">
                <Dropdown
                  items={Array.from({ length: 3 }, (_, i) => ({
                    id: (i + 1).toString(),
                    name: (i + 1).toString(),
                  }))}
                  selectedItem={selectedPriority.toString()}
                  onSelect={(id, name) => {
                    const priority = parseInt(id, 10);
                    setSelectedPriority(priority);
                    setValue("priority", priority);
                  }}
                  onRemove={() => {
                    setSelectedPriority(1);
                    setValue("priority", 1);
                  }}
                  placeholder="Select Priority"
                  iconSrc="/image/Priority.svg"
                  dropdownLabel="Priority"
                  error={errors.priority?.message}
                />
              </div>
              <div className="mb-2">
                <div className="flex justify-between gap-4">
                  <Dropdown
                    items={userProcedures.map(({ id, userName }) => ({
                      id: id,
                      name: userName,
                    }))}
                    selectedItem={selectedUser}
                    onSelect={(id, name) => {
                      setSelectedUser(name);
                      setValue("userId", id);
                    }}
                    onRemove={() => {
                      setSelectedUser("");
                      setValue("userId", "");
                    }}
                    placeholder="Select User"
                    iconSrc="/image/User.svg"
                    dropdownLabel="User"
                    error={errors.userId?.message}
                  />
                  <Dropdown
                    items={category.map(({ id, name }) => ({
                      id: id,
                      name: name,
                    }))}
                    selectedItem={selectedCategory}
                    onSelect={(id, name) => {
                      setSelectedCategory(name);
                      setValue("categoryId", id);
                    }}
                    onRemove={() => {
                      setSelectedCategory("");
                      setValue("categoryId", "");
                    }}
                    placeholder="Select Category"
                    iconSrc="/image/Widget.svg"
                    dropdownLabel="Category"
                    error={errors.categoryId?.message}
                  />
                </div>
              </div>
              <div className="w-full max-w-[931px] h-auto gap-[10px] mb-2">
                <label className="text-gray-700 mb-1">Date</label>
                <div className="border border-gray-300 rounded-md">
                  <Datepicker value={dateRange} onChange={handleDateChange} />
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  className="px-4 py-2 mr-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                >
                  Save
                </button>
                <button
                  type="button"
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeadingBox;
