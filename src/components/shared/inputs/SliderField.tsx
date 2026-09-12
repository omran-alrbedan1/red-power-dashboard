import React from "react"
import { cn } from "@/lib/utils"
import { Slider } from "@/components/ui/slider"

interface SliderFieldProps {
  field: any
  disabled?: boolean
  inputClassName?: string
  min?: number
  max?: number
  step?: number
  sliderMarks?: Record<number, string>
}

export const SliderField: React.FC<SliderFieldProps> = ({
  field,
  disabled,
  inputClassName,
  min = 0,
  max = 100,
  step = 1,
  sliderMarks,
}) => {
  return (
    <div className="space-y-2">
      <Slider
        value={[field.value]}
        onValueChange={(value) => field.onChange(Array.isArray(value) ? value[0] : value)}
        max={max}
        min={min}
        step={step}
        disabled={disabled}
        className={cn(inputClassName)}
      />
      <div className="flex justify-between text-xs text-text-secondary">
        <span>{min}</span>
        <span className="font-medium text-text-primary">{field.value}</span>
        <span>{max}</span>
      </div>
      {sliderMarks && Object.keys(sliderMarks).length > 0 && (
        <div className="flex justify-between text-xs text-text-secondary">
          {Object.entries(sliderMarks).map(([value, label]) => (
            <span key={value}>{label}</span>
          ))}
        </div>
      )}
    </div>
  )
}