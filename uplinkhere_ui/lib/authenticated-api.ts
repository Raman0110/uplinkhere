"use client"

import { useMemo } from "react"
import { useAuth } from "@clerk/nextjs"
import axios from "axios"

import { API_URL } from "@/lib/api"

export function useAuthenticatedApi() {
  const { getToken } = useAuth()

  return useMemo(() => {
    const instance = axios.create({
      baseURL: API_URL,
      timeout: 30_000,
    })

    instance.interceptors.request.use(async (config) => {
      const token = await getToken()
      if (!token) throw new Error("You must be signed in to perform this action")
      config.headers.set("Authorization", `Bearer ${token}`)
      return config
    })

    return instance
  }, [getToken])
}
