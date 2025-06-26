import { Response, Request } from "express";
import { FileRequestService } from "../services/FileRequestService";


const service = new FileRequestService();

export const createFileRequest = async (req: Request, res: Response) => {
  try {
    const userId = req.auth?.userId;

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