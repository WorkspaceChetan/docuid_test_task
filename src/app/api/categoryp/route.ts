// src/app/api/user-prisma/route.ts
import { NextResponse } from "next/server";
import { PrismaClient, Category } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const category: Category[] = await prisma.category.findMany();
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
}

export async function POST(request: Request) {
  try {
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
}
