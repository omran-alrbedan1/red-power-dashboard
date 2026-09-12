import React from "react"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { formatNumber } from "@/lib/formatter"

interface StatCardProps {
  label: string
  value: number | string
  icon: React.ReactNode
  sub?: string
  footer?: string

  footerClassName?: string
  arrowClassName?: string

  onClick?: () => void
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  sub,
  footer,
  footerClassName = "text-red-500",
  arrowClassName = "text-slate-600",
  onClick,
}) => {
  const formattedValue =
    typeof value === "number" ? formatNumber(value) : value

  return (
    <article
      className="
        relative h-[168px] w-full overflow-hidden
        rounded-[18px]
        bg-card
        px-5 py-5
        shadow-[0_8px_28px_rgba(15,23,42,0.055)]
        dark:bg-background-card
      "
    >
      {/* Content */}
      <div className="relative z-10 flex h-full flex-col">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div
            className={`
              flex h-12 w-12 shrink-0
              items-center justify-center
              rounded-[13px]
              bg-primary text-white
            `}
          >
            {icon}
          </div>

          <div className="min-w-0 pt-0.5">
            <h3
              className="
                truncate
                text-[14px] font-bold leading-5
                dark:text-text-primary"
            >
              {label}
            </h3>

            {sub && (
              <p
                className="
                  mt-0.5 truncate
                  text-[11px] font-normal leading-4
                  text-slate-500
                  dark:text-text-muted
                "
              >
                {sub}
              </p>
            )}
          </div>
        </div>

        {/* Number */}
        <div className="mt-4">
          <p
            className="
              text-[29px] font-bold leading-none
              tracking-[-0.04em]
            "
          >
            {formattedValue}
          </p>
        </div>

        {/* Bottom */}
        <div className="mt-auto flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <ArrowUpRight
              className={`
                h-4 w-4 shrink-0
                ${footerClassName}
              `}
            />

            {footer && (
              <span
                className="
                  truncate text-[11px] font-medium
                  text-slate-500
                  dark:text-text-muted
                "
              >
                {footer}
              </span>
            )}
          </div>

          {onClick && (
            <button
              type="button"
              onClick={onClick}
              aria-label={`Open ${label}`}
              className="
                flex h-9 w-9 shrink-0
                items-center justify-center
                rounded-full
                bg-primary/80
                shadow-[0_3px_12px_rgba(15,23,42,0.04)]
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-primary
                dark:bg-white/[0.06]
              "
            >
              <ArrowRight
                className={`
                  h-4 w-4
                  rtl:rotate-180
                text-white

                  ${arrowClassName}
                `}
              />
            </button>
          )}
        </div>
      </div>
    </article>
  )
}

export default StatCard