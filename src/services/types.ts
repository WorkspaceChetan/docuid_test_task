export interface User {
  _id: string;
  userName: string;
}

export interface Category {
  [key: string]: any;
}

export interface GetProcedures {
  _id: string;
  title: string;
  user: User;
  priority: number;
  category: Category[];
  column: string;
  dueDate: string;
  createAt: string;
  __v: number;
}

export interface TaskItem {
  id: string;
  label: string;
  description: string;
  user: string;
  priority: number;
  date: string;
}

export interface Column {
  id: string;
  title: string;
  color: string;
  items: TaskItem[];
}

export interface Columns {
  [key: string]: Column;
}

export type TaskStatusColProps = {
  title: string;
  color: string;
  items: TaskItem[];
};

export interface Users {
  _id: string;
  userName: string;
  __v: number;
}

export interface Category {
  _id: string;
  categoryName: string;
  __v: number;
}

export interface UpdateProcedureParams {
  _id: string;
  column: string;
}
export interface createProceduesParam {
  title: string;
  user: string;
  priority: number;
  category: string[];
  column: string;
  startDate: string;
  endDate: string;
  createAt?: string;
  dueDate?: string;
}
