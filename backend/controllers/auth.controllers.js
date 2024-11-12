import { User } from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { generateVerificationToken } from '../utils/generateVerificationToken.js';
import { generateTokenAndSetCookie } from '../utils/generateTokenAndSetCookie.js';
import { sendVerificationEmail, sendWelcomeEmail , sendPasswordResetEmail, sendResetSuccessEmail } from '../nodemailer/emails.js';


//user

export const userRegister = async (req, res) => {
    const { 
        email, 
        password, 
        username 
    } = req.body;

    try {
        // Mandatory fields validation
        if (!email || !password || !username) {
            return res.status(400).json({ success: false, message: "Email, password, and username are required" });
        }

        let user = await User.findOne({ email });

        if (user && user.isVerified === true) {
            return res.status(409).json({ success: false, message: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate verification token
        const verificationToken = generateVerificationToken();

        if (!user) {
            // Create new user
            user = new User({
                email,
                password: hashedPassword,
                username,
                verificationToken,
                verificationExpireAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours expiration
            });
        } else {
            // Update existing user (if exists but not verified)
            user.password = hashedPassword;
            user.username = username;
            user.verificationToken = verificationToken;
            user.verificationExpireAt = Date.now() + 24 * 60 * 60 * 1000;
        }

        await user.save();

        // JWT generation and setting cookie
        generateTokenAndSetCookie(res, user._id, "userToken");

        // Send verification email
        await sendVerificationEmail(user.email, verificationToken);

        // Return user info excluding password
        res.status(201).json({
            success: true,
            message: "User registered successfully. Verification email sent.",
            user: {
                ...user._doc,
                password: undefined,
                verificationToken: undefined
            }
        });

    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(422).json({ success: false, message: "Validation failed", error: error.message });
        }
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};


export const verifyUserEmail = async (req, res) => {
    const { code } = req.body;

    try {
        // Find user with matching verification token that hasn't expired
        const user = await User.findOne({
            verificationToken: code,
            verificationExpireAt: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
        }

        // Mark user as verified and clear verification fields
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationExpireAt = undefined;

        await user.save();

        // Send welcome email
        await sendWelcomeEmail(user.email, user.username);

        res.status(200).json({
            success: true,
            message: "User verified successfully",
            user: {
                ...user._doc,
                password: undefined,
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};


export const userLogin = async (req, res) => {
    const { email, username, password } = req.body;

    try {
        // Check if either email or username is provided
        if (!email && !username) {
            return res.status(400).json({ success: false, message: "Email or username is required" });
        }

        // Find user by email or username
        const user = await User.findOne({ 
            $or: [{ email }, { username }] 
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid username/email or password" });
        }

        // Validate password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ success: false, message: "Invalid username/email or password" });
        }

        // Generate JWT and set cookie
        generateTokenAndSetCookie(res, user._id, "userToken");

        // Update last login timestamp
        user.lastLogin = new Date();
        await user.save();

        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            user: {
                ...user._doc,
                password: undefined,
            }
        });

    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};


export const userForgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "Email not found" });
        }

        // Generate reset token and expiration
        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour expiration

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpireAt = resetTokenExpiresAt;

        await user.save();

        // Send reset token on email
        await sendPasswordResetEmail(user.email, resetToken);

        res.status(200).json({
            success: true,
            message: "Reset token sent successfully on your registered email!",
        });

    } catch (error) {
        console.error("Error in forgot password:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};


export const userResetPassword = async (req, res) => {
    try {
        const { password, token } = req.body;

        // Check if token and password are provided
        if (!token || !password) {
            return res.status(400).json({ success: false, message: "Token and password are required" });
        }

        // Find user with valid reset token that hasn't expired
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpireAt: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired token" });
        }

        // Hash and update new password
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpireAt = undefined;

        await user.save();

        // Send confirmation email
        await sendResetSuccessEmail(user.email);

        res.status(200).json({
            success: true,
            message: "Password changed successfully",
        });

    } catch (error) {
        console.error("Error in reset password:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};


export const userLogout = async (req, res) => {
    try {
        res.clearCookie("userToken");
        res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        console.error("Error during logout:", error);
        res.status(500).json({ success: false, message: "Logout failed due to server error" });
    }
};


