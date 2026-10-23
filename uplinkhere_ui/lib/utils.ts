export { cn } from "cn"

export function formatFileSize(bytes: number): string {
  if (!bytes) return "0 Bytes"
  const units = ["Bytes", "KB", "MB", "GB", "TB"]
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  return `${(bytes / Math.pow(1024, index)).toFixed(index === 0 ? 0 : 2)} ${units[index]}`
}
