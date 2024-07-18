import mongoose from "mongoose";
import { MONGO_URL } from "../config";

export default async function connectDatabase() {
  try {
    if (!MONGO_URL) {
      throw new Error("mongo url not defined");
    }
    await mongoose.connect(MONGO_URL);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log("Error occured while connecting to MongoDB" + error);
  }
}
