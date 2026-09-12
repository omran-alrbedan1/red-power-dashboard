import { useCallback, useMemo } from "react"
import { useSearchParams } from "react-router-dom"

interface DateRange {
  from?: Date
  to?: Date
}

type FilterValue = string | DateRange | undefined

interface UseUrlFiltersOptions<T> {
  defaults: T
  dateRangeKeys?: (keyof T & string)[]
}

function serialize(
  defaults: Record<string, FilterValue>,
  values: Record<string, FilterValue>,
  dateRangeKeys: string[],
  page: number,
): URLSearchParams {
  const params = new URLSearchParams()

  for (const key of Object.keys(defaults)) {
    const value = values[key]

    if (dateRangeKeys.includes(key)) {
      const range = value as DateRange | undefined
      if (range?.from) params.set(`${key}From`, range.from.toISOString().split("T")[0])
      if (range?.to) params.set(`${key}To`, range.to.toISOString().split("T")[0])
    } else if (typeof value === "string" && value !== "" && value !== defaults[key]) {
      params.set(key, value)
    }
  }

  if (page > 1) params.set("page", String(page))
  return params
}

function deserialize<T extends object>(
  defaults: T,
  dateRangeKeys: string[],
  searchParams: URLSearchParams,
): { values: T; page: number } {
  const defaultsRow = defaults as Record<string, FilterValue>
  const values = { ...defaults } as Record<string, FilterValue>

  for (const key of Object.keys(defaultsRow)) {
    if (dateRangeKeys.includes(key)) {
      const from = searchParams.get(`${key}From`)
      const to = searchParams.get(`${key}To`)
      if (from || to) {
        values[key] = {
          from: from ? new Date(from) : undefined,
          to: to ? new Date(to) : undefined,
        }
      }
    } else {
      const param = searchParams.get(key)
      if (param !== null) {
        values[key] = param
      }
    }
  }

  const pageParam = searchParams.get("page")
  const page = pageParam ? parseInt(pageParam, 10) || 1 : 1

  return { values: values as T, page }
}

export function useUrlFilters<T extends object>({
  defaults,
  dateRangeKeys = [],
}: UseUrlFiltersOptions<T>) {
  const [searchParams, setSearchParams] = useSearchParams()
  const dateRangeKeyStr = dateRangeKeys.join(",")
  const defaultsRow = useMemo(
    () => defaults as Record<string, FilterValue>,
    [defaults],
  )

  const parsed = useMemo(
    () =>
      deserialize(
        defaults,
        dateRangeKeyStr ? dateRangeKeyStr.split(",") : [],
        searchParams,
      ),
    [searchParams, defaults, dateRangeKeyStr],
  )

  const apply = useCallback(
    (newValues: T) => {
      const keys = dateRangeKeyStr ? dateRangeKeyStr.split(",") : []
      setSearchParams(
        serialize(
          defaultsRow,
          newValues as Record<string, FilterValue>,
          keys,
          1,
        ),
        { replace: true },
      )
    },
    [defaultsRow, dateRangeKeyStr, setSearchParams],
  )

  const setPage = useCallback(
    (page: number) => {
      setSearchParams(
        (prev) => {
          prev.set("page", String(page))
          return prev
        },
        { replace: true },
      )
    },
    [setSearchParams],
  )

  const reset = useCallback(() => {
    setSearchParams({}, { replace: true })
  }, [setSearchParams])

  const hasActive = useMemo(() => {
    const valuesRow = parsed.values as Record<string, FilterValue>
    const keys = dateRangeKeyStr ? dateRangeKeyStr.split(",") : []

    for (const key of Object.keys(defaultsRow)) {
      const value = valuesRow[key]
      if (value === undefined || value === null) continue

      if (keys.includes(key)) {
        const range = value as DateRange
        if (range?.from || range?.to) return true
      } else if (typeof value === "string" && value !== "") {
        return true
      }
    }
    return false
  }, [parsed.values, defaultsRow, dateRangeKeyStr])

  return {
    values: parsed.values,
    page: parsed.page,
    apply,
    setPage,
    reset,
    hasActive,
  }
}