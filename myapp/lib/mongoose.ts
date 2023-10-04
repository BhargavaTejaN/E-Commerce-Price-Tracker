import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGODB_URI)
    return console.log("MONGODB_URI is not defined");

  if (isConnected) return console.log("=> using existing database connection");

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log("Connected To MongoDB");
  } catch (error: any) {
    console.log("Error While Connecting To Mongodb : ", error);
    throw new Error("Failed To Connect To MongoDB " + error.message);
  }
};
