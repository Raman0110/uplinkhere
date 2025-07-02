import { AppDataSource } from "../config/data-source";
import { FileRequest } from "../entities/FileRequest";
import { User } from "../entities/User";
import { CreateFileRequestDto } from "../modules/file-request/dto/CreateFileRequestDto";
import bcrypt from "bcrypt";


export class FileRequestService {
  private fileRequestRepo = AppDataSource.getRepository(FileRequest);
  private userRepo = AppDataSource.getRepository(User);

  async createFileRequest(dto: CreateFileRequestDto) {
    const { title, slug, description, password, expiresAt, userId } = dto;

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new Error("No user found");

    const existing = await this.fileRequestRepo.findOne({ where: { slug } });
    if (existing) throw new Error("File request already in use");


    const fileRequest = new FileRequest();
    fileRequest.title = title;
    fileRequest.slug = slug;
    fileRequest.description = description ?? "";
    fileRequest.passwordHash = password ?? "";
    fileRequest.expiresAt = expiresAt ? new Date(expiresAt) : null;
    fileRequest.user = user;

    if (password) {
      fileRequest.passwordHash = await bcrypt.hash(password, 10);
    }

    return this.fileRequestRepo.save(fileRequest);
  }

  async getFileRequestForCurrentUser(userId: string) {
    const user = await this.userRepo.findOne({ where: { clerkId: userId } })

    if (!user) throw new Error("No user found");

    const requests = await this.fileRequestRepo.find({
      where: { user: { id: user.id } },
      relations: ['user']
    });

    if (!requests) throw new Error("No request found for this user");

    return requests;
  }

  async getFileRequestFromSlug(slug: string) {
    if (!slug) throw new Error("Slug is required");

    const requests = await this.fileRequestRepo.findOne({ where: { slug }, relations: ['user'] });
    if (!requests) throw new Error("No requested found for the provided slug");

    return requests;
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
}