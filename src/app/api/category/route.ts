import connect from "@/lib/db";
import Category from "@/lib/modals/category";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    await connect();
    const categoryData = await Category.find();
    return new NextResponse(JSON.stringify(categoryData), { status: 200 });
  } catch (error: any) {
    return new NextResponse("Error in fetching category" + error.message, {
      status: 500,
    });
  }
};

export const POST = async (request: Request) => {
  try {
    const body = await request.json();

    await connect();
    const categoryAdd = new Category(body);
    await categoryAdd.save();

    return new NextResponse(
      JSON.stringify({
        message: "category is created",
        data: categoryAdd,
      }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse("Error in creating category: " + error.message, {
      status: 500,
    });
  }
};
