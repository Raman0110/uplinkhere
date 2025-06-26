import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { FileRequest } from "./FileRequest";


@Entity()
export class Upload {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  fileName!: string;

  @Column()
  fileUrl!: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  uploadedAt!: Date;

  @ManyToOne(() => FileRequest, (fileRequest) => fileRequest.uploads)
  fileRequest!: FileRequest;
}