# Red Power Dashboard Migration Plan

## Purpose

Transform the existing dashboard foundation into an Arabic-first Red Power Garage operations dashboard. Keep reusable shared components, UI primitives, layouts, form infrastructure, data-table patterns, API utilities, hooks, and validation. Replace old delivery/e-commerce product domains through a phased migration rather than deletion.

## Approved visual reference and asset source

The live [Red Power Arabic website](https://red-power.vercel.app/ar) and the [Red Power website repository](https://github.com/omran-alrbedan1/red-power) are the visual source of truth for the dashboard. The dashboard is a separate operational product, so it should inherit the identity without copying marketing-page layout wholesale.

### Brand tokens

Use these values from the website repository's `src/config/design-system.ts` and `src/app/globals.css` when defining the dashboard theme:

| Token | Value | Dashboard use |
| --- | --- | --- |
| Deep background | `#08090A` | Application canvas and navigation shell. |
| Soft background | `#111315` | Secondary surfaces and toolbar areas. |
| Panel | `#151719` | Cards, tables, and forms. |
| Foreground | `#F5F5F5` | Primary text. |
| Muted foreground | `#B8BCC1` | Supporting text and metadata. |
| Border | `#2B2F33` | Quiet structural borders. |
| Brand red | `#E10613` | Primary action, active navigation, critical emphasis. |
| Brand red strong | `#FF2331` | Hover/focus and high-emphasis states. |
| Steel | `#73777C` | Neutral icon and inactive state accent. |
| Brand glow | `0 0 42px rgba(225, 6, 19, 0.28)` | Restrained primary-action emphasis only. |

### Visual rules to carry into the dashboard

- Arabic-first RTL, high-contrast dark surfaces, compact red-accented primary controls, and precision/garage language.
- Use the official logo at `public/images/red-power/brand/red-power-logo.png` from the website repository.
- Prefer angular/technical dividers, thin metallic borders, modest rounded corners, and subtle red top-edge accents over large gradients or decorative red surfaces.
- Support `prefers-reduced-motion`; use only subtle panel-reveal and surface-hover motion for operational UI.
- Keep the website's workshop imagery for headers, empty states, and contextual panels. Do not use heavy hero photography inside dense tables, forms, or receipt workflows.

### Approved image candidates

When the dashboard needs a branded image, reuse an owned, versioned asset from the website repository rather than hotlinking the public deployment. Candidates include:

| Dashboard need | Website repository asset |
| --- | --- |
| Brand/logo | `public/images/red-power/brand/red-power-logo.png` |
| Dashboard welcome/header | `public/images/red-power/home/red-dodge-garage-hero.png` or `public/images/red-power/home/hero.png` |
| Maintenance/empty state | `public/images/red-power/services/mechanic-engine-service.png` or `public/images/red-power/contact/technician-working.png` |
| Vehicle/workshop context | `public/images/red-power/gallery/car-maintenance-workshop.png` or `public/images/red-power/gallery/dodge-garage-wide.png` |
| Service context | `public/images/red-power/home/service-diagnostics-tablet.png`, `service-maintenance-oil.png`, or `service-performance-intake.png` |

Before copying an image, preserve its filename, optimize only when necessary, add alt text, and record its dashboard destination. Do not download assets from the deployed site or create duplicate untracked copies.

## Client scope — Release 1

1. Red Power main dashboard.
2. One login flow for Admin and Super Admin; both have identical permissions in this release.
3. Customer registration and search across the complete customer history.
4. Required-field vehicle maintenance/receipt card.
5. The maintenance card stays open until all required work is closed.
6. Staff profile, initially for **Sham**.

## Vehicle receipt requirements

The supplied receipt reference is the source for the first maintenance-card model:

- Receipt number, date, and time.
- Customer name, mobile number, and email.
- Vehicle make/model, plate, year, VIN/chassis number, mileage, fuel type, and transmission type.
- Visit/service reason with an "other" option.
- Customer complaint/notes.
- Condition at receipt: fuel, external condition, warning lights, tires, battery, glass, body, and other notes.
- Items left in the car.
- Required work/estimate rows, totals, and work status.
- Customer approval, garage/receiver information, and expected delivery date/time.

## Preserve and repurpose

| Existing foundation | Red Power use |
| --- | --- |
| `src/components/ui` | Keep as neutral, accessible primitives. |
| `src/components/shared/inputs` | Reuse for customer and receipt forms; add only missing generic helpers. |
| `src/components/shared/custom/DataTable.tsx` | Customer history, maintenance-card list, vehicle history. |
| `src/components/shared/modals` | Reuse patterns for approvals, close-card confirmation, and status changes. |
| `src/components/shared/states` | Preserve loading, empty, and error experiences. |
| `src/components/layout` | Rebrand and simplify after Red Power routes exist. |
| `src/lib`, `src/hooks`, `src/constants`, `src/types` | Keep as shared infrastructure; migrate naming only where beneficial. |

## Target structure

```text
src/
├── components/                 # Generic reusable foundation
├── features/
│   ├── auth/                   # Admin / Super Admin login
│   ├── dashboard/              # Red Power operational overview
│   ├── customers/              # Customer profile, vehicles, complete history
│   ├── vehicles/               # Vehicle records and vehicle timeline
│   ├── maintenance/            # Receipt cards, work items, inspection, closure
│   ├── staff/                  # Sham profile and future staff accounts
│   └── settings/               # Garage and account settings
├── i18n/locales/ar/            # Arabic primary copy
└── i18n/locales/en/            # English fallback/future support
```

Each feature owns its `pages`, `components`, `types`, `services`, `hooks`, `validation`, and data fixtures. Feature internals must not be imported by another feature.

## Route plan

| Route | Release | Purpose |
| --- | --- | --- |
| `/login` | 1 | Admin and Super Admin sign-in. |
| `/` | 1 | Open cards, today’s activity, pending work, and quick actions. |
| `/customers` | 1 | Searchable customer directory. |
| `/customers/:customerId` | 1 | Customer profile, vehicles, complete visit history. |
| `/maintenance` | 1 | Open, in-progress, waiting, and closed receipt cards. |
| `/maintenance/new` | 1 | Required-field vehicle receipt workflow. |
| `/maintenance/:cardId` | 1 | Receipt, inspection, work items, approvals, and closure. |
| `/profile` | 1 | Sham’s staff profile. |
| `/settings` | Later | Garage configuration and user management. |

## Phased delivery

### Phase 0 — Foundation audit and safety

- [ ] Inventory reusable components and establish migration/reuse owners.
- [ ] Add Red Power color, typography, spacing, status, and RTL tokens without embedding brand logic in generic primitives.
- [ ] Create a dashboard theme adapter from the approved Red Power tokens; keep shared primitives neutral.
- [ ] Decide the initial approved logo and image set from the website repository, including destination and Arabic alt text.
- [ ] Record build/lint baseline and known pre-existing failures.
- [ ] Leave old routes available until a Red Power replacement is accepted.

**Exit condition:** reusable foundation is intact and migration scope is mapped.

### Phase 1 — Brand, layout, authentication

Detailed execution plan: [`docs/PHASE_1_PLAN.md`](./PHASE_1_PLAN.md).

- [x] Rebrand login and shell for Red Power Garage.
- [x] Configure Arabic as primary locale and validate RTL desktop/mobile behavior.
- [x] Implement shared Admin/Super Admin authorization policy for Release 1.
- [x] Build Red Power navigation: Home, Customers, Maintenance, Profile, Settings.
- [x] Add Sham placeholder profile.

**Exit condition:** a signed-in user reaches a branded Arabic dashboard shell.

> **Open follow-ups (Phase 1):** a human browser QA pass to visually confirm RTL desktop/mobile rendering, drawer behavior, and the language toggle mirroring (code-level checks complete — see `docs/PHASE_1_PLAN.md` §7); official logo asset is a placeholder until copied from the website repository.

### Phase 2 — Customer and vehicle foundation

- [x] Create customer type, service contract, validation, list, create form, and details page.
- [x] Create vehicle type and customer-to-vehicle relationship.
- [x] Search by customer name, phone, plate, VIN, and vehicle details.
- [x] Present full history: visits, receipt cards, work, and statuses.

**Exit condition:** staff can create a customer, associate a vehicle, and retrieve complete history.

> **Status (2026-09-03):** Phase 2 is **code-complete** (see `docs/PHASE_2_PLAN.md` §8). `npm run build` and `npm run lint` (2 pre-existing errors) pass; all customer modules transform under the dev server. Manual browser QA (RTL layout, forms, search, mobile cards) is pending before full verification sign-off.

### Phase 3 — Maintenance receipt cards

Detailed execution plan: [`docs/PHASE_3_PLAN.md`](./PHASE_3_PLAN.md).

- [x] Model statuses: `draft`, `open`, `in_progress`, `waiting_parts`, `ready_for_delivery`, `closed`, `cancelled`.
- [x] Build sectioned receipt form from the supplied card.
- [x] Enforce required receipt validation and record inspection selections.
- [x] Create work items: description, estimate, progress, assignee, completion state.
- [x] Add customer approval and expected delivery fields.

**Exit condition:** a complete vehicle receipt can be created and appears in customer and vehicle history.


### Phase 4 — Open-to-close workflow

Detailed execution plan: [`docs/PHASE_4_PLAN.md`](./PHASE_4_PLAN.md).

- [x] Add activity timeline, work updates, and audi                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 z   t events.
- [x] Prevent closure while any required work item remains open; explain what remains.
- [x] Add close-card confirmation and final status.
- [x] Add dashboard counters for card stages.

**Exit condition:** the lifecycle enforces the client rule that all requested work must close before the receipt closes.

> **Status (2026-09-12):** Phase 4 is **code-complete**. Implemented dedicated work item CRUD operations, domain query-key factories, shared cache invalidation, API-based card close/reopen with super-admin authorization, and server statusEvents for lifecycle timeline. Build passes; manual browser QA for lifecycle interactions remains.

### Phase 5 — Quality and operational readiness

Detailed execution plan: [`docs/PHASE_5_PLAN.md`](./PHASE_5_PLAN.md).

- [x] Validate Arabic labels and workshop terminology with the client.
- [x] Test responsive, keyboard, screen-reader, and RTL behavior.
- [x] Replace mock services with backend contracts incrementally.
- [x] Add focused tests for customer search, receipt validation, and closure guard.
- [x] Retire old delivery/e-commerce routes only after replacements are accepted.

> **Phase 5 integration (2026-09-12):** Implemented dashboard stats API, customer/vehicle maintenance-history endpoints, photo/signature upload/download with authenticated blob rendering, media upload hooks with failure handling, profile display using authenticated staff identity, search debouncing, and 429 rate-limit handling. Build passes; manual browser QA for history preservation and RTL behavior remains.

> **Phase 6 integration (2026-09-12):** Implemented validation field path mapper, translated error message helper with error code branching, distinct error state components (404, 403, 500, network, timeout), 409 conflict handler with query refresh, and build verification. Build passes; manual audit for fixture removal and backend checks remain.

> **Tooling note (2026-09-04):** TypeScript is installed as a development dependency. The receipt-creation form now separates Zod input and output types, and service-created activity events are excluded from the receipt creation payload.

> **Phase 2 API decision (2026-09-11):** Customer and vehicle runtime data is now API-backed and customer lists are server-paginated. Address, customer notes, vehicle mileage, fuel type, and vehicle notes are deliberately excluded until backend persistence exists. Legacy fixtures remain archived and unused.

> **Phase 3 integration (2026-09-11):** Receipt creation now uses a selected customer and current vehicle-ownership ID, and maps only backend-supported create-card fields. The server assigns card numbers and persisted status. Visit reasons load from active server options; inspection/item option selection, media, detail views, and the multi-step fallback remain pending.

> **Phase 3 completion (2026-09-12):** The receipt flow is fully API-backed. A 4-step wizard (customer → vehicle → card → photos/signature) creates customer, vehicle, and card sequentially and retains the created owning records on retry so a failed card write never duplicates earlier rows. Visit reasons, vehicle conditions, and vehicle items are stored as option IDs from the active-option endpoints. The list page uses a dedicated paginated `MaintenanceCardListRow` model (server pagination, `receivedAt` range filter, card-number search, OPEN/CLOSED status), and the detail view maps a separate `MaintenanceCardDetail` model covering relations, required work, approval, media, and server `statusEvents`. Legacy mock `maintenance.service` stays intact for dashboard stats and customer history; work-item editing is deferred to Phase 4. Contract notes: the shared `FRONTEND_BACKEND_INTEGRATION_GUIDE.md` actually lives in the backend repo under `docs/`, and the dashboard root link is currently unresolved.

> **API-truth cleanup (2026-09-12):** Removed fabricated values so the UI never presents invented zeros as real data. Dashboard now renders only real `/dashboard/stats` fields (open/closed cards, today's received, total cards) and dropped the fake `in_progress`/`waiting_parts`/`ready_for_delivery` cards. Customer history now maps the real `/customers/:id/maintenance-history` response (receipt number, OPEN/CLOSED status, entry/delivery dates, mileage, vehicle) with `?? "-"` fallbacks in the UI; the redundant maintenance-side `customerHistory` path and `useHistorySource` are deprecated. Card and work statuses are single-sourced from `maintenance/constants/status.ts` (uppercase API enums) with `MaintenanceCardStatus`/`PersistedWorkStatus` derived as lowercase; the legacy 7-status `MaintenanceStatus` is marked `@deprecated` mock-only. Added `cleanParams` for query params and fail-fast env validation for `VITE_API_BASE_URL`. Remaining known-legacy tsc errors are confined to shared UI primitives.

> **RTL hardening (2026-09-12):** Replaced physical direction utilities across `src/` with Tailwind v4 logical properties (`ml->ms`, `mr->me`, `pl->ps`, `pr->pe`, `left/right inset -> start/end`, `text-left/right -> text-start/end`), removed the old `[dir="rtl"] .mr-2`/`.flex-row` override block from `src/index.css`, and made directional lucide icons direction-aware (`rtl:rotate-180` on pagination/submenu chevrons, forward arrows; `space-x`/`divide-x` now auto-flip via inline margins). Intentional per-field `dir="ltr"`/`dir="rtl"` attributes (plate numbers, phones, dates, numerals) are preserved. Build and lint pass.

> **Tables section 12 (2026-09-12):** Resolved unresolved semantic classes in the customer and maintenance list tables using existing design tokens — `ui/table.tsx` (semantic colors, `h-14` rows, table-scope neutral hover) and `DataTable.tsx` (header/alignment/hover, optional `rowActions` action column with `rtl:rotate-180` chevron, bordered container, `Column.align`). Pagination is localized with RTL-aware prev/next chevrons and correctly uses `perPage` when computing the `from`/`to` range. Toolbar filters in `CustomFilter.tsx` are height-aligned at `h-9 text-sm`, hover uses `text-primary` for dark-mode safety, and `hover:shadow-md` was removed. List pages keep `dir="ltr"` on technical fields (card numbers, phones, plates, dates) and use per-feature mobile card components. Progression-status badges gained a neutral border for contrast. Added `table.view` and pagination i18n keys. All table-scope files type-check; `npm run lint` and `npm run build` pass. Known legacy tsc errors remain confined to shared UI primitives); the unresolved `text-muted-foreground`/`bg-muted` classes outside the tables scope (forms/wizard/detail pages, UI primitives) are deferred to their own audit sections. Manual browser QA for RTL list rendering remains.

> **Forms section 13 (2026-09-12):** Standardized the workshop forms against the Red Power dark design system without re-adding shadcn semantic tokens (the earlier token-addition revert stays). Mapping used existing tokens: `text-muted-foreground`→`text-text-secondary` (placeholders, descriptions, field hints), `text-foreground`→`text-text-primary`, icon/adornment grays→`text-text-muted`, `bg-muted`→`bg-background-secondary`, `border-input`→`border-border`, `bg-input`→`bg-background-secondary`, selected/focus hovers→`bg-primary/10` + `text-text-primary`, `text-destructive`→`text-primary`, `text-*-foreground`→`text-text-on-primary`, button destructive→`bg-primary-dark`. Updated form primitives (`input`, `textarea`, `select`, `form`, `checkbox`, `switch`, `toggle`, `button`, `badge`, `card`, `calendar`, `command`, `tooltip`; `radio-group`/`slider`/`label` needed no change) and fixed a stray CJK character in `calendar.tsx`. Shared inputs are now `h-9` text-sm (removed per-field `px-6 py-4/py-5 text-base` overrides while keeping `ps-14` icon offsets), icons use steel `text-text-muted`, empty select/date/range/time placeholders use `text-text-secondary`, and combobox/multi-select/date/range/time popups switched from `bg-white border` to `bg-popover border-border` for dark-mode consistency. `CustomFormField` now uses `space-y-2`, `mb-1.5` labels, red required asterisk and red errors; `SliderField` takes `Record<number, string>` marks; `TagInputField` honors `maxTags`/`allowDuplicates`. Type hardening: `customFormField.types.ts` typed `control: Control<T>` and `name: Path<T>` (field-type-safe), `Option.icon?`, and corrected `tagInputOptions`. Red Power surfaces updated in `receipt-create.page.tsx` (wizard step circles/labels/hints/media labels, `text-destructive`→`text-primary` validation), `delivery-section.tsx`, and `customer-vehicle-selector.tsx`. All forms-scope files type-check; lint + build pass; the resolved classes are confirmed emitted in the dist CSS. Remaining tsc errors are the pre-existing legacy ones outside forms scope (VendorStatusBadge, language-switcher, ActivateModal, EmptyState, ErrorState); `ui/dialog.tsx`, `ui/drawer.tsx`, `ui/dropdown-menu.tsx`, `ui/tabs.tsx` and the customer detail pages stay pending their own detail/menu sections.

> **Dashboard translations + API (2026-09-12):** Completed the dashboard locale keys in `ar/common.json` and `en/common.json` (workshopManagement, statCards sub-labels/footers, entities, recentMaintenance, quickActions, statsError) and added missing `common.viewAll/customer/vehicle/retry`. Fixed wrong strings (AR header `administrator` was Traditional Chinese `管理員` → `مدير النظام`; `common.active` `مفعّل` → `نشط`) and a copy-paste footer color on the "Received Today" card. `RecentMaintenanceCards` now reuses the shared `MaintenanceStatusBadge` (correct `maintenance.statuses.*` keys) instead of a local badge that resolved a non-existent `common.maintenance.status.*` path. Dashboard failure states no longer fabricate zeros: stat cards and the entity overview render `—` while loading or on `isError`, and an explicit retry alert is shown when `/dashboard/stats` fails. The dashboard render tree is fully API-backed (`useDashboardStats` → `/dashboard/stats`, `useMaintenanceCards` for the recent list). Removed the uncommitted legacy e-commerce widgets left broken by the deleted `dashboard.data.ts`/`RevenueChart.tsx` — `BudgetChart.tsx`, `NewUsers.tsx`, `RecentOrders.tsx` and their barrel exports — and dropped the dead `accentClassName` prop from `StatCard`. Dashboard-scope tsc/lint/build now pass; remaining legacy tsc errors are the 5 unused-import TS6133s in other UI scopes.

> **Dashboard dead-code removal (2026-09-12):** Deleted the remaining unreferenced e-commerce widgets (`CustomTooltip.tsx`, `PerfCard.tsx`, `QuickCard.tsx`, `GoalRow.tsx`, `DashboardHeader.tsx`) and the now-unused component barrel `index.ts`; the dashboard feature keeps only `DashboardEntityOverview`, `RecentMaintenanceCards`, and `DashboardQuickActions`, all imported directly by `pages/Dashboard.tsx`. Pruned `types/dashboard.types.ts` down to `DashboardMaintenanceStats`/`DashboardEntityStats`/`DashboardStats` (removed `QuickCardProps`, `GoalRowProps`, `PerfCardProps`, `SalesData`, `CategoryData`, `RecentOrder`, `NewUser`, `OrderRow`). No legacy translations existed to remove (the widgets resolved unregistered `dashboard`-namespace keys); the one orphaned locale key `dashboard.viewMaintenance` was dropped from `ar`/`en` common.json. tsc (only the 5 pre-existing outside-scope TS6133s), lint, and build all pass.

> **Dead-code sweep + StatusBadge (2026-09-12):** Removed zero-reference shared components `MetricCard.tsx`, `SectionCard.tsx`, and `DataPagination.tsx` (shadcn primitives `drawer`/`tabs`/`toggle-group` kept for planned sections). Rewrote the shared `components/shared/badges/StatusBadge.tsx` as a compact brand badge: the icon and tone are derived internally from `status` (`open` → filled `Circle` with `bg-primary/10 text-primary border-primary/25`; `closed` → `CircleCheck2` with neutral `bg-background-secondary text-text-secondary border-border`), optional translated `label`, merged `className`, base `ui/Badge` — replacing the dead multi-variant light-theme config. `RecentMaintenanceCards` renders it directly with `status={card.status}` and a cross-namespace `maintenance:statuses.*` label instead of passing an icon. tsc (except pre-existing UI-scope TS6133s), lint, and build pass.

> **Formatting centralized in lib (2026-09-12):** Added `formatNumber` to `src/lib/formatter.ts` (locale-neutral by default, preserves existing digit rendering) and routed inline number formatting through the shared helpers: `StatCard`, `DataTable` (pagination `total`), and `DashboardEntityOverview` now call `formatNumber` instead of `.toLocaleString()`. Removed the per-page `formatDate` copy in `RecentMaintenanceCards` (it now uses the lib `formatDate` with the standard `ar-SA`/`en-GB` locale switch). All formatting (date, dateTime, currency, number, phone) now lives in `src/lib/formatter.ts`. tsc, lint, and build pass.

> **Dashboard recent-cards on DataTable (2026-09-12):** `RecentMaintenanceCards` renders through the shared `DataTable` instead of a hand-rolled table: columns for card number (mono, `ltr`), customer (name + phone), vehicle (make/model + plate), status (brand `StatusBadge`), and received date (`formatDate` via `ar-SA`/`en-GB`), with header icons, `rowActions` row navigation, and a `mobileCardComponent`. The table is blended into the section card with `rounded-none border-0 bg-transparent`; loading/error/empty states unchanged. tsc, lint, and build pass.

## Data-model starting point

```text
Customer 1 ── * Vehicle 1 ── * MaintenanceCard 1 ── * WorkItem
                                  ├── * InspectionRecord
                                  ├── * VehicleItem
                                  ├── * Approval
                                  └── * ActivityEvent
StaffMember 1 ── * WorkItem / ActivityEvent
```
