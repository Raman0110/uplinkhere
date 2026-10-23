import { AppDataSource } from "../config/data-source";
import { FileRequest } from "../entities/FileRequest";
import { Upload } from "../entities/Upload";
import bcrypt from "bcrypt";
import { unlink } from "fs/promises";

export class UploadService {
  private uploadRepo = AppDataSource.getRepository(Upload);
  private fileRequestRepo = AppDataSource.getRepository(FileRequest);

  async assertUploadAllowed(slug: string, password?: string) {
    const request = await this.fileRequestRepo.findOne({ where: { slug } });
    if (!request) throw new Error("File request not found");
    if (request.expiresAt && request.expiresAt < new Date()) throw new Error("This upload request has expired");
    if (request.passwordHash) {
      const allowed = password && await bcrypt.compare(password, request.passwordHash);
      if (!allowed) throw new Error("A valid access password is required");
    }
    return request;
  }

  async uploadFile(slug: string, file: Express.Multer.File, password?: string) {
    const request = await this.assertUploadAllowed(slug, password);

    const upload = new Upload();
    upload.fileName = file.originalname;
    upload.filePath = file.path;
    upload.fileSize = file.size;
    upload.fileRequest = request;

    return await this.uploadRepo.save(upload);
  }

  async getUploadsForRequest(slug: string, clerkId: string) {
    const request = await this.fileRequestRepo.findOne({
      where: { slug, user: { clerkId } },
      relations: ["uploads", "user"]
    });

    if (!request) throw new Error("File request not found");
    return request.uploads;
  }

  async deleteUpload(id: string, clerkId: string) {
    const upload = await this.uploadRepo.findOne({
      where: { id, fileRequest: { user: { clerkId } } },
      relations: ["fileRequest", "fileRequest.user"],
    });
    if (!upload) throw new Error("Upload not found");
    await this.uploadRepo.remove(upload);
    await unlink(upload.filePath).catch(() => undefined);
  }

  async getOwnedUpload(id: string, clerkId: string) {
    const upload = await this.uploadRepo.findOne({
      where: { id, fileRequest: { user: { clerkId } } },
      relations: ["fileRequest", "fileRequest.user"],
    });
    if (!upload) throw new Error("Upload not found");
    return upload;
  }
}
