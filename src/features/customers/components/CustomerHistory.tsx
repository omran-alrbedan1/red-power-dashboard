import React from "react"
import { useTranslation } from "react-i18next"
import {
  ClipboardList,
  FileText,
} from "lucide-react"

import EmptyState from "@/components/shared/states/EmptyState"
import ErrorState from "@/components/shared/states/ErrorState"

import type {
  CustomerHistoryPage,
} from "../types/visit-summary.types"

import { CustomerHistoryItem } from "./CustomerHistoryItem"

interface CustomerHistoryProps {
  history?: CustomerHistoryPage
  isLoading?: boolean
  isError?: boolean
  onRetry?: () => void
}

export const CustomerHistoryView: React.FC<
  CustomerHistoryProps
> = ({
  history,
  isLoading = false,
  isError = false,
  onRetry,
}) => {
  const { t } =
    useTranslation("customers")

  const items =
    history?.data ?? []

  return (
    <section
      className="
        overflow-hidden rounded-2xl
        border border-border/60
        bg-background-card
        shadow-[0_8px_30px_rgba(15,23,42,0.045)]
      "
    >
      {/* Header */}
      <div
        className="
          flex items-center gap-3
          border-b border-border/60
          px-5 py-4
        "
      >
        <div
          className="
            flex h-10 w-10
            items-center justify-center
            rounded-xl
            bg-primary/10
            text-primary
          "
        >
          <ClipboardList className="h-5 w-5" />
        </div>

        <div>
          <h2
            className="
              text-base font-bold
              text-text-primary
            "
          >
            {t(
              "history.title",
              "Maintenance History",
            )}
          </h2>

          <p
            className="
              mt-0.5 text-xs
              text-text-muted
            "
          >
            {t(
              "history.description",
              "Previous workshop visits for this customer",
            )}
          </p>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-3 p-5">
          {Array.from({
            length: 3,
          }).map((_, index) => (
            <div
              key={index}
              className="
                h-24 animate-pulse
                rounded-xl
                bg-background-secondary
              "
            />
          ))}
        </div>
      )}

      {/* Error */}
      {!isLoading &&
        isError && (
          <div className="p-5">
            <ErrorState
              variant="default"
              size="sm"
              title={t(
                "history.errorTitle",
                "Could not load maintenance history",
              )}
              description={t(
                "history.errorDescription",
                "The maintenance records could not be loaded. Please try again.",
              )}
              retry={onRetry}
              className="shadow-none"
            />
          </div>
        )}

      {/* Empty */}
      {!isLoading &&
        !isError &&
        items.length === 0 && (
          <EmptyState
            icon={FileText}
            title={t(
              "history.noHistory",
              "No maintenance history yet",
            )}
            description={t(
              "history.noHistoryDescription",
              "Maintenance records for this customer will appear here.",
            )}
            className="bg-transparent py-10"
          />
        )}

      {/* History */}
      {!isLoading &&
        !isError &&
        items.length > 0 && (
          <div className="space-y-3 p-5">
            {items.map(
              (item) => (
                <CustomerHistoryItem
                  key={item.id}
                  item={item}
                />
              ),
            )}
          </div>
        )}
    </section>
  )
}