import { Response, Request } from "express";
import { FileRequestService } from "../services/FileRequestService";
const service = new FileRequestService();

const currentUserId = (req: Request) => req.auth?.userId;

const currentUserEmail = (req: Request) => {
  const claims = req.auth?.claims as Record<string, unknown> | undefined;
  const email = claims?.email ?? claims?.email_address;
  return typeof email === "string" ? email : undefined;
};

const serializeUpload = (upload: any) => ({
  id: upload.id,
  fileName: upload.fileName,
  fileSize: upload.fileSize,
  uploadedAt: upload.uploadedAt,
});

const serializeRequest = (request: any) => ({
  id: request.id,
  title: request.title,
  description: request.description,
  slug: request.slug,
  expiresAt: request.expiresAt,
  createdAt: request.createdAt,
  isPasswordProtected: Boolean(request.passwordHash),
  isExpired: Boolean(request.expiresAt && new Date(request.expiresAt) < new Date()),
  uploads: (request.uploads ?? []).map(serializeUpload),
});

const serializePublicRequest = (request: any) => ({
  ...serializeRequest(request),
  uploads: [],
});

export const createFileRequest = async (req: Request, res: Response) => {
  try {
    const userId = currentUserId(req);

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const data = await service.createFileRequest({
      ...req.body,
      userId,
      userEmail: currentUserEmail(req),
    });
    res.status(201).json({
      message: "File request created",
      request: serializeRequest(data)
    })
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export const getUserFileRequest = async (req: Request, res: Response) => {
  try {
    const userId = currentUserId(req);

    if (!userId) {
      res.status(401).json({ error: "Unauthorized!" });
      return;
    }

    const result = await service.getFileRequestForCurrentUser(userId);
    res.status(200).json({ ...result, requests: result.requests.map(serializeRequest) });
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

    res.status(200).json(serializePublicRequest(requests));

  } catch (error: any) {
    res.status(error.message?.includes("Password") ? 401 : 400).json({ error: error.message });
  }
}

export const checkRequestPassword = async (req: Request, res: Response) => {
  try {
    const { slug, password } = req.body;

    await service.checkPassword(slug, password);

    res.status(200).json({ message: "Access password matched", success: true });

  } catch (error: any) {
    res.status(error.message?.includes("expired") ? 410 : 400).json({ error: error.message });
  }
}

export const getOwnedFileRequest = async (req: Request, res: Response) => {
  try {
    const userId = currentUserId(req);
    if (!userId) return void res.status(401).json({ error: "Unauthorized" });
    const request = await service.getOwnedFileRequest(req.params.slug, userId);
    res.status(200).json(serializeRequest(request));
  } catch (error: any) {
    res.status(error.message === "File request not found" ? 404 : 500).json({ error: error.message });
  }
};

export const checkRequestExpiration = async (req: Request, res: Response) => {
  try {
    const { slug } = req.body;

    await service.checkExpiration(slug);

    res.status(200).json({ message: "Upload link is valid", success: true })

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export const deleteFileRequest = async (req: Request, res: Response) => {
  try {
    const userId = currentUserId(req);
    if (!userId) return void res.status(401).json({ error: "Unauthorized" });
    await service.deleteFileRequest(req.params.slug, userId);
    res.status(204).send();
  } catch (error: any) {
    res.status(error.message === "File request not found" ? 404 : 500).json({ error: error.message });
  }
};
