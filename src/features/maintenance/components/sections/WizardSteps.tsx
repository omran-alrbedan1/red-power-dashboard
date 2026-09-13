import { Fragment } from "react"
import { useTranslation } from "react-i18next"
import { User2, Car, ClipboardList, Camera, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

export type WizardStep = 1 | 2 | 3 | 4

const STEP_ICONS = [User2, Car, ClipboardList, Camera]

interface WizardStepsProps {
  current: WizardStep
  total?: number
}

export const WizardSteps: React.FC<WizardStepsProps> = ({
  current,
  total = 4,
}) => {
  const { t } = useTranslation("maintenance")

  return (
    <div className="flex items-center rounded-lg border border-border bg-card p-3 shadow-sm">
      {Array.from({ length: total }, (_, index) => (index + 1) as WizardStep).map(
        (stepNumber, index) => {
          const Icon = STEP_ICONS[stepNumber - 1]
          const isActive = current === stepNumber
          const isDone = stepNumber < current
          return (
            <Fragment key={stepNumber}>
              {index > 0 && <div className="h-px flex-1 bg-border" />}
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                    isActive && "bg-primary text-white",
                    isDone && "bg-primary/20 text-primary",
                    !isActive && !isDone && "bg-background-secondary text-text-muted"
                  )}
                >
                  {isDone ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </span>
                <span
                  className={cn(
                    "hidden text-sm sm:inline",
                    isActive ? "font-medium text-text-primary" : "text-text-muted"
                  )}
                >
                  {t(`wizard.step${stepNumber}`)}
                </span>
              </div>
            </Fragment>
          )
        }
      )}
    </div>
  )
}