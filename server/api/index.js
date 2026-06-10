import dotenv from "dotenv";
dotenv.config();

import app from "../src/app.js";
import connectDB from "../src/config/db.js";

export default async function handler(req, res) {
  // 1. Manually set CORS headers for Vercel Environment
  const origin = req.headers.origin;
  const allowedOrigins = [
    process.env.FRONTEND_URL,
    "http://localhost:5173",
    "https://aco2.forgegrid.in",
  ].filter(Boolean);

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else if (!origin && process.env.NODE_ENV !== 'production') {
    // allow cross-origin for non-browser dev tools
    res.setHeader("Access-Control-Allow-Origin", "*");
  }

  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader("Access-Control-Allow-Headers", "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization");

  // 2. Handle Preflight OPTIONS request immediately
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  // 3. Ensure DB connection and handle Express
  try {
    await connectDB();
    return app(req, res);
  } catch (err) {
    console.error("Vercel Handler Error:", err);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
}
