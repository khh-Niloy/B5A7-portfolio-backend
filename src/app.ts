import express, { Request, Response } from "express";
import { routes } from "./app/routes";
import cookieParser from "cookie-parser";
import cors from "cors";
import { trackVisitor } from "./app/middleware/trackVisitor";

export const app = express();

// Enable trust proxy so Express accurately reads client IP behind Vercel/Cloudflare/Nginx
app.set("trust proxy", true);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        "https://b5a7-portfolio.vercel.app",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
      ];

      // Also allow any vercel deployment preview if matching pattern
      const isVercelPreview = /^https:\/\/.*-khh-niloys-projects.*\.vercel\.app$/.test(origin) ||
                             /^https:\/\/b5a7-portfolio.*\.vercel\.app$/.test(origin);

      if (allowedOrigins.includes(origin) || isVercelPreview || process.env.NODE_ENV !== "production") {
        return callback(null, true);
      }

      return callback(null, true); // Permissive CORS for portfolio visitors
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie", "x-visitor-id"],
    exposedHeaders: ["Set-Cookie"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(trackVisitor);

app.use("/api/v1/", routes);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to B5A7 portfolio backend",
    status: "online",
    timestamp: new Date().toISOString(),
  });
});

export default app;
