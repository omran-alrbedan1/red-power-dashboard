import { cn } from "@/lib/utils"

interface RedPowerLogoProps {
  className?: string
}

export function RedPowerLogo({ className }: RedPowerLogoProps) {
  return (
    <div
      className={cn("relative overflow-hidden", className)}
      role="img"
      aria-label="Red Power Garage"
    >
      <img
        src="/favicon.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-auto w-[185%] max-w-none -translate-x-1/2 -translate-y-1/2 select-none"
      />
    </div>
  )
}
