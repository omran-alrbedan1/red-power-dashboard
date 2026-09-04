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

- [x] Add activity timeline, work updates, and audit events.
- [x] Prevent closure while any required work item remains open; explain what remains.
- [x] Add close-card confirmation and final status.
- [x] Add dashboard counters for card stages.

**Exit condition:** the lifecycle enforces the client rule that all requested work must close before the receipt closes.

> **Status (2026-09-04):** Phase 4 is **code-complete**. The service-layer closure guard, close confirmation, activity timeline, work-item updates, and live counters are implemented. `npm run build` passes; manual browser QA for RTL, keyboard dialog navigation, timeline layout, and lifecycle interactions remains before full verification sign-off.

### Phase 5 — Quality and operational readiness

Detailed execution plan: [`docs/PHASE_5_PLAN.md`](./PHASE_5_PLAN.md).

- [ ] Validate Arabic labels and workshop terminology with the client.
- [ ] Test responsive, keyboard, screen-reader, and RTL behavior.
- [ ] Replace mock services with backend contracts incrementally.
- [ ] Add focused tests for customer search, receipt validation, and closure guard.
- [ ] Retire old delivery/e-commerce routes only after replacements are accepted.

> **Tooling note (2026-09-04):** TypeScript is installed as a development dependency. The receipt-creation form now separates Zod input and output types, and service-created activity events are excluded from the receipt creation payload.

## Data-model starting point

```text
Customer 1 ── * Vehicle 1 ── * MaintenanceCard 1 ── * WorkItem
                                  ├── * InspectionRecord
                                  ├── * VehicleItem
                                  ├── * Approval
                                  └── * ActivityEvent
StaffMember 1 ── * WorkItem / ActivityEvent
```
