import { useState, useEffect, useCallback } from "react"
import { maintenanceApi } from "../services/maintenance-api.service"

interface UseMediaDownloadOptions {
  cardId: number
  photoId?: number
  isSignature?: boolean
}

export function useMediaDownload({ cardId, photoId, isSignature }: UseMediaDownloadOptions) {
  const [url, setUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const download = useCallback(async () => {
    if (!cardId) return
    if (!photoId && !isSignature) return

    setIsLoading(true)
    setError(null)

    try {
      let blob: Blob
      if (isSignature) {
        blob = await maintenanceApi.downloadSignature(cardId)
      } else if (photoId) {
        blob = await maintenanceApi.downloadPhoto(cardId, photoId)
      } else {
        throw new Error("Invalid download parameters")
      }

      const objectUrl = URL.createObjectURL(blob)
      setUrl(objectUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to download media")
    } finally {
      setIsLoading(false)
    }
  }, [cardId, photoId, isSignature])

  const revoke = useCallback(() => {
    if (url) {
      URL.revokeObjectURL(url)
      setUrl(null)
    }
  }, [url])

  // Auto-revoke URL on unmount
  useEffect(() => {
    return () => {
      if (url) {
        URL.revokeObjectURL(url)
      }
    }
  }, [url])

  return { url, isLoading, error, download, revoke }
}
