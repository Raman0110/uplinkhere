import { WithAuthProp } from "@clerk/clerk-sdk-node";
import { UserService } from "../services/UserService";
import { Request, Response } from "express";

const userService = new UserService();

export const createOrLoginUser = async (req: Request, res: Response) => {

  try {
    const userId = req.auth?.userId;
    const email = req.auth?.claims?.email_address as string;


    if (!userId || !email) {
      res.status(401).json({ error: 'Unauthorized' });
      return
    }

    const user = await userService.findOrCreateByClerkId(userId, email);

    res.status(200).json({ message: "User logged in successful", user });
    return;

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}


export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const userId = req.auth?.userId;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return
    }

    const user = await userService.getUserByClerkId(userId);

    res.status(200).json(user);
    return;

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}