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
      const res = await axios.get<GetProcedures[]>(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/procedure`
      );

      return res.data;
    } catch (err: any) {
      return "Something went wrong! Please try again later.";
    }
  };

  static getUsers = async () => {
    try {
      const res = await axios.get<Users[]>(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user`
      );

      return res.data;
    } catch (err: any) {
      return "Something went wrong! Please try again later.";
    }
  };

  static getCategories = async () => {
    try {
      const res = await axios.get<Category[]>(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/category`
      );

      return res.data;
    } catch (err: any) {
      return "Something went wrong! Please try again later.";
    }
  };

  static createProcedues = async (params: createProceduesParam) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/procedure`,
        params,
        { headers: { "Content-Type": "application/json" } }
      );

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
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/procedure`,
        params
      );

      return res.data;
    } catch (err: any) {
      return "Something went wrong! Please try again later.";
    }
  };
}
