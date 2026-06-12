import mongoose from "mongoose";

export const getHealth = async () => {
  const dbStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  return {
    status: "ok",
    timestamp: new Date().toISOString(),
    database: dbStatus,
    env: process.env.NODE_ENV || "development"
  };
};
