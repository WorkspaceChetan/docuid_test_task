// src/app/api/user-prisma/route.ts
import { NextResponse } from "next/server";
import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // await prisma.$connect();
    const users: User[] = await prisma.user.findMany();
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Error retrieving users:", error);
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
    // await prisma.$connect();
    const { userName } = await request.json();
    if (!userName) {
      return NextResponse.json(
        { error: "UserName is required" },
        { status: 400 }
      );
    }

    const newUser = await prisma.user.create({
      data: { userName },
    });
    return NextResponse.json(newUser, { status: 201 });
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
