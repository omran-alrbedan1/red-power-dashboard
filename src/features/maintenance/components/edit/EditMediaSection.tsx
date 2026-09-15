import { useState } from "react"
import { Camera, Upload } from "lucide-react"
import { useTranslation } from "react-i18next"
import { ImageDropzone } from "@/components/shared/inputs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useDeleteMaintenancePhoto, useDeleteMaintenanceSignature } from "../../hooks/useDeleteMaintenanceMedia"
import { useUploadMaintenancePhotos } from "../../hooks/useUploadMaintenancePhotos"
import { useUploadMaintenanceSignature } from "../../hooks/useUploadMaintenanceSignature"
import { MaintenanceMediaSection } from "../sections/MaintenanceMediaSection"

interface EditMediaSectionProps {
  cardId: number
}

export function EditMediaSection({ cardId }: EditMediaSectionProps) {
  const { t } = useTranslation("maintenance")
  const [photos, setPhotos] = useState<File[]>([])
  const [signature, setSignature] = useState<File | null>(null)
  const uploadPhotos = useUploadMaintenancePhotos()
  const uploadSignature = useUploadMaintenanceSignature()
  const deletePhoto = useDeleteMaintenancePhoto()
  const deleteSignature = useDeleteMaintenanceSignature()

  const handleDeletePhoto = (photoId: number) => {
    if (window.confirm(t("edit.media.confirmDeletePhoto"))) deletePhoto.mutate({ cardId, photoId })
  }

  const handleDeleteSignature = () => {
    if (window.confirm(t("edit.media.confirmDeleteSignature"))) deleteSignature.mutate(cardId)
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4"><CardTitle className="flex items-center gap-2 text-sm"><span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary"><Camera className="size-4" /></span>{t("media.title")}</CardTitle></CardHeader>
      <CardContent className="space-y-6">
        <MaintenanceMediaSection cardId={cardId} onDeletePhoto={handleDeletePhoto} onDeleteSignature={handleDeleteSignature} deletingPhotoId={deletePhoto.isPending ? deletePhoto.variables?.photoId : null} isDeletingSignature={deleteSignature.isPending} embedded />
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="space-y-3 rounded-xl border border-border p-4"><h3 className="text-sm font-semibold text-foreground">{t("edit.media.addPhotos")}</h3><ImageDropzone files={photos} onChange={setPhotos} multiple maxCount={20} /><div className="flex justify-end"><Button type="button" variant="outline" disabled={photos.length === 0 || uploadPhotos.isPending} onClick={() => uploadPhotos.mutate({ cardId, files: photos }, { onSuccess: () => setPhotos([]) })}><Upload className="size-4" />{t("media.uploadPhotos")}</Button></div></section>
          <section className="space-y-3 rounded-xl border border-border p-4"><div><h3 className="text-sm font-semibold text-foreground">{t("edit.media.replaceSignature")}</h3><p className="mt-1 text-xs text-muted-foreground">{t("edit.media.replaceSignatureHint")}</p></div><ImageDropzone files={signature ? [signature] : []} onChange={(files) => setSignature(files[0] ?? null)} /><div className="flex justify-end"><Button type="button" variant="outline" disabled={!signature || uploadSignature.isPending} onClick={() => signature && uploadSignature.mutate({ cardId, file: signature }, { onSuccess: () => setSignature(null) })}><Upload className="size-4" />{t("media.uploadSignature")}</Button></div></section>
        </div>
      </CardContent>
    </Card>
  )
}
