"use server";

import HomeContainer from "@/component/Home/HomeContainer";
import { HomeServices } from "@/services/home.services";
import { Procedures } from "@/services/types";

export default async function Home() {
  const res = await HomeServices.getProcedues();

  const procedures =
    typeof res !== "string" ? (res as Procedures[]) : ([] as Procedures[]);

  return (
    <>
      <HomeContainer procedures={procedures} />
    </>
  );
}
