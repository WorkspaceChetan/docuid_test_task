export type DropdownProps<T> = {
  items: T[];
  selectedItem: string;
  setSelectedItem: (item: string) => void;
  itemRenderer: (item: T) => string;
  placeholder: string;
  iconSrc?: string;
  widthClass?: string;
  handleRemove?: () => void;
};

export interface DropdownAddProps {
  items: { id: string; name: string }[];
  selectedItem: string;
  onSelect: (id: string, name: string) => void;
  onRemove: () => void;
  placeholder: string;
  iconSrc: string;
  dropdownLabel: string;
  error?: string;
}
