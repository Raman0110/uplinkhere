import { Request, Response } from "express";
import { UploadService } from "../services/UploadService";


const uploadService = new UploadService();

export const uploadFileToRequest = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      throw new Error("No files uploaded");
    }


    const uploads = await Promise.all(files.map((file) => uploadService.uploadFile(slug, file)));

    res.status(201).json({ message: "File uploaded", uploads });

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