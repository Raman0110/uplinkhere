import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { Upload } from "./Upload";

@Entity()
export class FileRequest {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column({ unique: true })
  slug!: string;

  @Column({ nullable: true })
  description!: string;

  @Column({ nullable: true })
  passwordHash!: string;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt!: Date | null;

  @ManyToOne(() => User, (user) => user.requests)
  user!: User;

  @OneToMany(() => Upload, (upload) => upload.fileRequest)
  uploads!: Upload[];
}