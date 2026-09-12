interface DetailItemProps {
  icon: React.ElementType
  label: string
  value?: string | null
  ltr?: boolean
}

const DetailItem: React.FC<DetailItemProps> = ({
  icon: Icon,
  label,
  value,
  ltr = false,
}) => {
  if (!value) return null

  return (
    <div
      className="
        flex min-h-[82px]
        items-start gap-4
        rounded-xl border
        border-border/60
        bg-background-secondary/20
        px-4 py-3
        sm:items-center
      "
    >
      <div
        className="
          flex h-11 w-11 shrink-0
          items-center justify-center
          rounded-full
          bg-primary/10
          text-primary
        "
      >
        <Icon className="h-5 w-5" />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium text-text-muted">
          {label}
        </p>

        <p
          className="
            mt-1 break-words
            text-sm font-semibold
            text-text-primary
            sm:truncate
          "
          dir={ltr ? "ltr" : undefined}
        >
          {value}
        </p>
      </div>
    </div>
  )
}
export default DetailItem
