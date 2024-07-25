import HeadingBox from "@/component/Home/HeadingBox";
import HomeContainer from "@/component/Home/HomeContainer";
import { HomeServices } from "@/services/home.services";
import { GetProcedures } from "@/services/types";

export default async function Home() {
  const res = await HomeServices.getProcedues();

  const procedures =
    typeof res !== "string"
      ? (res as GetProcedures[])
      : ([] as GetProcedures[]);

  return (
    <>
      <HeadingBox />
      <HomeContainer procedures={procedures} />
    </>
  );
}
