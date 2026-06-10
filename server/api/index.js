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
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
}
