import { useTranslation } from "react-i18next"
import { Fuel, Gauge, Boxes, MessageSquareText, RefreshCw } from "lucide-react"
import type { Control, FieldValues, Path } from "react-hook-form"
import CustomFormField, {
  FormFieldType,
} from "@/components/shared/inputs/CustomFormField"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import type { Option } from "@/types/customFormField.types"

const FUEL_LEVEL_KEYS = [
  "empty",
  "quarter",
  "half",
  "three_quarters",
  "full",
]

interface VisitSectionProps<T extends FieldValues> {
  control: Control<T>
  visitReasons?: Option[]
  conditionOptions?: Option[]
  itemOptions?: Option[]
  loading?: boolean
  hasError?: boolean
  onRetry?: () => void
}

export const VisitSection = <T extends FieldValues>({
  control,
  visitReasons,
  conditionOptions,
  itemOptions,
  loading = false,
  hasError = false,
  onRetry,
}: VisitSectionProps<T>) => {
  const { t, i18n } = useTranslation("maintenance")
  const { t: tCommon } = useTranslation("common")
  const formDir = i18n.language === "ar" ? "rtl" : "ltr"

  const fuelLevelOptions: Option[] = FUEL_LEVEL_KEYS.map((key) => ({
    value: key,
    label: t(`condition.fuelLevels.${key}`),
  }))

  const searchPlaceholder = tCommon("common.form.searchOptions")
  const emptyMessage = tCommon("common.form.noOptions")

  return (
    <div className="space-y-6">
      {hasError && !loading && (
        <div className="flex items-center justify-between gap-2 rounded-md border border-primary/30 bg-primary/5 px-3 py-2.5">
          <p className="text-xs font-medium text-primary">{t("options.error")}</p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRetry}
            className="gap-1.5 text-xs"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            {tCommon("common.retry")}
          </Button>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {loading ? (
          <Skeleton className="h-9 w-full" />
        ) : (
          <CustomFormField
            fieldType={FormFieldType.MULTI_SELECT}
            control={control}
            name={"visitReasonIds" as Path<T>}
            label={t("reason.title")}
            required
            options={visitReasons}
            dir={formDir}
            searchPlaceholder={searchPlaceholder}
            emptyMessage={emptyMessage}
          />
        )}
        <CustomFormField
          fieldType={FormFieldType.SELECT}
          control={control}
          name={"fuelLevel" as Path<T>}
          label={t("condition.fuelLevel")}
          options={fuelLevelOptions}
          leftIcon={Fuel}
          iconPosition="left"
          dir={formDir}
        />
      </div>

      <CustomFormField
        fieldType={FormFieldType.TEXTAREA}
        control={control}
        name={"complaint" as Path<T>}
        label={t("reason.complaint")}
        placeholder={t("reason.complaint")}
        rows={3}
        leftIcon={MessageSquareText}
        iconPosition="left"
        dir={formDir}
      />

      <div className="border-t border-border pt-5">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-text-primary">
          <Gauge className="h-4 w-4 text-primary" />
          {t("condition.title")}
        </h3>
        {loading ? (
          <Skeleton className="h-9 w-full" />
        ) : (
          <CustomFormField
            fieldType={FormFieldType.MULTI_SELECT}
            control={control}
            name={"conditionOptionIds" as Path<T>}
            label={t("condition.options")}
            options={conditionOptions}
            dir={formDir}
            searchPlaceholder={searchPlaceholder}
            emptyMessage={emptyMessage}
          />
        )}

        <CustomFormField
          fieldType={FormFieldType.TEXTAREA}
          control={control}
          name={"inspectionNotes" as Path<T>}
          label={t("condition.otherNotes")}
          placeholder={t("condition.otherNotes")}
          rows={2}
          dir={formDir}
        />
      </div>

      <div className="border-t border-border pt-5">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-text-primary">
          <Boxes className="h-4 w-4 text-primary" />
          {t("itemsLeft.title")}
        </h3>
        {loading ? (
          <Skeleton className="h-9 w-full" />
        ) : (
          <CustomFormField
            fieldType={FormFieldType.MULTI_SELECT}
            control={control}
            name={"itemOptionIds" as Path<T>}
            label={t("itemsLeft.title")}
            options={itemOptions}
            dir={formDir}
            searchPlaceholder={searchPlaceholder}
            emptyMessage={emptyMessage}
          />
        )}
      </div>
    </div>
  )
}