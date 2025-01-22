/** @format */

import express from "express";
import {
  getAllBlogs,
  postBlog,
  getBlog,
  updateBlog,
  deleteBlog,
  assignEditor,
} from "../controllers/blogController.js";
import {
  postComment,
  deleteComment,
} from "../controllers/commentController.js";

import { isAdmin, isEditor, isUser } from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/", isAdmin, postBlog);
router.get("/", isUser, getAllBlogs);
router.get("/:blogId", isUser, getBlog);
router.put("/:blogId", isEditor, updateBlog);
router.delete("/:blogId", isAdmin, deleteBlog);
router.put("/:blogId/assign-editor", isAdmin, assignEditor);

//Comment Routes
router.post("/:blogId/comments", isUser, postComment);
router.delete("/:blogId/comments/:commentId", isUser, deleteComment);

export default router;
