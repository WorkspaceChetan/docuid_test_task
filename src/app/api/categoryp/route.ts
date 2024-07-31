import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const GET = async () => {
  try {
    await prisma.$connect();

    const category = await prisma.category.findMany();
    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    console.error("Error retrieving category:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
};

export const POST = async (request: Request) => {
  try {
    await prisma.$connect();

    const { name } = await request.json();
    if (!name) {
      return NextResponse.json(
        { error: "category is required" },
        { status: 400 }
      );
    }

    const newCategory = await prisma.category.create({
      data: { name },
    });
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
};
