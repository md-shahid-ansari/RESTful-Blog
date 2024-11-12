import jwt from "jsonwebtoken";
import { User } from '../models/user.model.js';

export const verifyUser = async(req, res, next) => {
    const token = req.cookies.userToken;  // userToken
    try {
        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized - no token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ success: false, message: "Unauthorized - invalid token" });
        }

        try {
            const user = await User.findById(decoded.userId).select("-password");
            if (!user) {
                return res.status(400).json({ success: false, message: "user not found" });
            }
            // set the user in req
            req.user = user;

            next();  // Continue to the route handler
        } catch (error) {
            console.log("Error in check auth:", error);
            res.status(400).json({ success: false, message: error.message });
        }

    } catch (error) {
        console.log("Error in verify token:", error);
        res.status(500).json({ success: false, message: "Error in verify token" });
    }
};
