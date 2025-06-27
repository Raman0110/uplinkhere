import { Response, Request } from "express";
import { FileRequestService } from "../services/FileRequestService";
import dotenv from "dotenv";


dotenv.config();

const service = new FileRequestService();

export const createFileRequest = async (req: Request, res: Response) => {
  try {
    const userId = process.env.environment === "DEV" ? "a0e559a7-2324-4017-8e7f-273986509b6e" : req.auth?.userId;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const data = await service.createFileRequest({ ...req.body, userId });
    res.status(201).json({
      message: "File request created",
      request: data
    })
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export const getUserFileRequest = async (req: Request, res: Response) => {
  try {
    const userId = process.env.environment === "DEV" ? "001" : req.auth?.userId;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized!" });
      return;
    }

    const requests = await service.getFileRequestForCurrentUser(userId);

    res.status(200).json(requests);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
    return
  }
}


export const getFileRequestsFromSlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    if (!slug) {
      res.status(400).json({ error: "Slug is required" })
      return;
    }

    const requests = await service.getFileRequestFromSlug(slug);

    const { passwordHash, ...requestWithoutPassword } = requests;

    res.status(200).json(requestWithoutPassword);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export const checkRequestPassword = async (req: Request, res: Response) => {
  try {
    const { slug, password } = req.body;

    await service.checkPassword(slug, password);

    res.status(200).json({ message: "Access password matched", success: true });

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export const checkRequestExpiration = async (req: Request, res: Response) => {
  try {
    const { slug } = req.body;

    await service.checkExpiration(slug);

    res.status(200).json({ message: "Upload link is valid", success: true })

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}