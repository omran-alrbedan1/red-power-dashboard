import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Camera, Upload, CheckCircle2 } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useUploadMaintenancePhotos } from "../../hooks/useUploadMaintenancePhotos"
import { useUploadMaintenanceSignature } from "../../hooks/useUploadMaintenanceSignature"

interface MediaReceiptStepProps {
  cardId: number
  cardNumber: string
}

export const MediaReceiptStep: React.FC<MediaReceiptStepProps> = ({
  cardId,
  cardNumber,
}) => {
  const { t } = useTranslation("maintenance")
  const navigate = useNavigate()
  const uploadPhotos = useUploadMaintenancePhotos()
  const uploadSignature = useUploadMaintenanceSignature()
  const [photos, setPhotos] = useState<File[]>([])
  const [signatureFile, setSignatureFile] = useState<File | null>(null)
  const [mediaError, setMediaError] = useState<string | null>(null)

  const handleUploadPhotos = () => {
    if (photos.length === 0) return
    setMediaError(null)
    uploadPhotos.mutate(
      { cardId, files: photos },
      { onError: (error) => setMediaError((error as Error).message) }
    )
  }

  const handleUploadSignature = () => {
    if (!signatureFile) return
    setMediaError(null)
    uploadSignature.mutate(
      { cardId, file: signatureFile },
      { onError: (error) => setMediaError((error as Error).message) }
    )
  }

  const finish = () => navigate(`/maintenance/${cardId}`, { replace: true })

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Camera className="h-4 w-4 text-primary" />
          {t("media.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm text-text-primary">
          {t("media.createdSummary", { cardNumber })}
        </p>

        <div className="space-y-2">
          <p className="text-xs font-medium text-text-secondary">{t("media.photos")}</p>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              type="file"
              accept="image/*"
              multiple
              className="block w-full text-sm file:me-3 file:rounded-lg file:border-0 file:bg-primary/10 file:px-3 file:py-2 file:text-primary"
              onChange={(event) => setPhotos(Array.from(event.target.files ?? []))}
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleUploadPhotos}
              disabled={photos.length === 0 || uploadPhotos.isPending}
              className="gap-1.5"
            >
              <Upload className="h-4 w-4" />
              {t("media.uploadPhotos")}
            </Button>
          </div>
          {uploadPhotos.isSuccess && (
            <p className="text-sm text-emerald-600">{t("media.photosUploaded")}</p>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium text-text-secondary">{t("media.signature")}</p>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              type="file"
              accept="image/*"
              className="block w-full text-sm file:me-3 file:rounded-lg file:border-0 file:bg-primary/10 file:px-3 file:py-2 file:text-primary"
              onChange={(event) => setSignatureFile(event.target.files?.[0] ?? null)}
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleUploadSignature}
              disabled={!signatureFile || uploadSignature.isPending}
              className="gap-1.5"
            >
              <Upload className="h-4 w-4" />
              {t("media.uploadSignature")}
            </Button>
          </div>
          {uploadSignature.isSuccess && (
            <p className="text-sm text-emerald-600">{t("media.signatureUploaded")}</p>
          )}
        </div>

        {mediaError && <p className="text-sm text-primary">{mediaError}</p>}
        {(uploadPhotos.isError || uploadSignature.isError) && !mediaError && (
          <p className="text-sm text-primary">{t("media.error")}</p>
        )}

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="ghost" onClick={finish}>
            {t("media.skip")}
          </Button>
          <Button type="button" className="gap-1.5" onClick={finish}>
            <CheckCircle2 className="h-4 w-4" />
            {t("media.done")}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}