import auth from "../controller/authController.js";
import express from "express";
const router = express.Router();

// Register route
router.post("/register", (req, res) => auth.register(req, res));

// Login route
router.post("/login", (req, res) => auth.doLogin(req, res));

// email verification route
router.post("/verify-email", (req, res) => auth.verifyEmail(req, res));

// forgot password route
router.post("/forgot-password", (req, res) => auth.forgotPassword(req, res));

// reset password route
router.post("/reset-password", (req, res) => auth.resetPassword(req, res));


export default router;
