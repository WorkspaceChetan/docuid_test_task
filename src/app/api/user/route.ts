import connect from "@/lib/db";
import User from "@/lib/modals/user";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

const ObjectId = require("mongoose").Types.ObjectId;

export const GET = async () => {
  try {
    await connect();
    const userData = await User.find();
    return new NextResponse(JSON.stringify(userData), { status: 200 });
  } catch (error: any) {
    return new NextResponse("Error in fetching user" + error.message, {
      status: 500,
    });
  }
};

export const POST = async (request: Request) => {
  try {
    const body = await request.json();

    await connect();
    const userAdded = new User(body);
    await userAdded.save();

    return new NextResponse(
      JSON.stringify({
        message: "userAdded is created",
        data: userAdded,
      }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse("Error in creating users: " + error.message, {
      status: 500,
    });
  }
};
