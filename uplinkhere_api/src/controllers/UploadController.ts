import { Request, Response } from "express";
import { UploadService } from "../services/UploadService";
import { unlink } from "fs/promises";



const uploadService = new UploadService();

export const uploadFileToRequest = async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[] | undefined;
  const savedPaths = new Set<string>();
  try {
    const { slug } = req.params;

    if (!files || files.length === 0) {
      throw new Error("No files uploaded");
    }


    const password = req.header("x-upload-password") || undefined;
    await uploadService.assertUploadAllowed(slug, password);
    const uploads = [];
    for (const file of files) {
      uploads.push(await uploadService.uploadFile(slug, file, password));
      savedPaths.add(file.path);
    }

    res.status(201).json({
      message: "File uploaded",
      uploads: uploads.map(({ id, fileName, fileSize, uploadedAt }) => ({
        id,
        fileName,
        fileSize,
        uploadedAt,
      })),
    });

  } catch (error: any) {
    await Promise.all((files ?? []).filter((file) => !savedPaths.has(file.path)).map((file) => unlink(file.path).catch(() => undefined)));
    const status = error.message?.includes("expired") ? 410 : error.message?.includes("password") ? 401 : 500;
    res.status(status).json({ error: error.message });
  }
}

export const deleteUpload = async (req: Request, res: Response) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) return void res.status(401).json({ error: "Unauthorized" });
    await uploadService.deleteUpload(req.params.id, userId);
    res.status(204).send();
  } catch (error: any) {
    res.status(error.message === "Upload not found" ? 404 : 500).json({ error: error.message });
  }
};

export const getUploadsForRequest = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const userId = req.auth?.userId;
    if (!userId) return void res.status(401).json({ error: "Unauthorized" });
    const uploads = await uploadService.getUploadsForRequest(slug, userId);
    res.status(200).json(uploads.map(({ id, fileName, fileSize, uploadedAt }) => ({
      id,
      fileName,
      fileSize,
      uploadedAt,
    })));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export const downloadFile = async (req: Request, res: Response) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) return void res.status(401).json({ error: "Unauthorized" });

    const upload = await uploadService.getOwnedUpload(req.params.id, userId);
    res.download(upload.filePath, upload.fileName, (error) => {
      if (error && !res.headersSent) res.status(404).json({ error: "File not found" });
    });
  } catch (error: any) {
    res.status(error.message === "Upload not found" ? 404 : 500).json({ error: error.message });
  }
}
