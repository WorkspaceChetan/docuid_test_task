"use server";

import HomeContainer from "@/component/Home/HomeContainer";
import { HomeServices } from "@/services/home.services";
import { Procedures } from "@/services/types";
import { Suspense } from "react";

export default async function Home() {
  const res = await HomeServices.getProcedues();

  const procedures =
    typeof res !== "string" ? (res as Procedures[]) : ([] as Procedures[]);

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <HomeContainer procedures={procedures} />
      </Suspense>
    </>
  );
}
