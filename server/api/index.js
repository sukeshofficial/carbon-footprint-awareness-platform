import dotenv from "dotenv";
dotenv.config();

import app from "../src/app.js";
import connectDB from "../src/config/db.js";

// Vercel serverless entry — export a handler that ensures DB connection.
// Vercel handles the HTTP server lifecycle; no app.listen() needed.
export default async function handler(req, res) {
  await connectDB();
  return app(req, res);
}
