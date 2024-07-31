import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { DropdownAddProps } from "./DropdownProps";

const Dropdown: React.FC<DropdownAddProps> = ({
  items,
  selectedItem,
  onSelect,
  onRemove,
  placeholder,
  iconSrc,
  dropdownLabel,
  error,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsDropdownOpen(false);
    }
  };

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col">
      <label className="block text-gray-700 mb-1">{dropdownLabel}</label>
      <div
        className="relative w-full h-[44px] rounded-[8px] border p-[10px_18px_10px_12px] gap-[8px] text-[#F9FAFB] bg-[#F9FAFB] flex items-center cursor-pointer"
        ref={dropdownRef}
        onClick={toggleDropdown}
      >
        <div className="w-full h-[24px] text-[14px] leading-[24px] font-[500] text-[#495270] whitespace-nowrap">
          {selectedItem || placeholder}
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
              onRemove && onRemove();
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
          <Image
            src={iconSrc}
            alt="Icon"
            width={20}
            height={20}
            className="object-contain"
          />
        )}

        {isDropdownOpen && (
          <div className="absolute top-[100%] left-0 mt-2 w-full bg-[#E5E7EB] border rounded-[8px] shadow-lg z-10">
            {items.map((item) => (
              <div
                key={item.id}
                className="p-2 text-[14px] text-[#495270] hover:bg-[#D1D5DB] cursor-pointer"
                onClick={() => onSelect(item.id, item.name)}
              >
                {item.name}
              </div>
            ))}
          </div>
        )}
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
    </div>
  );
};

export default Dropdown;
