/** @format */

import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "editor", "user"],
      required: true,
    },
    verificationToken: {
      type: String,
      default: null,
    },
    emailVerified: {
      type: Boolean,
      required: true,
    },
    blogId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      ref: "Blog",
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = mongoose.model("User", UserSchema);

export default User;
