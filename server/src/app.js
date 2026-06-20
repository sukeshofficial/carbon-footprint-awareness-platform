import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import dotenv from "dotenv";
import apiRoutes from "./routes/index.js";
import connectDB from "./config/db.js";
import AppError from "./utils/appError.js";


const app = express();

// 1. Trust proxy for Vercel/proxies (Essential for cookies and protocol detection)
app.set('trust proxy', 1);

// Global Middlewares

// 2. Refined CORS configuration (Migrated from production-hardened Seyal patterns)
const allowedOrigins = new Set(
  [
    process.env.FRONTEND_URL,
    "http://localhost:5173",
    "https://aco2.forgegrid.in",
    "https://www.aco2.forgegrid.in",
  ]
    .filter(Boolean)
    .map(origin => origin.replace(/\/$/, "")) // Normalize trailing slashes
);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);

    const normalizedOrigin = origin.replace(/\/$/, "");

    // Debug log for CORS matching in development/debug mode
    if (process.env.NODE_ENV === "development" || process.env.DEBUG === "true") {
      console.log(`[CORS] Request Origin: ${origin}, Allowed: ${allowedOrigins.has(normalizedOrigin)}`);
    }

    if (allowedOrigins.has(normalizedOrigin) || process.env.NODE_ENV === "development") {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS: ${origin}`));
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

// 5. Handle explicit preflight for Express 4/5
app.options("/*path", cors(corsOptions));

// 6. Security headers (Migrated from Seyal: explicitly allowing cross-origin resources)
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// 5. Database connection middleware (Moved after CORS to prevent preflight timeouts)
app.use(async (req, res, next) => {
  // Skip DB connection check for health route
  if (req.path === '/api/v1/health' || req.path === '/api/v1/health/') {
    return next();
  }

  try {
    await connectDB();
    next();
  } catch (err) {
    next(new AppError('Database connection failed', 500));
  }
});

// Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: process.env.NODE_ENV === "development" ? 1000 : 100, // much higher limit in dev
  message: {
    status: "error",
    message: "Too many requests from this IP, please try again after 1 minute",
  },
});
app.use("/api", limiter);

// Body parser — global small limit; larger only for avatar upload
app.use('/api/v1/auth/me', express.json({ limit: '10mb' }));
app.use(express.json({ limit: '50kb' }));
app.use(cookieParser());

// Routes
app.use("/api/v1", apiRoutes);

// 404 handler
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || "error";

  // Log error for server-side debugging - Sanitized to prevent log injection (S5145)
  const safeMethod = String(req.method).replace(/[^A-Z]/g, "");
  console.error("[Error]", {
    method: safeMethod,
    statusCode,
    message: err.message || "Internal server error"
  });

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
