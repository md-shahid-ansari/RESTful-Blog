import express from "express";
import { verifyUser } from "../midlayer/verifyUser.js";
import {
    createPost,
    readPosts,
    readSinglePost,
    updatePost,
    deletePost
} from "../controllers/post.controllers.js";

const router = express.Router();

// Blog Post Routes

router.post("/", verifyUser, createPost);              // Create Post
router.get("/", verifyUser, readPosts);                // Read Posts (All)
router.get("/:id", verifyUser, readSinglePost);        // Read Single Post
router.put("/:id", verifyUser, updatePost);            // Update Post
router.delete("/:id", verifyUser, deletePost);         // Delete Post

export default router;
