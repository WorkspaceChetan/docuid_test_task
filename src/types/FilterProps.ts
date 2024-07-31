export type FilterProps = {
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
