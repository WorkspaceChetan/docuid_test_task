import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const ProcedureSchema = z.object({
  title: z.string().min(1, "Title is required"),
  priority: z.number().int().min(1, "Priority must be a positive integer"),
  column: z.string().min(1, "Column is required"),
  dueDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Invalid date format")
    .transform((val) => new Date(val)),
  userId: z.string().min(1, "User ID is required"),
  categoryId: z.string().min(1, "Category ID is required"),
});

const prisma = new PrismaClient();

export const POST = async (request: Request) => {
  try {
    await prisma.$connect();
    const requestData = await request.json();

    const bodyData = ProcedureSchema.parse(requestData);

    const newProcedure = await prisma.procedure.create({
      data: {
        title: bodyData.title,
        priority: bodyData.priority,
        column: bodyData.column,
        dueDate: bodyData.dueDate,
        userId: bodyData.userId,
        categoryId: bodyData.categoryId,
      },
    });

    return NextResponse.json(newProcedure, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors, status: 400 });
    }
    console.error("Error creating procedure:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
};

const getNonGMTDate = (dtParam: Date): Date => {
  const dt = new Date(dtParam);
  const date = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
  const userTimezoneOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - userTimezoneOffset);
};

const convertDate = (dateString: string): Date => {
  const [day, month, year] = dateString.split("/").map(Number);
  const date = new Date(year, month - 1, day);
  return getNonGMTDate(date);
};

export const GET = async (request: Request) => {
  try {
    await prisma.$connect();
    const url = new URL(request.url);
    const startDateString = url.searchParams.get("startDate");
    const endDateString = url.searchParams.get("endDate");
    const userId = url.searchParams.get("userId");
    const categoryId = url.searchParams.get("categoryId");
    const title = url.searchParams.get("title");

    const filter: any = {};

    if (startDateString) {
      const startDate = convertDate(startDateString);
      filter.createdAt = { gte: startDate };
    }

    if (endDateString) {
      const endDate = convertDate(endDateString);
      filter.dueDate = { lte: endDate };
    }

    if (userId) {
      filter.userId = userId;
    }

    if (categoryId) {
      filter.categoryId = categoryId;
    }

    if (title) {
      filter.title = { contains: title, mode: "insensitive" };
    }

    const procedures = await prisma.procedure.findMany({
      where: filter,
      include: {
        user: { select: { userName: true, id: true } }, // user :true
        category: { select: { name: true, id: true } }, // category:true
      },
    });

    return NextResponse.json(procedures, { status: 200 });
  } catch (error) {
    return new NextResponse("Error in fetching procedures: " + error, {
      status: 500,
    });
  } finally {
    await prisma.$disconnect();
  }
};

export const PUT = async (request: Request) => {
  try {
    await prisma.$connect();
    const body = await request.json();
    const { id, column } = body;
    if (!id) {
      return NextResponse.json({ message: "ID not found", status: 400 });
    }

    const updateData: any = {};
    if (column) updateData.column = column;

    const updatedProcedure = await prisma.procedure.update({
      where: { id: id },
      data: updateData,
    });

    if (!updatedProcedure) {
      return NextResponse.json({
        message: "Procedure not found in the database",
        status: 400,
      });
    }

    return NextResponse.json(
      {
        message: "Procedure status updated",
        data: updatedProcedure,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({
      message: "Error in updating procedure: " + error.message,
      status: 500,
    });
  }
};

export const PATCH = async (request: Request) => {
  try {
    await prisma.$connect();
    const body = await request.json();
    const { id, title, category, column, dueDate, priority } = body;

    if (!id) {
      return NextResponse.json({ message: "ID not found", status: 400 });
    }

    if (!id) {
      return NextResponse.json({
        message: "Invalid Procedure ID",
        status: 400,
      });
    }

    const updateData: any = {};
    if (title) updateData.title = title;
    if (category) {
      updateData.category = { set: category };
    }
    if (column) updateData.column = column;
    if (priority) {
      updateData.priority = priority;
    }
    if (dueDate) {
      try {
        updateData.dueDate = convertDate(dueDate);
      } catch (error) {
        return NextResponse.json({
          message: "Invalid dueDate format",
          status: 400,
        });
      }
    }

    const updatedProcedure = await prisma.procedure.update({
      where: { id: id },
      data: updateData,
    });

    if (!updatedProcedure) {
      return NextResponse.json({
        message: "Procedure not found in the database",
        status: 404,
      });
    }

    return NextResponse.json(
      {
        message: "Procedure is updated",
        data: updatedProcedure,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({
      message: "Error in updating procedure: " + error.message,
      status: 500,
    });
  }
};
