import express, { Request, Response } from "express";
import { routes } from "./app/routes";
import cookieParser from "cookie-parser";
import cors from "cors";
import { envVars } from "./app/config/envVars";

export const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "https://b5a7-portfolio.vercel.app",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie'],
  })
);

app.use("/api/v1/", routes);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to B5A7 portfolio backend",
  });
});

export default app;
