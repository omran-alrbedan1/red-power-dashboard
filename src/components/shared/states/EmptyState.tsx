import { cn } from "@/lib/utils"
import { LucideIcon, Inbox, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  title: string
  description: string
  icon?: LucideIcon
  imageUrl?: string
  imageAlt?: string
  primaryAction?: {
    label: string
    onClick: () => void
    icon?: LucideIcon
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
  className?: string
  children?: React.ReactNode
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon = Inbox,
  imageUrl,
  imageAlt = "Empty state illustration",
  primaryAction,
  secondaryAction,
  className,
  children
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        "py-16 px-4 bg-card ",
        className
      )}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={imageAlt}
          className="w-48 h-48 mb-6 object-contain"
        />
      ) : (
        <div className="mb-6 rounded-full bg-background-secondary p-4">
          <Icon className="w-8 h-8 text-primary" />
        </div>
      )}

      <h3 className="text-xl font-semibold text-text-primary mb-2">
        {title}
      </h3>
      
      <p className="text-text-secondary max-w-md mb-6">
        {description}
      </p>

      {children}

      {primaryAction && (
        <Button
          onClick={primaryAction.onClick}
          className="gap-2 text-white"
        >
          {primaryAction.icon && <primaryAction.icon className="w-4 h-4" />}
          {primaryAction.label}
        </Button>
      )}

      {secondaryAction && (
        <Button
          variant="ghost"
          onClick={secondaryAction.onClick}
          className="mt-3"
        >
          {secondaryAction.label}
        </Button>
      )}
    </div>
  )
}

export default EmptyState