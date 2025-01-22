/** @format */

import Blog from "../models/blogModel.js";

export const postComment = async (request, response) => {
  const { content } = request.body;
  const { blogId } = request.params;
  console.log(request.user);
  const userId = request.user._id;
  try {
    const blog = await Blog.findById(blogId);

    if (!blog) {
      return response.status(404).json({ message: "Blog Not Found" });
    }

    const newComment = {
      userId,
      content,
    };
    blog.comments.push(newComment);
    await blog.save();
    response.status(200).json({ message: "Comment Added Successfully", blog });
  } catch (e) {
    response.status(500).json({ message: e.message });
  }
};

export const deleteComment = async (request, response) => {
  const { blogId, commentId } = request.params;
  const userId = request.user._id;
  try {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return response.status(404).json({ message: "Blog Not Found" });
    }

    const commentIndex = blog.comments.findIndex(
      (comment) => comment._id.toString() === commentId
    );

    if (commentIndex === -1) {
      return response.status(404).json({ message: "Comment Not Found" });
    }
    // Check if the logged-in user is the owner of the comment
    const comment = blog.comments[commentIndex];
    if (comment.userId.toString() !== userId.toString()) {
      return response.status(403).json({
        message: "Access Denied - You can only delete your own comments",
      });
    }
    // Remove the comment
    blog.comments.splice(commentIndex, 1);
    await blog.save();
    response
      .status(200)
      .json({ message: "Comment deleted successfully", blog });
  } catch (e) {
    response.status(500).json({ message: e.message });
  }
};
