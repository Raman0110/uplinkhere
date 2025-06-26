import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { FileRequest } from "./FileRequest";


@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ unique: true })
  clerkId!: string;

  @OneToMany(() => FileRequest, (requests) => requests.user)
  requests!: FileRequest[];
}