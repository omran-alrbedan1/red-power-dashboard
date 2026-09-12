export function formatPhoneNumber(phone: string): string {
  const cleaned = ("" + phone).replace(/\D/g, "").slice(0, 10)

  if (cleaned.length === 0) return ""

  if (cleaned.length <= 3) return cleaned

  if (cleaned.length <= 6) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`
  }

  return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
}

export function formatCurrency(
  amount: number,
  currency = "SAR",
  locale = "ar-SA"
): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    }).format(amount)
  } catch {
    return `${amount.toFixed(2)} ${currency}`
  }
}

export function formatNumber(value: number, locale?: string): string {
  return new Intl.NumberFormat(locale).format(value)
}

export function formatDate(date: Date | string, locale = "ar-SA"): string {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date))
}

export function formatDateTime(date: Date | string, locale = "ar-SA"): string {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date))
}
