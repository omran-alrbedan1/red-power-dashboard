import React, { useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Upload, X, Image as ImageIcon, FileText } from "lucide-react"
import { FileUploadOption } from "@/types/customFormField.types"

interface FileUploadFieldProps {
  field: any
  placeholder?: string
  disabled?: boolean
  inputClassName?: string
  fileUploadOptions?: FileUploadOption
}

export const FileUploadField: React.FC<FileUploadFieldProps> = ({
  field,
  placeholder,
  disabled,
  inputClassName,
  fileUploadOptions,
}) => {
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const handleFiles = (files: FileList | null) => {
    if (!files) return
    
    const validFiles = Array.from(files).filter((file) => {
      if (fileUploadOptions?.maxSize && file.size > fileUploadOptions.maxSize) {
        return false
      }
      if (fileUploadOptions?.accept && !file.type.match(fileUploadOptions.accept)) {
        return false
      }
      return true
    })
    
    if (fileUploadOptions?.multiple) {
      field.onChange([...(field.value || []), ...validFiles])
    } else {
      field.onChange(validFiles[0] || null)
    }
  }
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    handleFiles(e.dataTransfer.files)
  }
  
  const handleRemoveFile = (index: number) => {
    if (fileUploadOptions?.multiple) {
      field.onChange(field.value?.filter((_: File, i: number) => i !== index))
    } else {
      field.onChange(null)
    }
  }
  
  const renderFilePreview = (file: File, index: number) => {
    const isImage = file.type.startsWith("image/")
    
    return (
      <div key={index} className="relative group">
        {isImage && fileUploadOptions?.showPreview ? (
          <div className="relative w-20 h-20 rounded-md overflow-hidden border">
            <img
              src={URL.createObjectURL(file)}
              alt={file.name}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="flex items-center gap-2 p-2 border rounded-md">
            {isImage ? (
              <ImageIcon className="h-4 w-4" />
            ) : (
              <FileText className="h-4 w-4" />
            )}
            <span className="text-sm truncate max-w-50">{file.name}</span>
          </div>
        )}
        <Button
          type="button"
          variant="destructive"
          size="sm"
          className="absolute -top-2 -end-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => handleRemoveFile(index)}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    )
  }
  
  return (
    <div className="space-y-2">
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors",
          dragActive ? "border-primary bg-primary/10" : "border-text-secondary/25",
          inputClassName
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="mx-auto mb-2 h-8 w-8 text-text-muted" />
        <p className="text-sm text-text-secondary">
          {placeholder || "Drag and drop files here, or click to select"}
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple={fileUploadOptions?.multiple}
          accept={fileUploadOptions?.accept}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
          disabled={disabled}
        />
      </div>
      
      {field.value && (
        <div className="flex flex-wrap gap-2">
          {fileUploadOptions?.multiple ? (
            field.value.map((file: File, index: number) => renderFilePreview(file, index))
          ) : (
            renderFilePreview(field.value, 0)
          )}
        </div>
      )}
    </div>
  )
}