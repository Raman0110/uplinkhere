import { AppDataSource } from "../config/data-source";
import { FileRequest } from "../entities/FileRequest";
import { Upload } from "../entities/Upload";

export class UploadService {
  private uploadRepo = AppDataSource.getRepository(Upload);
  private fileRequestRepo = AppDataSource.getRepository(FileRequest);

  async uploadFile(slug: string, file: Express.Multer.File) {
    const request = await this.fileRequestRepo.findOne({ where: { slug } });
    if (!request) throw new Error("File request not found");

    const upload = new Upload();
    upload.fileName = file.originalname;
    upload.filePath = file.path;
    upload.fileSize = file.size;
    upload.fileRequest = request;

    return await this.uploadRepo.save(upload);
  }

  async getUploadsForRequest(slug: string) {
    const request = await this.fileRequestRepo.findOne({
      where: { slug },
      relations: ["uploads"]
    });

    if (!request) throw new Error("File request not found");
    return request.uploads;
  }
}