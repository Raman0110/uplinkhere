import dotenv from "dotenv";
import { RequestHandler } from "express";

dotenv.config();

export const requireAuth: RequestHandler = (req, res, next) => {

  if (process.env.environment === "DEV") {
    return next();
  }
  const auth = req.auth;

  if (!auth?.userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  next();
};