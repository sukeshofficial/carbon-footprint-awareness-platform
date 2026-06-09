import * as healthService from "../services/health.service.js";

export const getHealth = async (req, res) => {
  try {
    const healthStatus = await healthService.getHealth();
    res.json(healthStatus);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
