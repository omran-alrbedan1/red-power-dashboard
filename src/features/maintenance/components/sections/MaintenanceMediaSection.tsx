import { useQuery } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { Camera, ImageOff, PenLine, RefreshCw, Trash2 } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useBlobObjectUrl } from "@/hooks/useBlobObjectUrl"
import { formatDateTime } from "@/lib/formatter"
import { maintenanceApi } from "../../services/maintenance-api.service"
import { maintenanceQueryKeys } from "../../services/maintenance-query-keys"
import { useMaintenancePhotos } from "../../hooks/useMaintenancePhotos"
import { useMaintenanceSignature } from "../../hooks/useMaintenanceSignature"
import type { MaintenancePhoto, MaintenanceSignature } from "../../types/api-maintenance.types"

const CONTENT_STALE_TIME = 5 * 60 * 1000
const CONTENT_GC_TIME = 5 * 60 * 1000

interface MaintenanceMediaSectionProps {
  cardId: number
  onDeletePhoto?: (photoId: number) => void
  onDeleteSignature?: () => void
  deletingPhotoId?: number | null
  isDeletingSignature?: boolean
  embedded?: boolean
}

export const MaintenanceMediaSection: React.FC<MaintenanceMediaSectionProps> = ({ cardId, onDeletePhoto, onDeleteSignature, deletingPhotoId, isDeletingSignature = false, embedded = false }) => {
  const { t } = useTranslation("maintenance")
  const photosQuery = useMaintenancePhotos(String(cardId))
  const signatureQuery = useMaintenanceSignature(String(cardId))

  const content = (
    <>
      <div className="space-y-2">
        <p className="text-xs font-medium text-text-secondary">{t("media.photos")}</p>
        {photosQuery.isPending ? (
          <MediaLoading label={t("media.loading")} />
        ) : photosQuery.isError ? (
          <MediaError onRetry={() => photosQuery.refetch()} />
        ) : photosQuery.data && photosQuery.data.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {photosQuery.data.map((photo, index) => (
              <PhotoThumbnail key={photo.id} cardId={cardId} photo={photo} index={index} onDelete={onDeletePhoto} isDeleting={deletingPhotoId === photo.id} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">{t("media.noPhotos")}</p>
        )}
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium text-text-secondary">{t("media.signature")}</p>
        {signatureQuery.isPending ? (
          <MediaLoading label={t("media.loading")} />
        ) : signatureQuery.isError ? (
          <MediaError onRetry={() => signatureQuery.refetch()} />
        ) : signatureQuery.data ? (
          <SignatureDisplay cardId={cardId} signature={signatureQuery.data} onDelete={onDeleteSignature} isDeleting={isDeletingSignature} />
        ) : (
          <p className="text-sm text-muted-foreground">{t("media.noSignature")}</p>
        )}
      </div>
    </>
  )

  if (embedded) return <div className="space-y-6">{content}</div>

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Camera className="h-4 w-4 text-primary" />
          {t("media.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {content}
      </CardContent>
    </Card>
  )
}

const MediaLoading: React.FC<{ label: string }> = ({ label }) => (
  <div className="flex items-center gap-2 py-3 text-muted-foreground">
    <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground/40 border-t-muted-foreground" />
    <p className="text-sm">{label}</p>
  </div>
)

const MediaError: React.FC<{ onRetry: () => void }> = ({ onRetry }) => {
  const { t } = useTranslation("maintenance")
  return (
    <div className="flex flex-col items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3">
      <p className="text-sm text-destructive">{t("media.loadError")}</p>
      <Button type="button" variant="outline" size="sm" onClick={onRetry} className="gap-1.5">
        <RefreshCw className="h-3.5 w-3.5" />
        {t("media.retry")}
      </Button>
    </div>
  )
}

interface PhotoThumbnailProps {
  cardId: number
  photo: MaintenancePhoto
  index: number
  onDelete?: (photoId: number) => void
  isDeleting?: boolean
}

const PhotoThumbnail: React.FC<PhotoThumbnailProps> = ({ cardId, photo, index, onDelete, isDeleting = false }) => {
  const { t, i18n } = useTranslation("maintenance")
  const isAr = i18n.dir() === "rtl"
  const { data: blob, isPending, isError, refetch } = useQuery({
    queryKey: maintenanceQueryKeys.photoContent(cardId, photo.id),
    queryFn: () => maintenanceApi.downloadPhoto(cardId, photo.id),
    staleTime: CONTENT_STALE_TIME,
    gcTime: CONTENT_GC_TIME,
  })
  const src = useBlobObjectUrl(blob)

  return (
    <figure className="relative overflow-hidden rounded-lg border border-border bg-muted">
      {onDelete && <Button type="button" variant="destructive" size="icon" onClick={() => onDelete(photo.id)} disabled={isDeleting} className="absolute end-2 top-2 z-10 size-8" aria-label={t("edit.media.deletePhoto")}><Trash2 className="size-4" /></Button>}
      <div className="aspect-square w-full">
        {isPending ? (
          <div className="h-full w-full animate-pulse bg-muted" />
        ) : isError || !src ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
            <ImageOff className="h-6 w-6" />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => refetch()}
              className="gap-1.5"
            >
              <RefreshCw className="h-3 w-3" />
              {t("media.retry")}
            </Button>
          </div>
        ) : (
          <img
            src={src}
            alt={photo.originalFileName || t("media.photoAlt", { count: index + 1 })}
            className="h-full w-full object-cover"
          />
        )}
      </div>
      <figcaption className="flex items-center justify-between gap-2 border-t border-border px-2 py-1.5">
        <span className="truncate text-xs text-text-secondary" dir="auto">
          {photo.originalFileName || t("media.photoAlt", { count: index + 1 })}
        </span>
        {photo.createdAt && (
          <span className="shrink-0 text-[11px] text-muted-foreground">
            {formatDateTime(photo.createdAt, isAr ? "ar-SA" : "en-GB")}
          </span>
        )}
      </figcaption>
    </figure>
  )
}

interface SignatureDisplayProps {
  cardId: number
  signature: MaintenanceSignature
  onDelete?: () => void
  isDeleting?: boolean
}

const SignatureDisplay: React.FC<SignatureDisplayProps> = ({ cardId, onDelete, isDeleting = false }) => {
  const { t } = useTranslation("maintenance")
  const { data: blob, isPending, isError, refetch } = useQuery({
    queryKey: maintenanceQueryKeys.signatureContent(cardId),
    queryFn: () => maintenanceApi.downloadSignature(cardId),
    staleTime: CONTENT_STALE_TIME,
    gcTime: CONTENT_GC_TIME,
  })
  const src = useBlobObjectUrl(blob)

  return (
    <div className="relative overflow-hidden rounded-lg border border-border bg-background">
      {onDelete && <Button type="button" variant="destructive" size="icon" onClick={onDelete} disabled={isDeleting} className="absolute end-2 top-2 z-10 size-8" aria-label={t("edit.media.deleteSignature")}><Trash2 className="size-4" /></Button>}
      {isPending ? (
        <div className="h-40 animate-pulse bg-muted" />
      ) : isError || !src ? (
        <div className="flex h-40 flex-col items-center justify-center gap-2 text-muted-foreground">
          <PenLine className="h-6 w-6" />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => refetch()}
            className="gap-1.5"
          >
            <RefreshCw className="h-3 w-3" />
            {t("media.retry")}
          </Button>
        </div>
      ) : (
        <img src={src} alt={t("media.signature")} className="h-40 w-full object-contain" />
      )}
    </div>
  )
}
