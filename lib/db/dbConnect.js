/** @format */

import mongoose from "mongoose";
import dotenv from "dotenv"; // Use import if using ESM
dotenv.config();
const URI = process.env.MONGO_URI;

const connectDb = async () => {
  try {
    await mongoose.connect(URI);
    console.log("Database is Connected");
  } catch (e) {
    console.error("MongoDB connection error: ", error);
    process.exit(1);
  }
};

export default connectDb;
