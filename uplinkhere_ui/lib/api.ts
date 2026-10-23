import axios from "axios";

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? API_URL.replace(/\/api\/?$/, "");

export const api = axios.create({
  baseURL: API_URL,
  timeout: 30_000,
});

export function getApiError(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.error;
    if (typeof message === "string" && message.length > 0) return message;
    if (!error.response) return "The server could not be reached. Please try again.";
  }
  return fallback;
}

export function getShareUrl(slug: string) {
  if (typeof window === "undefined") return `/r/${slug}`;
  return `${window.location.origin}/r/${slug}`;
}

export function getFileUrl(filePath: string) {
  const normalized = filePath.replace(/\\/g, "/").replace(/^\//, "");
  return `${BACKEND_URL}/${normalized}`;
}
