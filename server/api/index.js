import dotenv from "dotenv";
dotenv.config();

import app from "../src/app.js";
import connectDB from "../src/config/db.js";

export default async function handler(req, res) {
  try {
    await connectDB();
    return app(req, res);
  } catch (err) {
    console.error("Vercel Handler Error:", err);

    // Ensure CORS headers are present even on failure
    const origin = req.headers.origin;
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      "https://aco2.forgegrid.in",
      "http://localhost:5173"
    ];

    if (origin && (allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development')) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    }

    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
}
