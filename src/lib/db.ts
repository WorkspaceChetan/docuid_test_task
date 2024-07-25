import mongoose from "mongoose";

const mongooseUri = process.env.MONGODB_URL;

const connect = async () => {
  const connectionDb = mongoose.connection.readyState;
  if (connectionDb === 1) {
    console.log(`Already connected`);
  }
  if (connectionDb === 2) {
    console.log(`Connecting ...`);
  }

  try {
    mongoose.connect(mongooseUri!, {
      dbName: "todo-trello",
      bufferCommands: true,
    });
    console.log("Connected");
  } catch (err: any) {
    console.log("Error: ", err);
    throw new Error("Error: ", err);
  }
};

export default connect;
