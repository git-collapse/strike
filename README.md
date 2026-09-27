# STRIKE — Overclock Edition ⚡

A polished reimagining of the [STRIKE](https://strikes.in) ed-tech homepage, built for
**THUNDER HACKATHON 6.0 — Frontend Task**. It reproduces STRIKE's dark, high-energy
developer aesthetic and layers on a signature interaction the original doesn't have:
a hidden **"System Overclock"** developer-terminal easter egg that unlocks a
time-limited **Developer Grant** sale.

> The whole experience is a single-page React app — no backend. The "auth" pages and
> the sale are front-end simulations designed to showcase UX, animation, and state
> management. See **Known limitations** below.

---

## The idea

Most landing-page clones stop at "looks the same." This one asks: *what would make a
developer-focused learning platform feel alive?* The answer here is a discoverable
secret. A curious visitor notices a floating assistant and a `System: Standard` toggle.
Flipping it to **Overclock** boots a fake terminal, "authenticates developer access,"
and reveals hidden developer pricing across courses and memberships — complete with a
refresh-proof countdown and a copyable coupon. It rewards exploration, which is exactly
the behaviour the product wants from its audience.

---

## User flow

1. **Land on the homepage.** Hero, membership plans, course catalog, a "Track Your
   Progress" dashboard preview, "Why Strike" features, mentors, testimonials, a FAANG
   placement band, and an FAQ — all standard pricing.
2. **Notice the signals.** A floating robot mascot (right edge) nudges *"Psst… I've got
   a surprise for you"*, and a `System: Standard` pill sits bottom-right.
3. **Trigger the terminal.** Clicking the robot (or the pill) boots a bottom-sheet
   terminal that streams an authentication sequence, then flips the system to
   **Overclock**. (A **Skip** button and reduced-motion support short-circuit the
   animation.)
4. **Grant unlocked.** A panel auto-reveals the **Developer Grant**: a live countdown,
   the **`OVERCLOCK`** coupon (one-click copy), and a *Deploy Grant* CTA.
5. **See the payoff.** Course and membership prices *decrypt-scramble* into their
   discounted developer rates. The whole UI adopts an "overclocked" accent treatment.
6. **Toggle off anytime.** The pill now reads `System Overclocked`; clicking it reverts
   to standard pricing. State persists across reloads.
7. **When time runs out.** Once the countdown hits zero the grant is marked expired,
   the coupon is struck through and disabled, and pricing centrally reverts to standard
   — the offer can no longer be redeemed.

---

## Feature checklist (task requirements → where they live)

| Requirement | Status | Where |
|---|---|---|
| Hidden/discoverable sale trigger | ✅ | Robot mascot + `System: Standard` pill → `SaleDiscovery.tsx` |
| Cinematic reveal ("terminal") | ✅ | `TerminalOverlay.tsx` (streamed lines, skip, reduced-motion) |
| Countdown timer | ✅ | `OverclockContext.tsx` drives it; rendered in `SaleDiscovery.tsx` |
| Countdown does **not** reset on refresh | ✅ | Fixed absolute `OFFER_END_TIMESTAMP`; remaining = end − `Date.now()` |
| Coupon code shown + copyable | ✅ | `OVERCLOCK`, `navigator.clipboard` with copied-state feedback |
| Discounted pricing on unlock | ✅ | `PriceReveal.tsx` / `CourseCard.tsx` / `MembershipPlans.tsx` |
| Decrypt/scramble price animation | ✅ | `ScrambleNumber` in `PriceReveal.tsx` |
| Dismissable / reversible | ✅ | Panel close, backdrop click, and `System Overclocked` toggle-off |
| Expiry makes offer non-redeemable | ✅ | Context auto-reverts `isOverclocked`; coupon + CTA disabled |
| Persists across sessions | ✅ | `localStorage` (`strike_overclock_active`), clamped by expiry |
| Responsive (mobile → desktop) | ✅ | Tailwind breakpoints; bottom-sheet on mobile, centered modal on desktop |
| Accessible / reduced motion | ✅ | `useReducedMotion`, `matchMedia`, focus rings, `aria-*`, dialog roles |

Beyond the brief, the homepage adds a **"Track Your Progress" dashboard preview**
(animated weekly-activity chart + streak line, clearly labelled *Preview*), a **"Why
Strike" features grid**, a **mentors** section, **testimonials**, a **FAANG placement
band**, and an **FAQ accordion** (one of which explains how to redeem the grant) to
round the page out into a complete, on-brand landing experience.

---

## Technical approach

- **Single source of truth.** `OverclockContext` owns `isOverclocked`, `isExpired`,
  and `timeLeft`. Because the countdown and the pricing logic read the same context,
  expiry *automatically* reverts prices everywhere — there's no way for the UI to show
  a live coupon against expired pricing.
- **Refresh-proof countdown.** The offer end is a fixed wall-clock timestamp
  (`OFFER_END_TIMESTAMP`). Every load/tick computes `max(0, end − now)`, so reloading
  never restarts the clock. A 1s interval updates `timeLeft`; hitting zero flips
  `isExpired` and clears the overclock flag.
- **Persistence with a safety clamp.** The active state rehydrates from `localStorage`
  but returns `false` if the offer has already expired, so a stale flag can't resurrect
  a dead sale. Writes are wrapped in `try/catch` for privacy-mode browsers.
- **Zero-layout-shift decrypt.** `ScrambleNumber` animates by replacing only digits
  (`/\d/g`) in the formatted `en-IN` string, preserving separators so the price never
  jitters as it settles.
- **Motion, done responsibly.** Framer Motion powers the terminal drawer, staggered
  `whileInView` reveals, `layout` transitions, and count-ups — all gated behind
  reduced-motion checks.
- **Stack.** React 19 + TypeScript + Vite 8, Tailwind CSS v4 (CSS-first `@theme`),
  Framer Motion, React Router, lucide-react.

---

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
```

```bash
npm run build    # type-check (tsc -b) + production build
npm run preview  # serve the built output
npm run lint     # oxlint
```

Requires Node 18+ (Vite 8). No environment variables or backend are needed.

---

## Known limitations

- **Demo authentication only.** The Login/Signup/Forgot-password routes are UI mocks.
  There is no real backend, session, or credential storage beyond front-end state.
- **Illustrative dashboard preview.** The "Track Your Progress" weekly-activity chart
  is a *product-feature mockup* labelled **Preview** — it depicts what the learner
  dashboard looks like, not real user activity or verified platform metrics.
- **Placeholder mentor avatars.** The mentors section uses generated initial-avatars
  rather than real photographs.
- **Simulated sale.** Pricing, discounts, and the `OVERCLOCK` coupon are front-end
  simulations for the hackathon; nothing is charged or validated server-side.
- **Clipboard copy** depends on the browser's `navigator.clipboard` API (secure
  contexts); it fails gracefully where unavailable.
- The production bundle currently ships as a single chunk (~534 kB / ~165 kB gzip),
  which triggers Vite's chunk-size advisory — acceptable for a demo, code-splittable
  later if needed.

---

## Project structure

```
src/
  context/OverclockContext.tsx   # single source of truth: state, countdown, expiry, persistence
  components/
    SaleDiscovery.tsx            # robot mascot, System pill, grant panel, coupon, countdown UI
    TerminalOverlay.tsx          # cinematic activation sequence
    PriceReveal.tsx              # scramble-decrypt price component
    ProgressTracker.tsx          # "Track Your Progress" dashboard preview (chart + streak line)
    Hero / MembershipPlans / CourseGrid / WhyStrike / Mentors / Testimonials / FaangBand / FAQ / Navbar / Footer
  pages/Login.tsx                # demo auth screens
```

---

*Built as a hackathon submission. STRIKE branding is used for a design-fidelity
exercise; this is not an official STRIKE product.*

