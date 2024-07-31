import React, { useRef, useState, MouseEvent, useEffect } from "react";
import Image from "next/image";
import { DropdownProps } from "./DropdownProps";

const Dropdown = <T extends { _id: string }>({
  items,
  selectedItem,
  setSelectedItem,
  itemRenderer,
  placeholder,
  iconSrc,
  widthClass = "lg:w-[250px]",
  handleRemove,
}: DropdownProps<T>) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  const handleSelect = (item: string) => {
    setSelectedItem(item);
    setIsDropdownOpen(false);
  };

  const handleClickOutside = (event: Event) => {
    const mouseEvent = event as unknown as MouseEvent;

    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(mouseEvent.target as Node)
    ) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside as EventListener);
    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside as EventListener
      );
    };
  }, []);

  return (
    <div
      className={`relative w-full h-[44px] rounded-[8px] border p-[10px_18px_10px_12px] gap-[8px] text-[#F9FAFB] bg-[#F9FAFB] flex items-center cursor-pointer ${widthClass}`}
      onClick={toggleDropdown}
      ref={dropdownRef}
    >
      <div className="w-full text-[14px] leading-[24px] font-[500] text-[#495270] whitespace-nowrap overflow-hidden">
        {selectedItem || <span className="text-[#9CA3AF]">{placeholder}</span>}
      </div>
      {selectedItem ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-gray-500 ml-2 cursor-pointer"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          onClick={(e) => {
            e.stopPropagation();
            handleRemove && handleRemove();
          }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      ) : (
        iconSrc && (
          <Image
            src={iconSrc}
            alt="Dropdown Icon"
            width={20}
            height={20}
            className="object-contain ml-2"
          />
        )
      )}

      {isDropdownOpen && (
        <div
          className="absolute top-[100%] left-0 mt-2 w-full bg-[#E5E7EB] border rounded-[8px] shadow-lg z-10"
          onClick={(e) => e.stopPropagation()}
        >
          {items.map((item) => (
            <div
              key={item._id}
              className="p-2 text-[14px] text-[#495270] hover:bg-[#D1D5DB] cursor-pointer"
              onClick={() => handleSelect(itemRenderer(item))}
            >
              {itemRenderer(item)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
