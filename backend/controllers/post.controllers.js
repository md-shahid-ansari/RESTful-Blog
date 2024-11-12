import {Post} from "../models/post.model.js";

export const createPost = async (req, res) => {
    const { title, content } = req.body;
    try {
      const newPost = new Post({
        title,
        content,
        author_id: req.user.id  // `req.user` has been set by authentication middleware
      });
      await newPost.save();
      res.status(201).json({ success: true, post: newPost });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
};

export const readPosts = async (req, res) => {
    try {
      const posts = await Post.find().populate('author_id', 'username'); // Populating author username
      res.status(200).json({ success: true, posts });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
};

export const readSinglePost = async (req, res) => {
    const { id } = req.params;
    try {
      const post = await Post.findById(id).populate('author_id', 'username');
      if (!post) {
        return res.status(404).json({ success: false, message: 'Post not found' });
      }
      res.status(200).json({ success: true, post });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
};
  

export const updatePost = async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    try {
      const post = await Post.findByIdAndUpdate(
        id,
        { title, content, updated_at: Date.now() },
        { new: true }  // Return the updated document
      );
      if (!post) {
        return res.status(404).json({ success: false, message: 'Post not found' });
      }
      res.status(200).json({ success: true, post });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
};
  

export const deletePost = async (req, res) => {
    const { id } = req.params;
    try {
      const post = await Post.findByIdAndDelete(id);
      if (!post) {
        return res.status(404).json({ success: false, message: 'Post not found' });
      }
      res.status(200).json({ success: true, message: 'Post deleted successfully' });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
};
  
