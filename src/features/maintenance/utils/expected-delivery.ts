export const buildExpectedDelivery = (
  date: Date | null | undefined,
  time: Date | null | undefined
): string | undefined => {
  if (!date) return undefined
  const target = new Date(date)
  if (time) {
    target.setHours(time.getHours(), time.getMinutes(), 0, 0)
  } else {
    target.setHours(23, 59, 0, 0)
  }
  return target.toISOString()
}