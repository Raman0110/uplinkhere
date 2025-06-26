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
}