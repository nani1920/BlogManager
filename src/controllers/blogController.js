/** @format */

import mongoose from "mongoose";
import Blog from "../models/blogModel.js";
import User from "../models/userModel.js";

export const postBlog = async (request, response) => {
  const { title, content } = request.body;
  try {
    if (title.trim() === "" || !title) {
      return response.status(400).json({ message: "Invalid-title field" });
    }
    if (content.trim() === "" || !content) {
      return response.status(400).json({ message: "Invalid-content field" });
    }

    const newBlog = new Blog({
      title,
      content,
    });
    const savedBlog = await newBlog.save();
    response
      .status(201)
      .json({ message: "Blog created successfully", createdBlog: savedBlog });
  } catch (e) {
    response.status(500).json({ message: e.message });
  }
};

export const getAllBlogs = async (request, response) => {
  try {
    const blogs = await Blog.find().populate(
      "assignedEditorId",
      "username role"
    );
    if (!blogs) {
      return response.status(404).json({ message: "No Blogs Found" });
    }
    response.status(200).json({ blogs });
  } catch (e) {
    response.status(500).json({ message: e.message });
  }
};

export const getBlog = async (request, response) => {
  const { blogId } = request.params;
  if (!mongoose.Types.ObjectId.isValid(blogId)) {
    return response.status(400).json({ message: "Invalid Blog ID format" });
  }
  try {
    const blogData = await Blog.findOne({ _id: blogId }).populate(
      "assignedEditorId",
      "username role"
    );

    if (!blogData) {
      return response.status(404).json({ message: "Blog not found" });
    }
    response.status(200).json(blogData);
  } catch (e) {
    response.status(500).json({ message: e.message });
  }
};

export const updateBlog = async (request, response) => {
  const { title, content } = request.body;
  const { blogId } = request.params;
  //Used to check valid format
  if (!mongoose.Types.ObjectId.isValid(blogId)) {
    return response.status(400).json({ message: "Invalid Blog ID format" });
  }
  try {
    if (title.trim() === "" || !title) {
      return response.status(400).json({ message: "Invalid-title field" });
    }
    if (content.trim() === "" || !content) {
      return response.status(400).json({ message: "Invalid-content field" });
    }
    const user = request.user;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return response.status(404).json({ message: "Blog not found" });
    }

    //check blog is particularly assigned to an editor
    if (user.role !== "admin" && !blog.assignedEditorId) {
      return response.status(403).json({
        message: "Blog has not been assigned to an editor yet",
      });
    }

    // check blog is assigned to requested editor
    if (
      user.role !== "admin" &&
      blog.assignedEditorId.toString() !== user._id.toString()
    ) {
      return response.status(403).json({
        message:
          "Access Denied - You can only edit blogs which are assigned to you",
      });
    }
    blog.title = title;
    blog.content = content;
    await blog.save();
    response
      .status(200)
      .json({ message: "Blog Updated Successfully", updatedBlog: blog });
  } catch (e) {
    return response.status(500).json({ message: e.message });
    console.log(e);
  }
};

export const deleteBlog = async (request, response) => {
  const { blogId } = request.params;
  if (!mongoose.Types.ObjectId.isValid(blogId)) {
    return response.status(400).json({ message: "Invalid blog ID format" });
  }
  try {
    const deletedBlog = await Blog.findByIdAndDelete({ _id: blogId });
    if (!deletedBlog) {
      return response.status(404).json({ message: "Blog not found" });
    }
    response
      .status(200)
      .json({ message: "Blog deleted Successfully", deletedBlog });
  } catch (e) {
    return response.status(500).json({ message: e.message });
  }
};

export const assignEditor = async (request, response) => {
  const { blogId } = request.params;
  const { assignedEditorId } = request.body;

  //Used to check valid format
  if (!mongoose.Types.ObjectId.isValid(assignedEditorId)) {
    return response
      .status(400)
      .json({ message: "Invalid assignedEditorId format" });
  }
  if (!mongoose.Types.ObjectId.isValid(blogId)) {
    return response.status(400).json({ message: "Invalid BlogId format" });
  }
  try {
    const userExist = await User.findByIdAndUpdate(
      { _id: assignedEditorId },
      { blogId }
    );
    if (!userExist) {
      return response
        .status(404)
        .json({ message: "assignedEditorId not Found" });
    }
    if (userExist.role !== "editor") {
      return response
        .status(400)
        .json({ message: "Assigned User is not an Editor" });
    }

    const updateBlog = await Blog.findByIdAndUpdate(
      { _id: blogId },
      { assignedEditorId }
    );
    if (!updateBlog) {
      return response.status(404).json({ message: "Blog Not Found" });
    }
    response.status(200).json({ message: "updated Successfully", updateBlog });
  } catch (e) {
    response.status(500).json({ message: e.message });
  }
};
