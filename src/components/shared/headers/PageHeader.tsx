import React from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Calendar, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PageHeaderProps {
  title: string
  highlight?: string
  eyebrow?: string
  description?: string

  showBackButton?: boolean
  backButtonLabel?: string
  onBackClick?: () => void

  rightContent?: React.ReactNode

  backgroundImage?: string

  showDateTime?: boolean

  className?: string
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  highlight,
  eyebrow,
  description,

  showBackButton = false,
  backButtonLabel,
  onBackClick,

  rightContent,

  backgroundImage,

  showDateTime = true,

  className = "",
}) => {
  const navigate = useNavigate()

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick()
      return
    }

    navigate(-1)
  }

  const currentDate = new Date()

  const formattedDate = currentDate.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  const formattedTime = currentDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })

  const renderTitle = () => {
    if (!highlight || !title.includes(highlight)) {
      return title
    }

    const [before, after] = title.split(highlight)

    return (
      <>
        {before}
        <span className="text-[#F0142F]">{highlight}</span>
        {after}
      </>
    )
  }

  return (
    <section
      className={`
        relative min-h-[190px] overflow-hidden rounded-2xl
        border border-white/10 bg-[#0b0d10]
        ${className}
      `}
    >
      {/* Background image */}
      {backgroundImage && (
        <img
          src={backgroundImage}
          alt=""
          aria-hidden="true"
          className="
            pointer-events-none absolute inset-0
            h-full w-full object-cover object-center
            select-none
          "
        />
      )}

      {/* Main dark overlay */}
      <div
        className="
          pointer-events-none absolute inset-0
          bg-[linear-gradient(90deg,rgba(8,10,13,0.98)_0%,rgba(18,8,11,0.94)_30%,rgba(20,6,9,0.72)_47%,rgba(5,8,11,0.18)_72%,rgba(5,8,11,0.30)_100%)]
        "
      />


      {/* optional right content */}
      {rightContent && (
        <div className="absolute end-5 top-5 z-20">
          {rightContent}
        </div>
      )}

      <div
        className="
          relative z-10 flex min-h-[190px]
          items-center px-6 py-6
          sm:px-8 lg:px-9
        "
      >
        <div className="max-w-[620px]">
          {/* Back button */}
          {showBackButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackClick}
              className="
                mb-4 -ms-2
                text-white/65 hover:bg-white/10 hover:text-white
              "
            >
              <ArrowLeft className="me-2 h-4 w-4 rtl:rotate-180" />

              {backButtonLabel || "Back"}
            </Button>
          )}

          {/* eyebrow */}
          {eyebrow && (
            <p
              className="
                mb-4 text-[10px] font-semibold uppercase
                tracking-[0.34em] text-white/55
                sm:text-[11px]
              "
            >
              {eyebrow}
            </p>
          )}

          {/* title */}
          <h1
            className="
              text-2xl font-bold leading-tight tracking-tight text-white
              sm:text-3xl
            "
          >
            {renderTitle()}
          </h1>

          {/* description */}
          {description && (
            <p
              className="
                mt-3 max-w-[470px]
                text-sm leading-5 text-white/75
                sm:text-[15px] sm:leading-6
              "
            >
              {description}
            </p>
          )}

          {/* date and time */}
          {showDateTime && (
            <div className="mt-5 flex flex-wrap items-center gap-5">
              <div className="flex items-center gap-2 text-xs text-white/70">
                <Calendar className="h-4 w-4 text-[#F0142F]" />
                <span>{formattedDate}</span>
              </div>

              <span className="hidden h-3 w-px bg-white/20 sm:block" />

              <div className="flex items-center gap-2 text-xs text-white/70">
                <Clock className="h-4 w-4 text-[#F0142F]" />
                <span>{formattedTime}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default PageHeader