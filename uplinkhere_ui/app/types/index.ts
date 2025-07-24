export interface FileRequest {
  id: string;
  title: string;
  description: string;
  slug: string;
  password?: string;
  expiresAt: Date | null;
  passwordHash: String;
  uploads: [] | null
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  file: Blob
}