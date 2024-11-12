import { VERIFICATION_EMAIL_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, WELCOME_EMAIL_TEMPLATE } from "./emailTemplate.js";
import { transporter } from "./mailer.config.js";

const SENDER = process.env.EMAIL;

export const sendVerificationEmail = async (email, verificationToken) => {
    try {
        const response = await transporter.sendMail({
            from: SENDER,
            to: email,
            subject: 'Verify Your Email',
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
        });

        console.log("Verification email sent successfully:", response);
    } catch (error) {
        console.error("Error sending verification email:", error);
        throw new Error(`Error sending verification email: ${error}`);
    }
};

export const sendWelcomeEmail = async (email, name, gettingStartedURL = "", communityURL = "", featuresURL = "") => {
    try {
        const response = await transporter.sendMail({
            from: SENDER,
            to: email,
            subject: 'Welcome to Our Platform!',
            html: WELCOME_EMAIL_TEMPLATE
                .replace("{userName}", name)
                .replace("{gettingStartedURL}", gettingStartedURL)
                .replace("{communityURL}", communityURL)
                .replace("{featuresURL}", featuresURL),
        });

        console.log("Welcome email sent successfully:", response);
    } catch (error) {
        console.error("Error sending welcome email:", error);
        throw new Error(`Error sending welcome email: ${error}`);
    }
};

export const sendPasswordResetEmail = async (email, resetToken) => {
    try {
        const response = await transporter.sendMail({
            from: SENDER,
            to: email,
            subject: 'Reset Your Password',
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replaceAll("{resetToken}", resetToken),
        });

        console.log("Password reset email sent successfully:", response);
    } catch (error) {
        console.error("Error sending password reset email:", error);
        throw new Error(`Error sending password reset email: ${error}`);
    }
};

export const sendResetSuccessEmail = async (email) => {
    try {
        const response = await transporter.sendMail({
            from: SENDER,
            to: email,
            subject: 'Password Reset Successful',
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
        });

        console.log("Password reset success email sent successfully:", response);
    } catch (error) {
        console.error("Error sending password reset success email:", error);
        throw new Error(`Error sending password reset success email: ${error}`);
    }
};
