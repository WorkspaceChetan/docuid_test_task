import axios from "axios";
import {
  createProceduesParam,
  Procedures,
  Category,
  UpdateProcedureParams,
  Users,
  updateProceduresModelParam,
  AddUser,
  AddCategory,
} from "./types";

export class HomeServices {
  static getProcedues = async () => {
    try {
      const res = await axios.get<Procedures[]>(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/procedurep`
      );

      return res.data;
    } catch (err: any) {
      return "Something went wrong! Please try again later.";
    }
  };

  static getUsers = async () => {
    try {
      const res = await axios.get<AddUser[]>(`/api/userp`);

      return res.data;
    } catch (err: any) {
      return "Something went wrong! Please try again later.";
    }
  };

  static getCategories = async () => {
    try {
      const res = await axios.get<AddCategory[]>(`/api/categoryp`);

      return res.data;
    } catch (err: any) {
      return "Something went wrong! Please try again later.";
    }
  };

  static createProcedues = async (params: createProceduesParam) => {
    try {
      const res = await axios.post(`/api/procedurep`, params, {
        headers: { "Content-Type": "application/json" },
      });

      return res.data;
    } catch (err: any) {
      return "Something went wrong! Please try again later.";
    }
  };

  static updateProcedures = async (
    params: UpdateProcedureParams
  ): Promise<UpdateProcedureParams | string> => {
    try {
      const res = await axios.put<UpdateProcedureParams>(
        `/api/procedurep`,
        params
      );

      return res.data;
    } catch (err: any) {
      return "Something went wrong! Please try again later.";
    }
  };

  static updateProceduresModel = async (params: updateProceduresModelParam) => {
    try {
      const res = await axios.patch(`/api/procedure`, params, {
        headers: { "Content-Type": "application/json" },
      });

      return res.data;
    } catch (err: any) {
      return err;
    }
  };
}
