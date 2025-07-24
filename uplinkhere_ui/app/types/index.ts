export interface FileRequest {
  id: string;
  title: string;
  description: string;
  slug: string;
  password?: string;
  expiryDate: Date;
  uploadCount: number;
  isActive: boolean;
  isPasswordProtected: boolean;
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
}