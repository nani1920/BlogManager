/** @format */

import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;

export const isAdmin = async (request, response, next) => {
  const authHeader = request.headers["authorization"];
  if (!authHeader) {
    response.status(400).json({ message: "Authorization Header Missing" });
  }
  const jwtToken = authHeader.split(" ")[1];
  jwt.verify(jwtToken, JWT_SECRET, async (error, payload) => {
    if (error) {
      response.status(400).json({ message: "Invalid jwtToken" });
    } else {
      const { userId } = payload;
      const user = await User.findOne({ _id: userId });
      if (!user || user.role !== "admin") {
        return response.status(400).json({ message: "Access Denied" });
      }
      request.user = user;
      next();
    }
  });
};

export const isEditor = async (request, response, next) => {
  const authHeader = request.headers["authorization"];
  if (!authHeader) {
    return response
      .status(400)
      .json({ message: "Authorization Header Missing" });
  }
  const jwtToken = authHeader.split(" ")[1];
  jwt.verify(jwtToken, JWT_SECRET, async (error, payload) => {
    if (error) {
      return response.status(400).json({ message: "Invalid jwtToken" });
    } else {
      const { userId } = payload;
      const user = await User.findOne({ _id: userId });
      if (user.role !== "editor" && user.role !== "admin") {
        return response.status(400).json({ message: "Access Denied" });
      }
      request.user = user;
      next();
    }
  });
};

export const isUser = async (request, response, next) => {
  const authHeader = request.headers["authorization"];
  if (!authHeader) {
    return response
      .status(400)
      .json({ message: "Authorization Header Missing" });
  }
  const jwtToken = authHeader.split(" ")[1];
  jwt.verify(jwtToken, JWT_SECRET, async (error, payload) => {
    if (error) {
      return response.status(400).json({ message: "Invalid jwtToken" });
    } else {
      const { userId } = payload;
      const user = await User.findOne({ _id: userId });
      //   if (!user.role === "user") {
      //     response.status(400).json({ message: "Access Denied" });
      //   }
      request.user = user;
      next();
    }
  });
};
