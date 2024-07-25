import axios from "axios";
import {
  createProceduesParam,
  GetProcedures,
  Category,
  UpdateProcedureParams,
  Users,
} from "./types";

export class HomeServices {
  static getProcedues = async () => {
    try {
      const res = await axios.get<GetProcedures[]>(`/api/procedure`);

      return res.data;
    } catch (err: any) {
      return "Something went wrong! Please try again later.";
    }
  };

  static getUsers = async () => {
    try {
      const res = await axios.get<Users[]>(`/api/user`);

      return res.data;
    } catch (err: any) {
      return "Something went wrong! Please try again later.";
    }
  };

  static getCategories = async () => {
    try {
      const res = await axios.get<Category[]>(`/api/category`);

      return res.data;
    } catch (err: any) {
      return "Something went wrong! Please try again later.";
    }
  };

  static createProcedues = async (params: createProceduesParam) => {
    try {
      const res = await axios.post(`/api/procedure`, params, {
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
        `/api/procedure`,
        params
      );

      return res.data;
    } catch (err: any) {
      return "Something went wrong! Please try again later.";
    }
  };
}
