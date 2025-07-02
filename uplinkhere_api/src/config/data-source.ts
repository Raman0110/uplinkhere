import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { User } from "../entities/User";
import { FileRequest } from "../entities/FileRequest";
import { Upload } from "../entities/Upload";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  synchronize: true,
  logging: false,
  entities: [User, FileRequest, Upload]
})