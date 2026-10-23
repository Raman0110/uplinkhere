export interface FileRequest {
  id: string;
  title: string;
  description: string;
  slug: string;
  expiresAt: string | null;
  isPasswordProtected: boolean;
  isExpired: boolean;
  createdAt: string;
  uploads: UploadRecord[];
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  file: File;
}

export interface UploadRecord {
  id: string;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
}

export interface DashboardResponse {
  requests: FileRequest[];
  totalUploads: number;
  totalFileSize: number;
}
