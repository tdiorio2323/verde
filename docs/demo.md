# TD Canna App Demo Guide

## Quick Start

- Install dependencies with `pnpm install` (or `npm install`).
- Run the playground locally via `pnpm dev` and open the Vite URL.
- To ship a static preview, build with `pnpm build` then run `pnpm preview`.

## Customer Experience

- Landing page CTA (`Enter Platform`) routes to `/dashboard`.
- Select a dispensary from the glass selector, adjust filters (search, category, sort).
- Add items to the floating cart and open the drawer to review fees.
- Choose `Checkout & Track`, fill in contact fields, and place the order.
- Use the `Advance status` button on the tracking card to simulate courier progress.

## Driver Console

- Navigate to `/dashboard/driver` or switch tabs.
- Each assignment card shows distance, payout, timing, manifest, and notes.
- Sequentially press the primary action (`Accept run`, `Start route`, etc.) to move the mock state machine through delivery.

## Admin Command Center

- Visit `/dashboard/admin` for live KPIs, filtered order queue, inventory health, and team roster.
- The status filter above the orders table limits records by state.
- KPI deltas reflect the mock metrics seeded in `src/data/store.ts`.

## Keyboard & Accessibility

- Category chips, sort menus, and drawers are keyboard navigable with visible focus rings.
- Use `esc` to close drawers/modals; `tab` cycles through inputs in checkout and data tables.
- Screen reader labels are included on search, cart controls, modal fields, and driver actions.

## Tips

- `Advance status` is repeatable to reach the delivered state.
- Edit mock data (products, assignments, metrics) centrally in `src/data/store.ts` for future updates.
