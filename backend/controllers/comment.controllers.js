import { Comment } from "../models/comment.model.js";

export const createComment = async (req, res) => {
  const { post_id, content } = req.body;
  try {
    const newComment = new Comment({
      post_id,
      content,
      author_id: req.user.id, // `req.user` has been set by authentication middleware
    });
    await newComment.save();
    res.status(201).json({ success: true, comment: newComment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const readComments = async (req, res) => {
  const { post_id } = req.query;
  try {
    const comments = await Comment.find({ post_id }).populate(
      "author_id",
      "username"
    ); // populating user's username
    res.status(200).json({ success: true, comments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const readSingleComment = async (req, res) => {
  const { id } = req.params;
  try {
    const comment = await Comment.findById(id).populate(
      "author_id",
      "username"
    );
    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });
    }
    res.status(200).json({ success: true, comment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateComment = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  try {
    const comment = await Comment.findByIdAndUpdate(
      id,
      { content, updated_at: Date.now() },
      { new: true } // Return the updated document
    );
    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });
    }
    res.status(200).json({ success: true, comment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteComment = async (req, res) => {
  const { id } = req.params;
  try {
    const comment = await Comment.findByIdAndDelete(id);
    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Comment deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
