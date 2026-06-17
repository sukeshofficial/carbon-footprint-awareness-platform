import express from "express";
import healthRoutes from "./health.routes.js";
import feedbackRoutes from "./feedback.routes.js";
import authRoutes from "./authRoutes.js";
import profileRoutes from "./profile.routes.js";
import onboardingRoutes from "./carbonContext.routes.js";
import carbonEstimationRoutes from "./carbonEstimation.routes.js";
import explanationRoutes from "./explanation.routes.js";
import whatIfScenarioRoutes from "./whatIfScenario.routes.js";

const router = express.Router();

router.use("/health", healthRoutes);
router.use("/feedback", feedbackRoutes);
router.use("/auth", authRoutes);
router.use("/profile", profileRoutes);
router.use("/onboarding", onboardingRoutes);
router.use("/carbon-estimation", carbonEstimationRoutes);
router.use("/explanations", explanationRoutes);
router.use("/what-if", whatIfScenarioRoutes);

export default router;

