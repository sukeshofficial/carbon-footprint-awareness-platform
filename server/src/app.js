import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import dotenv from "dotenv";
import apiRoutes from "./routes/index.js";
import connectDB from "./config/db.js";

const app = express();

// 1. Trust proxy for Vercel/proxies (Essential for cookies and protocol detection)
app.set('trust proxy', 1);

// Global Middlewares

// 2. Refined CORS configuration (Migrated from production-hardened Seyal patterns)
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "https://aco2.forgegrid.in",
  "https://www.aco2.forgegrid.in",
].filter(Boolean).map(origin => origin.replace(/\/$/, "")); // Normalize trailing slashes

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);

    const normalizedOrigin = origin.replace(/\/$/, "");
    if (allowedOrigins.includes(normalizedOrigin) || process.env.NODE_ENV === "development") {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "X-CSRF-Token",
    "Origin", // Added for compatibility
  ],
  optionsSuccessStatus: 204,
};

// 2. IMMEDIATE CORS HANDLING (MUST be before any async or DB middleware)
app.use(cors(corsOptions));

// 5. Handle explicit preflight for Express 5
app.options("*splat", cors(corsOptions));

// 6. Security headers (Migrated from Seyal: explicitly allowing cross-origin resources)
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// 5. Database connection middleware (Moved after CORS to prevent preflight timeouts)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

// Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: {
    status: "error",
    message: "Too many requests from this IP, please try again after 15 minutes",
  },
});
app.use("/api", limiter);

// Body parser
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

// Routes
app.use("/api/v1", apiRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: `Can't find ${req.originalUrl} on this server`,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || "error";

  // Log error for server-side debugging
  console.error(`[Error] ${req.method} ${req.url}:`, err);

  res.status(statusCode).json({
    status,
    message: err.message || "Internal server error",
    // Include stack trace only in development or if DEBUG is enabled
    ...((process.env.NODE_ENV === "development" || process.env.DEBUG === "true") && {
      stack: err.stack,
      details: err.toString()
    }),
  });
});

export default app;
