# Red Power Migration Plan

> Maintained live by agents per `AGENTS.md`. Keep this file in sync with the
> actual repository state — do not document work as done unless it is.

## Active phase (2026-09-15)

**Phase: Maintenance card management hardening** — completed review of the
`maintenance` and `maintenance-options` features against the
`red-power-backend` contract and implemented the approved fixes.

### Work delivered in this phase

- **Cache-key unification** — removed the legacy `activity/timeline` query key;
  every card mutation now invalidates the single `workActivity` key so the
  details-page Activity Timeline stays fresh (close, reopen, card update,
  work-item CRUD, work status transitions).
- **Status-filter contract fix** — the list request now maps persisted status
  (`open`/`closed`) to the API enum (`OPEN`/`CLOSED`) via
  `toApiCardStatus`, matching the backend `@IsEnum(MaintenanceCardStatus)`
  validation.
- **Work-action contract accuracy** — `startWork/completeWork/cancelWork/
  reopenWork` are now typed against the backend `WorkStateResponse` shape
  (`mapWorkState`) instead of a fabricated full card detail.
- **UI/backend rule parity** — delete is only offered for pending-never-started
  work (`work-rules.canDeleteWorkItem`); reopen targets are restricted to
  `PENDING` for cancelled work (`work-rules.allowedReopenTargets`); cancelled
  estimates are excluded from the work total; photo cap aligned to 20 across
  create/edit surfaces.
- **RTL robustness** — replaced hardcoded `i18n.language === "ar"` checks with
  the `i18n.dir() === "rtl"` idiom.
- **Gap: design and delivery covers the migration phases below as they become
  active.**

## Status contract (casing map)

| Domain | Persisted (frontend domain) | API (payload) | Source of truth |
| --- | --- | --- | --- |
| Maintenance card | `open` / `closed` | `OPEN` / `CLOSED` | `maintenance.mapper.ts` (`mapCardStatus` / `toApiCardStatus`) |
| Work item | `pending` / `in_progress` / `completed` / `cancelled` | `PENDING` / `IN_PROGRESS` / `COMPLETED` / `CANCELLED` | `maintenance.mapper.ts` (`mapWorkStatus` / `toApiWorkStatus`) |
| Fuel level | `empty` / `quarter` / `half` / `three_quarters` / `full` | `EMPTY` / `QUARTER` / `HALF` / `THREE_QUARTERS` / `FULL` | `maintenance-api.service.ts` (`toApiFuelLevel`) |

Rule: never send persisted casing to the API; map at the service/mapper boundary.

## Tooling

- `npm run test` — Vitest (see `vitest.config.ts`); current suite:
  `src/features/maintenance/utils/work-rules.test.ts` (transition-parity smoke
  tests mirroring backend `maintenance-work-transition.ts` rules).
- Verification: `npm run lint`, `npx tsc --noEmit`, `npm run build`,
  `npm test`.

## Tracked / open

- Backend itself is not part of this migration phase; contract parity only.
- `docs/` was empty before this phase; future phases should extend this plan
  rather than relying on out-of-band notes.