/** @format */
import connectDb from "./lib/db/dbConnect.js";
import express from "express";
import authRouter from "./src/routes/auth.route.js";
import blogsRouter from "./src/routes/blog.route.js";

import dotenv from "dotenv"; // Use import if using ESM
dotenv.config();

const app = express();
app.use(express.json());

app.use("/auth/", authRouter);
app.use("/blogs", blogsRouter);

app.get("/", (req, res) => {
  res.status(200).json({ message: "hello" });
});

app.listen(3000, () => {
  connectDb();
  console.log("Server is listening at http://localhost:3000");
});
