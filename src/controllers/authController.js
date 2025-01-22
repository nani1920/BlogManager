/** @format */

import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendVerificationEmail } from "../../lib/sendMail.js";

const JWT_SECRET = process.env.JWT_SECRET;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const register = async (request, response) => {
  try {
    const { username, email, role, password } = request.body;
    const usernameExist = await User.findOne({ username });
    if (usernameExist) {
      return response.status(400).json({ message: "Username already Exist" });
    }
    const userExist = await User.findOne({ email });
    if (userExist) {
      return response
        .status(400)
        .json({ message: "User already Exist with this Email" });
    }

    if (!username || username.trim() === "") {
      return response.status(400).json({ message: "Invalid username" });
    }
    if (!password || password.trim() === "") {
      return response.status(400).json({ message: "Invalid Password" });
    }
    if (!email || email.trim() === "") {
      return response.status(400).json({ message: "Invalid email" });
    }

    // Validate email format using regex
    if (!emailRegex.test(email)) {
      return response.status(400).json({ message: "Invalid email format" });
    }
    const verificationToken = jwt.sign({ username }, JWT_SECRET);
    const newUser = User({
      username,
      password,
      email,
      role,
      verificationToken,
      emailVerified: false,
    });
    const savedUser = await newUser.save();
    console.log(savedUser);

    await sendVerificationEmail(verificationToken, email);
    response
      .status(201)
      .json({ message: "Registration successful. Please verify your email." });
  } catch (e) {
    console.log(e);
    response.status(500).json({ message: e.message });
  }
};

export const login = async (request, response) => {
  try {
    const { username, password } = request.body;
    if (!username || username.trim() === "") {
      return response.status(400).json({ message: "Invalid Username" });
    }
    if (!password || password.trim() === "") {
      return response.status(400).json({ message: "Invalid Password" });
    }
    const userExist = await User.findOne({ username });

    if (!userExist) {
      return response.status(400).json({ message: "User doesn't Exists" });
    }

    const isPasswordMatched = await bcrypt.compare(
      password,
      userExist.password
    );
    if (!isPasswordMatched) {
      return response.status(400).json({ message: "Password doesn't Match" });
    }

    const payload = {
      userId: userExist._id,
    };

    const jwtToken = jwt.sign(payload, JWT_SECRET, {
      expiresIn: (JWT_EXPIRY_TIME = "30d"),
    });
    console.log(jwtToken);
    response.status(200).json({ token: jwtToken });
  } catch (e) {
    response.status(500).json({ message: e.message });
  }
};

export const verifyEmail = async (request, response) => {
  const { token } = request.query;
  jwt.verify(token, JWT_SECRET, async (error, payload) => {
    if (error) {
      return response.status(400).json({ message: "Invalid or Token Expired" });
    } else {
      try {
        const user = await User.findOne({ username: payload.username });
        if (!user) {
          return response.status(404).json({ message: "User not Found" });
        }
        user.emailVerified = true;
        user.verificationToken = null;
        await user.save();
        response.status(200).json({ message: "successfully verified Email" });
      } catch (e) {
        console.log(e);
        response.status(500).json({ message: e.message });
      }
    }
  });
};
