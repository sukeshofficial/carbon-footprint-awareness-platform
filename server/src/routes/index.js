import express from "express";
import healthRoutes from "./health.routes.js";
import feedbackRoutes from "./feedback.routes.js";

const router = express.Router();

router.use("/health", healthRoutes);
router.use("/feedback", feedbackRoutes);

export default router;

