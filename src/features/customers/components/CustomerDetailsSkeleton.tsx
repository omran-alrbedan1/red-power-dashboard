import React from "react"

interface SkeletonBarProps {
  className?: string
}

const Bar: React.FC<SkeletonBarProps> = ({ className }) => {
  return (
    <span
      aria-hidden="true"
      className={`block max-w-full rounded-md bg-primary/15 skeleton-shimmer ${className ?? ""}`}
    />
  )
}

const CardShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-background-card shadow-[0_8px_30px_rgba(15,23,42,0.045)]">
      {children}
    </div>
  )
}

const SectionHeader: React.FC<{ hasAction?: boolean }> = ({
  hasAction = false,
}) => {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border/60 px-5 py-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-primary/10 skeleton-shimmer" />

        <div className="space-y-1.5">
          <Bar className="h-4 w-32" />
          <Bar className="h-3 w-44 bg-primary/10" />
        </div>
      </div>

      {hasAction && (
        <Bar className="h-10 w-24 rounded-xl" />
      )}
    </div>
  )
}

const CustomerDetailsSkeleton: React.FC = () => {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading customer details"
      className="flex flex-col gap-5"
    >
      {/* Page header */}
      <section className="relative min-h-[190px] overflow-hidden rounded-2xl border border-border/60 bg-[#0b0d10]">
        <div className="absolute inset-x-0 top-0 h-0.5 w-full bg-primary/15 skeleton-shimmer" />

        <div className="relative z-10 flex min-h-[190px] items-center px-6 py-6 sm:px-8 lg:px-9">
          <div className="w-full max-w-[620px]">
            <Bar className="mb-4 h-8 w-24 rounded-lg bg-white/10" />
            <Bar className="h-8 w-44 rounded-lg bg-white/15 sm:h-9 sm:w-72" />
            <Bar className="mt-3 h-4 w-56 rounded-md bg-white/10 sm:w-64" />

            <div className="mt-5 flex flex-wrap items-center gap-5">
              <Bar className="h-4 w-40 rounded-md bg-white/15" />
              <span className="hidden h-3 w-px bg-white/20 sm:block" />
              <Bar className="h-4 w-24 rounded-md bg-white/15" />
            </div>
          </div>
        </div>
      </section>

      {/* Customer details */}
      <CardShell>
        <SectionHeader />

        <div className="grid gap-4 p-5 md:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={index}
              className="flex min-h-[82px] items-center gap-4 rounded-xl border border-border/60 bg-background-secondary/20 px-4 py-3"
            >
              <div className="h-11 w-11 shrink-0 rounded-full bg-primary/10 skeleton-shimmer" />

              <div className="min-w-0 space-y-2">
                <Bar className="h-3 w-24 bg-primary/10" />
                <Bar className="h-4 w-44" />
              </div>
            </div>
          ))}
        </div>
      </CardShell>

      {/* Vehicles */}
      <CardShell>
        <SectionHeader hasAction />

        <div className="space-y-3 p-5">
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-xl border border-border/60 bg-background-secondary/15 px-4 py-4"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="h-12 w-12 shrink-0 rounded-xl bg-primary/10 skeleton-shimmer" />

                  <div className="min-w-0 space-y-2">
                    <Bar className="h-4 w-32 sm:w-36" />
                    <Bar className="h-3 w-20 bg-primary/10" />
                  </div>
                </div>

                <div className="flex flex-1 flex-wrap items-center gap-x-4 gap-y-2 lg:justify-center">
                  <Bar className="h-3 w-20 bg-primary/10" />
                  <Bar className="h-3 w-16 bg-primary/10" />
                  <Bar className="h-3 w-24 bg-primary/10" />
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <Bar className="h-6 w-16 rounded-full bg-primary/10" />
                  <div className="h-9 w-9 rounded-lg bg-background-secondary skeleton-shimmer" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardShell>

      {/* History */}
      <CardShell>
        <SectionHeader />

        <div className="space-y-3 p-5">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="flex items-start gap-3 rounded-xl border border-border/60 bg-background-secondary/15 p-4"
            >
              <div className="h-10 w-10 shrink-0 rounded-xl bg-primary/10 skeleton-shimmer" />

              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <Bar className="h-4 w-40" />
                  <Bar className="h-5 w-16 rounded-full bg-primary/10" />
                </div>

                <Bar className="h-3 w-56 bg-primary/10" />
                <Bar className="h-3 w-40 bg-primary/10" />
              </div>
            </div>
          ))}
        </div>
      </CardShell>
    </div>
  )
}

export default CustomerDetailsSkeleton