import { Router } from "express";
import authController from "../controller/auth.controller.js";
import { verifyJWT } from "../Middlewares/auth.middleware.js";

const router = Router();

// Public routes for user onboarding & session initiation
router.post("/register", authController.register);
router.post("/login", authController.login);

// Secure protected routes requiring verified stateless JWT cookie/header
router.post("/logout", verifyJWT, authController.logout);
router.get("/me", verifyJWT, authController.getCurrentUser);

export default router;
