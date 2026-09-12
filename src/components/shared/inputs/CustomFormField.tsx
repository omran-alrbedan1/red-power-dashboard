  "use client"

  import  { useCallback } from "react"
  import { Controller, FieldValues } from "react-hook-form"
  import { cn } from "@/lib/utils"
  import { Label } from "@/components/ui/label"
  import { Skeleton } from "@/components/ui/skeleton"
  import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
  import { AlertCircle } from "lucide-react"
  import {
    InputField,
    PasswordField,
    EmailField,
    TextareaField,
    NumberField,
    PhoneField,
    SelectField,
    MultiSelectField,
    ComboboxField,
    DatePickerField,
    DateRangeField,
    TimePickerField,
    CheckboxField,
    CheckboxGroupField,
    RadioField,
    SwitchField,
    SliderField,
    TagInputField,
    FileUploadField,
    RatingField,
    OtpInputField,
    CurrencyField,
    PercentageField,
  } from "."

  import { CustomFormFieldProps } from "@/types/customFormField.types"
  export enum FormFieldType {
    INPUT = "INPUT",
    PASSWORD = "PASSWORD",
    EMAIL = "EMAIL",
    TEXTAREA = "TEXTAREA",
    NUMBER = "NUMBER",
    PHONE = "PHONE",
    DATE_PICKER = "DATE_PICKER",
    DATE_RANGE = "DATE_RANGE",
    TIME_PICKER = "TIME_PICKER",
    SELECT = "SELECT",
    MULTI_SELECT = "MULTI_SELECT",
    COMBOBOX = "COMBOBOX",
    RADIO = "RADIO",
    CHECKBOX = "CHECKBOX",
    CHECKBOX_GROUP = "CHECKBOX_GROUP",
    SWITCH = "SWITCH",
    SLIDER = "SLIDER",
    TAG_INPUT = "TAG_INPUT",
    FILE_UPLOAD = "FILE_UPLOAD",
    COLOR_PICKER = "COLOR_PICKER",
    RATING = "RATING",
    OTP_INPUT = "OTP_INPUT",
    AUTOCOMPLETE = "AUTOCOMPLETE",
    CURRENCY = "CURRENCY",
    PERCENTAGE = "PERCENTAGE",
  }


  const CustomFormField = <T extends FieldValues>(props: CustomFormFieldProps<T>) => {
    const {
      fieldType,
      control,
      name,
      label,
      description,
      required,
      disabled,
      loading,
      className,
      labelClassName='mb-1.5',
      inputClassName,
      containerClassName,
      tooltip,
      dir = "ltr",
      leftIcon,
      rightIcon,
      iconPosition,
      iconClassName,
      options,
      min,
      max,
      step,
      rows,
      maxLength,
      dateOptions,
      timeOptions,
      sliderMarks,
      fileUploadOptions,
      maxRating,
      autocompleteOptions,
      colorPickerOptions,
      otpLength,
      tagInputOptions,
      ariaLabel,
      ariaDescribedBy,
      currency,
    } = props

    const renderField = useCallback((field: any) => {
      const commonProps = {
        field,
        disabled,
        inputClassName,
        ariaLabel,
        ariaDescribedBy,
      }

      const iconProps = {
        leftIcon,
        rightIcon,
        iconPosition,
        iconClassName,
      }

      switch (fieldType) {
        case FormFieldType.INPUT:
          return <InputField {...commonProps} {...iconProps} placeholder={props.placeholder} maxLength={maxLength} />
        
        case FormFieldType.PASSWORD:
          return <PasswordField {...commonProps} {...iconProps} placeholder={props.placeholder} />
        
        case FormFieldType.EMAIL:
          return <EmailField {...commonProps} {...iconProps} placeholder={props.placeholder} />
        
        case FormFieldType.TEXTAREA:
          return <TextareaField {...commonProps} placeholder={props.placeholder} rows={rows} maxLength={maxLength} />
        
        case FormFieldType.NUMBER:
          return <NumberField {...commonProps} {...iconProps} placeholder={props.placeholder} min={min} max={max} step={step} />
        
        case FormFieldType.PHONE:
          return <PhoneField {...commonProps} {...iconProps} placeholder={props.placeholder} />
        
        case FormFieldType.SELECT:
          return <SelectField {...commonProps} placeholder={props.placeholder} options={options} />
        
        case FormFieldType.MULTI_SELECT:
          return <MultiSelectField {...commonProps} placeholder={props.placeholder} options={options} />
        
        case FormFieldType.COMBOBOX:
          return <ComboboxField {...commonProps} placeholder={props.placeholder} options={options} />
        
        case FormFieldType.DATE_PICKER:
          return <DatePickerField {...commonProps} dateOptions={dateOptions} />
        
        case FormFieldType.DATE_RANGE:
          return <DateRangeField {...commonProps} dateOptions={dateOptions} />
        
        case FormFieldType.TIME_PICKER:
          return <TimePickerField {...commonProps} timeOptions={timeOptions} />
        
        case FormFieldType.CHECKBOX:
          return <CheckboxField {...commonProps} name={name} label={label} />
        
        case FormFieldType.CHECKBOX_GROUP:
          return <CheckboxGroupField {...commonProps} options={options} />
        
        case FormFieldType.RADIO:
          return <RadioField {...commonProps} options={options} />
        
        case FormFieldType.SWITCH:
          return <SwitchField {...commonProps} name={name} label={label} />
        
        case FormFieldType.SLIDER:
          return <SliderField {...commonProps} min={min} max={max} step={step} sliderMarks={sliderMarks} />
        
        case FormFieldType.TAG_INPUT:
          return <TagInputField {...commonProps} placeholder={props.placeholder} tagInputOptions={tagInputOptions} />
        
        case FormFieldType.FILE_UPLOAD:
          return <FileUploadField {...commonProps} placeholder={props.placeholder} fileUploadOptions={fileUploadOptions} />
        
    
        case FormFieldType.RATING:
          return <RatingField {...commonProps} maxRating={maxRating} />
        
        case FormFieldType.OTP_INPUT:
          return <OtpInputField {...commonProps} otpLength={otpLength} />
            
        case FormFieldType.CURRENCY:
          return <CurrencyField {...commonProps} placeholder={props.placeholder} currency={currency} />
        
        case FormFieldType.PERCENTAGE:
          return <PercentageField {...commonProps} placeholder={props.placeholder} min={min} max={max} />
        
        default:
          return null
      }
    }, [fieldType, props, disabled, inputClassName, ariaLabel, ariaDescribedBy, leftIcon, rightIcon, iconPosition, iconClassName, maxLength, min, max, step, options, dateOptions, timeOptions, sliderMarks, fileUploadOptions, maxRating, autocompleteOptions, colorPickerOptions, otpLength, tagInputOptions, currency, name, label])

    const renderLabel = () => {
      if (!label && fieldType !== FormFieldType.CHECKBOX && fieldType !== FormFieldType.SWITCH) {
        return null
      }

      const labelContent = (
        <Label
          dir="auto"
          className={cn("block w-full text-start text-sm font-medium", labelClassName)}
        >
          {label}
          {required && <span className="ms-1 text-primary">*</span>}
        </Label>
      )

      if (tooltip) {
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex w-full items-center gap-1 text-start cursor-help" dir="auto">
                  {labelContent}
                  <AlertCircle className="h-3.5 w-3.5 text-text-muted" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      }

      return labelContent
    }

    return (
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
<div className={cn("space-y-2", containerClassName, className)} dir={dir}>
            {renderLabel()}
            
            {loading ? (
              <Skeleton className={cn("h-9 w-full", inputClassName)} />
            ) : (
              renderField(field)
            )}
            
{description && (
              <p dir="auto" className={cn("text-start text-xs text-text-secondary", props.descriptionClassName)}>
                {description}
              </p>
            )}
            
            {fieldState.error && (
              <p dir="auto" className={cn("text-start text-xs text-primary", props.errorClassName)}>
                {fieldState.error.message}
              </p>
            )}
          </div>
        )}
      />
    )
  }

  export default CustomFormField
