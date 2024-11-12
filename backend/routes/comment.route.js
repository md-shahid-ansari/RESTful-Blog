import express from "express";
import { verifyUser } from "../midlayer/verifyUser.js";
import {
    createComment,
    readComments,
    readSingleComment,
    updateComment,
    deleteComment
} from "../controllers/comment.controllers.js";

const router = express.Router();

// Comment Routes

router.post("/", verifyUser, createComment);                      // Create Comment
router.get("/", verifyUser, readComments);                        // Read Comments (Filtered by post_id if provided)
router.get("/:id", verifyUser, readSingleComment);                // Read Single Comment
router.put("/:id", verifyUser, updateComment);                    // Update Comment
router.delete("/:id", verifyUser, deleteComment);                 // Delete Comment

export default router;
