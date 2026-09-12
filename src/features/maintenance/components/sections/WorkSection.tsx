import { useTranslation } from "react-i18next"
import { useFieldArray, useWatch } from "react-hook-form"
import { Plus, Trash2, Wrench, Calculator, CircleDollarSign } from "lucide-react"
import type { ArrayPath, Control, FieldValues, Path } from "react-hook-form"
import { Button } from "@/components/ui/button"
import CustomFormField, {
  FormFieldType,
} from "@/components/shared/inputs/CustomFormField"
import { formatCurrency } from "@/lib/formatter"

interface WorkSectionProps<T extends FieldValues> {
  control: Control<T>
}

export const WorkSection = <T extends FieldValues>({
  control,
}: WorkSectionProps<T>) => {
  const { t } = useTranslation("maintenance")
  const { fields, append, remove } = useFieldArray({
    control,
    name: "requiredWorks" as ArrayPath<T>,
  })

  const workItems = useWatch({ control, name: "requiredWorks" as Path<T> }) as
    | Array<{ estimatedCost?: number | "" }>
    | undefined

  const total = (workItems ?? []).reduce((sum, item) => {
    const cost = Number(item.estimatedCost) || 0
    return sum + cost
  }, 0)

  const addRow = () =>
    append({
      description: "",
      estimatedCost: "",
      isRequired: false,
    } as never)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-text-primary">
          <Wrench className="h-4 w-4 text-primary" />
          {t("work.title")}
        </h3>
        <Button type="button" variant="outline" size="sm" onClick={addRow} className="gap-1.5">
          <Plus className="h-4 w-4" />
          {t("work.addRow")}
        </Button>
      </div>

      {fields.length === 0 ? (
        <p className="rounded-lg border border-dashed py-8 text-center text-sm text-muted-foreground">
          {t("work.noWork")}
        </p>
      ) : (
        <div className="space-y-3">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid gap-3 rounded-lg border border-border bg-muted/20 p-3 sm:grid-cols-2"
            >
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={control}
                name={`requiredWorks.${index}.description` as Path<T>}
                label={t("work.description")}
                placeholder={t("work.description")}
                required
                dir="rtl"
              />
              <div className="flex items-end justify-between gap-2">
                <CustomFormField
                  fieldType={FormFieldType.NUMBER}
                  control={control}
                  name={`requiredWorks.${index}.estimatedCost` as Path<T>}
                  label={t("work.estimate")}
                  min={0}
                  dir="ltr"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-destructive"
                  onClick={() => remove(index)}
                  aria-label={t("work.removeRow")}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div>
                <CustomFormField
                  fieldType={FormFieldType.SWITCH}
                  control={control}
                  name={`requiredWorks.${index}.isRequired` as Path<T>}
                  label={t("work.required")}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3">
        <span className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calculator className="h-4 w-4 text-primary" />
          {t("work.total")}
        </span>
        <span className="flex items-center gap-1.5 text-base font-semibold text-text-primary">
          <CircleDollarSign className="h-4 w-4 text-primary" />
          {formatCurrency(total)}
        </span>
      </div>
    </div>
  )
}