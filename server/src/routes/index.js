import express from "express";
import healthRoutes from "./health.routes.js";
import feedbackRoutes from "./feedback.routes.js";
import authRoutes from "./authRoutes.js";
import profileRoutes from "./profile.routes.js";

const router = express.Router();

router.use("/health", healthRoutes);
router.use("/feedback", feedbackRoutes);
router.use("/auth", authRoutes);
router.use("/profile", profileRoutes);

export default router;
