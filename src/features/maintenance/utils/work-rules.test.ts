import { describe, expect, it } from "vitest"
import { allowedReopenTargets, canDeleteWorkItem } from "./work-rules"

describe("canDeleteWorkItem", () => {
  it("allows delete for pending work that has never been started", () => {
    expect(canDeleteWorkItem({ status: "pending", startedAt: null })).toBe(true)
  })

  it("disallows delete for pending work that has been started", () => {
    expect(canDeleteWorkItem({ status: "pending", startedAt: new Date().toISOString() })).toBe(
      false,
    )
  })

  it.each(["in_progress", "completed", "cancelled"] as const)(
    "disallows delete for %s work",
    (status) => {
      expect(canDeleteWorkItem({ status, startedAt: null })).toBe(false)
    },
  )
})

describe("allowedReopenTargets", () => {
  it("allows PENDING and IN_PROGRESS for completed work", () => {
    expect(allowedReopenTargets({ status: "completed" })).toEqual(["PENDING", "IN_PROGRESS"])
  })

  it("allows only PENDING for cancelled work", () => {
    expect(allowedReopenTargets({ status: "cancelled" })).toEqual(["PENDING"])
  })

  it.each(["pending", "in_progress"] as const)(
    "allows both targets for %s work",
    (status) => {
      expect(allowedReopenTargets({ status })).toEqual(["PENDING", "IN_PROGRESS"])
    },
  )
})