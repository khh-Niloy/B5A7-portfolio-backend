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
    origin: envVars.FRONTEND_URLS,
    credentials: true,
  })
);

app.use("/api/v1/", routes);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to B5A7 portfolio backend",
  });
});

export default app;
