import * as authController from "../controller/authController.js";
import express from "express";
const router = express.Router();

// Register route
router.post("/register", (req, res) => authController.register(req, res));

// Login route
router.post("/login", (req, res) => authController.doLogin(req, res));

// email verification route
router.post("/verify-email", (req, res) => authController.verifyEmail(req, res));

// forgot password route
router.post("/forgot-password", (req, res) => authController.forgotPassword(req, res));

// reset password route
router.post("/reset-password", (req, res) => authController.resetPassword(req, res));


export default router;
