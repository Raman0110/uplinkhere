import { RequestHandler } from "express";

export const requireAuth: RequestHandler = (req, res, next) => {
  const auth = req.auth;

  if (!auth?.userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  next();
};