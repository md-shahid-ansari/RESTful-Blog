import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./db/connectDb.js";
import authRoutes from "./routes/auth.route.js";
import postRoutes from "./routes/post.route.js";
import commentRoutes from "./routes/comment.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";  // Import cors

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const origin = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';


// CORS configuration
app.use(cors({
    origin: origin, // Replace with your frontend URL
    credentials: true, // Allow credentials (cookies, authorization headers)
}));

app.use(express.json()); // Allows input from req.body
app.use(cookieParser()); // Parses incoming cookies

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comment", commentRoutes);

app.listen(PORT, () => {
    connectDb();
    console.log("Server is running on port:", PORT);
});
