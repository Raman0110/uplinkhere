import { Request, Response } from "express";
import { UploadService } from "../services/UploadService";


const uploadService = new UploadService();

export const uploadFileToRequest = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    if (!req.file) throw new Error("No file uploaded");

    const upload = await uploadService.uploadFile(slug, req.file);

    res.status(201).json({ message: "File uploaded", upload });

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export const getUploadsForRequest = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const uploads = await uploadService.getUploadsForRequest(slug);
    res.status(200).json(uploads);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}