import { useTranslation } from "react-i18next"
import { Fuel, Gauge, Boxes, MessageSquareText } from "lucide-react"
import type { Control, FieldValues, Path } from "react-hook-form"
import CustomFormField, {
  FormFieldType,
} from "@/components/shared/inputs/CustomFormField"
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
}

export const VisitSection = <T extends FieldValues>({
  control,
  visitReasons,
  conditionOptions,
  itemOptions,
}: VisitSectionProps<T>) => {
  const { t } = useTranslation("maintenance")

  const fuelLevelOptions: Option[] = FUEL_LEVEL_KEYS.map((key) => ({
    value: key,
    label: t(`condition.fuelLevels.${key}`),
  }))

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <CustomFormField
          fieldType={FormFieldType.MULTI_SELECT}
          control={control}
          name={"visitReasonIds" as Path<T>}
          label={t("reason.title")}
          required
          options={visitReasons}
          dir="rtl"
        />
        <CustomFormField
          fieldType={FormFieldType.SELECT}
          control={control}
          name={"fuelLevel" as Path<T>}
          label={t("condition.fuelLevel")}
          options={fuelLevelOptions}
          leftIcon={Fuel}
          iconPosition="left"
          dir="rtl"
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
        dir="rtl"
      />

      <div className="border-t border-border pt-5">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-text-primary">
          <Gauge className="h-4 w-4 text-primary" />
          {t("condition.title")}
        </h3>
        <CustomFormField
          fieldType={FormFieldType.MULTI_SELECT}
          control={control}
          name={"conditionOptionIds" as Path<T>}
          label={t("condition.options")}
          options={conditionOptions}
          dir="rtl"
        />

        <CustomFormField
          fieldType={FormFieldType.TEXTAREA}
          control={control}
          name={"inspectionNotes" as Path<T>}
          label={t("condition.otherNotes")}
          placeholder={t("condition.otherNotes")}
          rows={2}
          dir="rtl"
        />
      </div>

      <div className="border-t border-border pt-5">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-text-primary">
          <Boxes className="h-4 w-4 text-primary" />
          {t("itemsLeft.title")}
        </h3>
        <CustomFormField
          fieldType={FormFieldType.MULTI_SELECT}
          control={control}
          name={"itemOptionIds" as Path<T>}
          label={t("condition.options")}
          options={itemOptions}
          dir="rtl"
        />
      </div>
    </div>
  )
}