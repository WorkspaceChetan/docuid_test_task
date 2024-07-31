import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { z } from "zod";
import { HomeServices } from "@/services/home.services";
import {
  AddCategory,
  AddUser,
  Category,
  TaskItem,
  Users,
  updateProceduresModelParam,
} from "@/services/types";
import { toast } from "react-toastify";
import { Formik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";

const validationSchema = z.object({
  title: z.string().nonempty("Title is required"),
  priority: z.number().min(1).max(3, "Priority must be between 1 and 3"),
  user: z.string().nonempty("User is required"),
  category: z.string().nonempty("Category is required"),
  startDate: z.string().nonempty("Start Date is required"),
  column: z.string().optional(),
  endDate: z.string().nonempty("End Date is required"),
});

const ProcedureModelEdit = ({
  fetchData,
  closeModel,
  item,
}: {
  fetchData?: () => Promise<void>;
  closeModel: () => void;
  item: TaskItem;
}) => {
  const [userProcedures, setUserProcedures] = useState<AddUser[]>([]);
  const [categories, setCategories] = useState<AddCategory[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>(item.userId);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    item.categoryId
  );
  const [selectedPriority, setSelectedPriority] = useState<number>(
    item.priority
  );

  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false);

  const nameDropdownRef = useRef<HTMLDivElement>(null);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const priorityDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUserProcedures = async () => {
      const data = await HomeServices.getUsers();
      if (typeof data !== "string") {
        setUserProcedures(data);
      }
    };

    const fetchCategories = async () => {
      const data = await HomeServices.getCategories();
      if (typeof data !== "string") {
        setCategories(data);
      }
    };

    fetchUserProcedures();
    fetchCategories();
  }, []);

  useEffect(() => {
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
        setIsCategoryDropdownOpen(false);
      }
      if (
        priorityDropdownRef.current &&
        !priorityDropdownRef.current.contains(event.target as Node)
      ) {
        setIsPriorityDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleUserSelect = (user: AddUser) => {
    setSelectedUserId(user.id);
    setIsUserDropdownOpen(false);
  };

  const handleCategorySelect = (cat: AddCategory) => {
    setSelectedCategoryId(cat.id);
    setIsCategoryDropdownOpen(false);
  };

  const handlePrioritySelect = (priority: number) => {
    setSelectedPriority(priority);
    setIsPriorityDropdownOpen(false);
  };

  const getUserNameById = (id: string) => {
    const user = userProcedures.find((user) => user.id === id);
    return user ? user.userName : "Select User";
  };

  const getCategoryNameById = (id: string) => {
    const category = categories.find((cat) => cat.id === id);
    return category ? category.name : "Select Category";
  };

  return (
    <Formik
      enableReinitialize
      initialValues={{
        _id: item.id,
        title: item.description,
        priority: selectedPriority,
        user: selectedUserId,
        category: selectedCategoryId,
        column: "todo",
        startDate: item.startDate,
        endDate: item.date,
      }}
      validationSchema={toFormikValidationSchema(validationSchema)}
      onSubmit={async (values) => {
        try {
          const payload = {
            ...values,
            user: selectedUserId,
            category: selectedCategoryId,
            createAt: format(new Date(values.startDate), "yyyy-MM-dd"),
            dueDate: format(new Date(values.endDate), "yyyy-MM-dd"),
          };

          const data = await HomeServices.updateProceduresModel(
            payload as unknown as updateProceduresModelParam
          );
          if (fetchData) await fetchData();
          toast.success("Success");
        } catch (err: any) {
          toast.error(err.message || "An error occurred");
        }
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldValue,
      }) => (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-[40%] p-6 max-sm:w-3/4">
            <h2 className="text-xl font-semibold mb-4">Procedure</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-2">
                <label htmlFor="title" className="block text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  placeholder="Title"
                  className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-0 text-[14px] text-[#495270] bg-[#F9FAFB]"
                  value={values.title}
                  name="title"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.title && touched.title && (
                  <div className="text-red-600 text-sm">{errors.title}</div>
                )}
              </div>

              <div className="mb-2">
                <label className="block text-gray-700 mb-1">Priority</label>
                <div
                  className="relative w-full lg:w-[128px] h-[44px] rounded-[8px] border p-[10px_18px_10px_12px] gap-[8px] text-[#F9FAFB] bg-[#F9FAFB] flex items-center cursor-pointer"
                  ref={priorityDropdownRef}
                  onClick={() => setIsPriorityDropdownOpen((prev) => !prev)}
                >
                  <div className="w-full lg:w-[70px] h-[24px] text-[14px] leading-[24px] font-[500] text-[#495270] whitespace-nowrap">
                    {selectedPriority}
                  </div>
                  {isPriorityDropdownOpen && (
                    <div className="absolute top-[100%] left-0 mt-2 w-full bg-[#E5E7EB] border rounded-[8px] shadow-lg z-10">
                      {Array.from({ length: 3 }, (_, i) => (
                        <div
                          key={i + 1}
                          className="p-2 text-[14px] text-[#495270] hover:bg-[#D1D5DB] cursor-pointer"
                          onClick={() => handlePrioritySelect(i + 1)}
                        >
                          {i + 1}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {errors.priority && touched.priority && (
                  <div className="text-red-600 text-sm">{errors.priority}</div>
                )}
              </div>

              <div className="mb-2">
                <div className="flex justify-between gap-4">
                  <div className="flex flex-col">
                    <label className="block text-gray-700 mb-1">User</label>
                    <div
                      className="relative w-full lg:w-[128px] h-[44px] rounded-[8px] border p-[10px_18px_10px_12px] gap-[8px] text-[#F9FAFB] bg-[#F9FAFB] flex items-center cursor-pointer"
                      ref={nameDropdownRef}
                      onClick={() => setIsUserDropdownOpen((prev) => !prev)}
                    >
                      <div className="w-full lg:w-[70px] h-[24px] text-[14px] leading-[24px] font-[500] text-[#495270] whitespace-nowrap">
                        {getUserNameById(selectedUserId) || "Select User"}
                      </div>
                      {selectedUserId && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-gray-500 ml-2 cursor-pointer"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          onClick={() => {
                            setSelectedUserId("");
                            setFieldValue("user", "");
                          }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      )}
                      {!selectedUserId && (
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
                          {userProcedures.map((user) => (
                            <div
                              key={user.id}
                              className="p-2 text-[14px] text-[#495270] hover:bg-[#D1D5DB] cursor-pointer"
                              onClick={() => {
                                handleUserSelect(user);
                                setFieldValue("user", user.id);
                              }}
                            >
                              {user.userName}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {errors.user && touched.user && (
                      <div className="text-red-600 text-sm">{errors.user}</div>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <label className="block text-gray-700 mb-1">Category</label>
                    <div
                      className="relative w-full h-[44px] rounded-[8px] border p-[10px_18px_10px_12px] gap-[8px] text-[#F9FAFB] bg-[#F9FAFB] flex items-center cursor-pointer"
                      ref={categoryDropdownRef}
                      onClick={() => setIsCategoryDropdownOpen((prev) => !prev)}
                    >
                      <div className="w-full lg:w-[192px] h-[24px] text-[14px] leading-[24px] font-[500] text-[#64748B] whitespace-nowrap">
                        {getCategoryNameById(selectedCategoryId) ||
                          "Select Category"}
                      </div>
                      {selectedCategoryId && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-gray-500 ml-2 cursor-pointer"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          onClick={() => {
                            setSelectedCategoryId("");
                            setFieldValue("category", "");
                          }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      )}
                      {!selectedCategoryId && (
                        <Image
                          src="/image/Widget.svg"
                          alt="Widget Icon"
                          width={20}
                          height={20}
                          className="object-contain"
                        />
                      )}
                      {isCategoryDropdownOpen && (
                        <div className="absolute top-[100%] left-0 mt-2 w-full bg-[#E5E7EB] border rounded-[8px] shadow-lg z-10">
                          {categories.map((cat) => (
                            <div
                              key={cat.id}
                              className="p-2 text-[14px] text-[#495270] hover:bg-[#D1D5DB] cursor-pointer"
                              onClick={() => {
                                handleCategorySelect(cat);
                                setFieldValue("category", cat.id);
                              }}
                            >
                              {cat.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {errors.category && touched.category && (
                      <div className="text-red-600 text-sm">
                        {errors.category}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="mb-2">
                <label className="block text-gray-700 mb-1">Start Date</label>
                <DatePicker
                  selected={
                    values.startDate ? new Date(values.startDate) : null
                  }
                  onChange={(date) => {
                    setFieldValue(
                      "startDate",
                      date ? format(date, "yyyy-MM-dd") : ""
                    );
                  }}
                  className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-0 text-[14px] text-[#495270] bg-[#F9FAFB]"
                  placeholderText="Select start date"
                  dateFormat="dd/MM/yy"
                />
                {errors.startDate && touched.startDate && (
                  <div className="text-red-600 text-sm">{errors.startDate}</div>
                )}
              </div>

              <div className="mb-2">
                <label className="block text-gray-700 mb-1">End Date</label>
                <DatePicker
                  selected={values.endDate ? new Date(values.endDate) : null}
                  onChange={(date) => {
                    setFieldValue(
                      "endDate",
                      date ? format(date, "yyyy-MM-dd") : ""
                    );
                  }}
                  className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-0 text-[14px] text-[#495270] bg-[#F9FAFB]"
                  placeholderText="Select end date"
                  dateFormat="dd/MM/yy"
                />
                {errors.endDate && touched.endDate && (
                  <div className="text-red-600 text-sm">{errors.endDate}</div>
                )}
              </div>

              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  className="px-4 py-2 mr-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                >
                  Update
                </button>
                <button
                  type="button"
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                  onClick={closeModel}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Formik>
  );
};

export default ProcedureModelEdit;
