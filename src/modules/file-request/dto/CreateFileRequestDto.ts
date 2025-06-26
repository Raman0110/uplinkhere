export interface CreateFileRequestDto {
  title: string,
  description?: string,
  slug: string,
  password?: string,
  expiresAt?: string,
  userId: string
}