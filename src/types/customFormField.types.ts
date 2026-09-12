import type { Control, FieldValues, Path } from "react-hook-form"
import type { LucideIcon } from "lucide-react"

export interface Option {
  label: string
  value: string
  disabled?: boolean
  icon?: LucideIcon | string
}

export interface DateOption {
  minDate?: Date
  maxDate?: Date
  disabledDays?: Date[]
  placeholder?: string
  format?: string
}

export interface DateRange {
  from: Date | undefined
  to: Date | undefined
}

export interface TimeOption {
  interval?: number
  placeholder?: string
  format?: string
}

export interface FileUploadOption {
  multiple?: boolean
  accept?: string
  maxSize?: number
  showPreview?: boolean
}

export type ColorOption = {
  label: string
  value: string
}

export interface CustomFormFieldProps<T extends FieldValues = FieldValues> {
  fieldType: string
  control: Control<T>
  name: Path<T>
  label?: string
  description?: string
  required?: boolean
  disabled?: boolean
  loading?: boolean
  className?: string
  labelClassName?: string
  inputClassName?: string
  containerClassName?: string
  descriptionClassName?: string
  errorClassName?: string
  tooltip?: string
  dir?: "ltr" | "rtl"
  placeholder?: string
  leftIcon?: React.ElementType
  rightIcon?: React.ElementType
  iconPosition?: "left" | "right" | "both"
  iconClassName?: string
  options?: Option[]
  min?: number
  max?: number
  step?: number
  rows?: number
  maxLength?: number
  dateOptions?: DateOption
  timeOptions?: TimeOption
  sliderMarks?: Record<number, string>
  fileUploadOptions?: FileUploadOption
  maxRating?: number
  autocompleteOptions?: Option[]
  colorPickerOptions?: ColorOption[]
  otpLength?: number
  tagInputOptions?: {
    maxTags?: number
    allowDuplicates?: boolean
  }
  ariaLabel?: string
  ariaDescribedBy?: string
  currency?: string
  locale?: string
}
