import { AppDataSource } from "../config/data-source";
import { FileRequest } from "../entities/FileRequest";
import { User } from "../entities/User";
import { CreateFileRequestDto } from "../modules/file-request/dto/CreateFileRequestDto";
import bcrypt from "bcrypt";
import { Upload } from "../entities/Upload";
import { unlink } from "fs/promises";


export class FileRequestService {
  private fileRequestRepo = AppDataSource.getRepository(FileRequest);
  private userRepo = AppDataSource.getRepository(User);

  async createFileRequest(dto: CreateFileRequestDto) {
    const { title, description, password, expiresAt, userId } = dto;

    if (!title?.trim()) throw new Error("A request title is required");

    const user = await this.userRepo.findOne({ where: { clerkId: userId } });
    if (!user) throw new Error("No user found");

    const baseSlug = this.toSlug(dto.slug || title) || `request-${Date.now()}`;
    let slug = baseSlug;
    let suffix = 2;
    while (await this.fileRequestRepo.findOne({ where: { slug } })) {
      slug = `${baseSlug}-${suffix++}`;
    }


    const fileRequest = new FileRequest();
    fileRequest.title = title.trim();
    fileRequest.slug = slug;
    fileRequest.description = description?.trim() ?? "";
    fileRequest.passwordHash = "";
    fileRequest.expiresAt = expiresAt ? new Date(expiresAt) : null;
    if (fileRequest.expiresAt && Number.isNaN(fileRequest.expiresAt.getTime())) {
      throw new Error("The expiry date is invalid");
    }
    if (fileRequest.expiresAt && fileRequest.expiresAt <= new Date()) {
      throw new Error("The expiry date must be in the future");
    }
    fileRequest.user = user;

    if (password) {
      fileRequest.passwordHash = await bcrypt.hash(password, 10);
    }

    return this.fileRequestRepo.save(fileRequest);
  }

  private toSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80);
  }

  async getFileRequestForCurrentUser(userId: string) {
    const user = await this.userRepo.findOne({ where: { clerkId: userId } })

    if (!user) throw new Error("No user found");

    const uploadCountResult = await AppDataSource.query(
      `
    SELECT COUNT(*), SUM(up."fileSize") as totalFileSize
    FROM public.upload up
    INNER JOIN public.file_request fr ON fr.id = up."fileRequestId"
    INNER JOIN public.user u ON u.id = fr."userId"
    WHERE fr."userId" = $1
    `,
      [user.id]
    );

    const totalUploads = parseInt(uploadCountResult[0].count, 10);
    const totalFileSize = parseInt(uploadCountResult[0].totalfilesize ?? "0", 10);


    const requests = await this.fileRequestRepo.find({
      where: { user: { id: user.id } },
      relations: ['user', 'uploads'],
      order: {
        createdAt: 'DESC',
      },
    });

    if (!requests) throw new Error("No request found for this user");
    return { requests, totalUploads, totalFileSize };
  }

  async getFileRequestFromSlug(slug: string) {
    if (!slug) throw new Error("Slug is required");

    const requests = await this.fileRequestRepo.findOne({ where: { slug }, relations: ['user', 'uploads'] });
    if (!requests) throw new Error("No request found for the provided slug");

    return requests;
  }

  async getOwnedFileRequest(slug: string, clerkId: string) {
    const request = await this.fileRequestRepo.findOne({
      where: { slug, user: { clerkId } },
      relations: ["uploads", "user"],
    });
    if (!request) throw new Error("File request not found");
    return request;
  }

  async checkPassword(slug: string, password: string) {
    if (!slug || !password) throw new Error("Slug and Password is required");

    const request = await this.getFileRequestFromSlug(slug);
    if (!request) throw new Error("No request found for provided slug");

    if (!request.passwordHash) return; // allow access if the request has no password set

    const passwordMatched = await bcrypt.compare(password, request.passwordHash);
    if (!passwordMatched) throw new Error("Invalid access Password");

    return;
  }

  async checkExpiration(slug: string) {
    if (!slug) throw new Error("Slug is required");

    const request = await this.getFileRequestFromSlug(slug);
    if (!request) throw new Error("No request found for the provided slug");

    if (!request.expiresAt) return; // allow access if the request has no expiry date

    const now = new Date();
    const expiryDate = new Date(request.expiresAt);

    if (now > expiryDate) throw new Error("The Upload link has expired");

    return;
  }

  async deleteFileRequest(slug: string, clerkId: string) {
    const request = await this.fileRequestRepo.findOne({
      where: { slug, user: { clerkId } },
      relations: ["uploads", "user"],
    });
    if (!request) throw new Error("File request not found");
    await AppDataSource.getRepository(Upload).remove(request.uploads);
    await this.fileRequestRepo.remove(request);
    await Promise.all(request.uploads.map((upload) => unlink(upload.filePath).catch(() => undefined)));
    return request;
  }
}
