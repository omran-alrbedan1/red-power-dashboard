import React, { useEffect, useMemo, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { Upload, Image as ImageIcon, X } from "lucide-react"

interface ImageDropzoneProps {
  files: File[]
  onChange: (files: File[]) => void
  multiple?: boolean
  maxCount?: number
}

export const ImageDropzone: React.FC<ImageDropzoneProps> = ({
  files,
  onChange,
  multiple = false,
  maxCount,
}) => {
  const { t } = useTranslation("maintenance")
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const previews = useMemo(
    () => files.map((file) => URL.createObjectURL(file)),
    [files]
  )

  useEffect(() => {
    return () => previews.forEach((url) => URL.revokeObjectURL(url))
  }, [previews])

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const acceptFiles = (list: File[]) =>
    list.filter((file) => file.type.startsWith("image/"))

  const commit = (incoming: File[]) => {
    const valid = acceptFiles(incoming)
    setError(null)

    if (valid.length === 0) {
      setError(t("media.imagesOnly"))
      return
    }

    let merged: File[]
    if (multiple) {
      merged = [...files, ...valid]
      if (maxCount && merged.length > maxCount) {
        merged = merged.slice(0, maxCount)
        setError(t("media.maxImages", { count: maxCount }))
      }
    } else {
      merged = valid.slice(0, 1)
    }

    if (merged.length === files.length) return
    onChange(merged)
  }

  const handleFiles = (list: FileList | null) => {
    if (!list) return
    commit(Array.from(list))
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    handleFiles(e.dataTransfer.files)
  }

  const handleRemove = (index: number) => {
    onChange(files.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={cn(
          "group flex w-full flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          dragActive
            ? "border-primary bg-primary/10"
            : "border-border bg-background-secondary/60 hover:border-primary/50 hover:bg-primary/5"
        )}
      >
        <span
          className={cn(
            "mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-primary text-white shadow-[0_8px_24px_rgba(225,6,19,0.35)] transition-transform group-hover:scale-105",
            dragActive && "scale-110"
          )}
        >
          <Upload className="h-5 w-5" />
        </span>
        <span className="text-sm font-medium text-text-primary">
          {t("media.dragHint")}
        </span>
        <span className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-text-on-primary shadow transition-colors group-hover:bg-primary-dark">
          <ImageIcon className="h-3.5 w-3.5" />
          {t("media.browseFiles")}
        </span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={(e) => {
          handleFiles(e.target.files)
          e.target.value = ""
        }}
        className="hidden"
      />

      {error && <p className="text-xs text-primary">{error}</p>}

      {previews.length > 0 && (
        <div
          className={cn(
            "grid gap-3",
            multiple
              ? "grid-cols-3 sm:grid-cols-4 lg:grid-cols-6"
              : "grid-cols-1 sm:max-w-xs"
          )}
        >
          {previews.map((url, index) => (
            <div
              key={url}
              className="group relative overflow-hidden rounded-lg border border-border-light bg-background-secondary"
            >
              <div className="relative aspect-square w-full overflow-hidden">
                <img
                  src={url}
                  alt={files[index].name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-black/60 px-2 py-1">
                <p className="truncate text-[10px] leading-4 text-white">
                  {files[index].name}
                </p>
              </div>
              <button
                type="button"
                aria-label={t("media.removeFile")}
                onClick={() => handleRemove(index)}
                className="absolute -top-2 -end-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white ring-2 ring-background transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-ring"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}