import dotenv from "dotenv";
dotenv.config();

import app from "../src/app.js";

// Vercel serverless entry — export the Express app.
// Vercel handles the HTTP server lifecycle; no app.listen() needed.
export default app;

