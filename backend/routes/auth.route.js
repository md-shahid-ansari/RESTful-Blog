import express from "express";
import {
    userRegister,
    verifyUserEmail,
    userLogin,
    userForgotPassword,
    userLogout,
    userResetPassword
} from "../controllers/auth.controllers.js";

const router = express.Router();

// user auth Routes
router.post("/register", userRegister);
router.post("/verify", verifyUserEmail);
router.post("/login", userLogin);
router.post("/forgot", userForgotPassword);
router.post("/reset", userResetPassword);
router.post("/logout", userLogout);

export default router;