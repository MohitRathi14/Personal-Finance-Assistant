import * as authController from "../controller/authController.js";
import express from "express";
const router = express.Router();

// Register route - FIX: Changed from register to registerUser
router.post("/register", (req, res) => authController.registerUser(req, res));

// Login route
router.post("/login", (req, res) => authController.doLogin(req, res));

// email verification route - FIX: Changed from POST to GET for query params
router.get("/verify-email", (req, res) => authController.verifyEmail(req, res));

// forgot the password route
router.post("/forgot-password", (req, res) => authController.forgotPassword(req, res));

// reset password route - FIX: Changed from POST to GET for query params
router.get("/reset-password", (req, res) => authController.resetPassword(req, res));

export default router;