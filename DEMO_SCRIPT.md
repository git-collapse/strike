# Demo Video Script — STRIKE "System Overclock"

**Target length:** 2.5–3 minutes. Screen recording of the running app with voiceover.
Record at 1080p; do one desktop pass, then a quick mobile (375px) pass for the
responsiveness beat. Keep the cursor deliberate — let each animation finish on camera.

---

## 0:00 — Hook (15s)
> "This is my Thunder Hackathon 6.0 submission — a recreation of the STRIKE homepage
> with a sale experience built *into* the product instead of bolted on top. No banner,
> no popup. The offer is something you **discover**."

*Show:* the homepage at rest, scroll slowly through Hero → courses → Track Your Progress
→ mentors → FAQ so judges see the full recreation first.

## 0:15 — The problem / my idea (25s)
> "The brief asks how you introduce a sale into an existing site without it feeling like
> an ad. STRIKE is a developer platform, so I leaned into that identity: the sale is a
> hidden **'System Overclock'** — a developer-only grant you unlock, the way you'd flip a
> feature flag. It rewards curiosity, which is exactly the behaviour the product wants."

*Show:* hover the floating robot mascot (bottom-right) and the `System: Standard` pill —
point out both as the discovery signals.

## 0:40 — Discovery → curiosity (25s)
> "Two subtle signals invite interaction: a floating assistant that says *'Psst… I've got
> a surprise for you'*, and a system-status pill. Neither screams 'SALE'. You click
> because you're curious what 'Overclock' does."

*Show:* click the robot. The terminal bottom-sheet boots.

## 1:05 — The reveal (30s)
> "Clicking boots a fake developer terminal that streams an authentication sequence, then
> flips the system to Overclock. There's a **Skip** button, and the whole thing respects
> reduced-motion for accessibility."

*Show:* the terminal streaming lines → completion → the Developer Grant panel auto-reveals.
Point to: the **countdown**, the **`OVERCLOCK`** coupon, the **one-click copy** (click it,
show the copied state), and the **Deploy Grant** CTA.

## 1:35 — The payoff (25s)
> "Now the payoff. Every price on the site — courses and memberships — **decrypt-scrambles**
> into its discounted developer rate. The offer clearly states the benefit and which
> products it applies to. It feels like a system state, not a discount card."

*Show:* scroll to the course grid + membership plans; let the prices scramble-settle. Show
the accent treatment change.

## 2:00 — Technical execution (30s)
> "Everything the brief requires works for real. The countdown is driven by one fixed
> timestamp, so **refreshing never resets it** — let me prove it."

*Show:* refresh the page → countdown continues from the same spot, grant still active.

> "State persists via localStorage. It's fully **dismissable** — toggle the pill back to
> Standard and prices revert. And when the timer hits zero the grant **expires**: the
> coupon is struck through and disabled, and pricing reverts everywhere — it can't be
> redeemed. One context is the single source of truth, so expiry can't leave a live coupon
> against a dead price."

*Show (optional, if you can temporarily set a near expiry):* the expired state. Otherwise
describe it.

## 2:30 — Responsiveness + close (20s)
*Show:* the mobile 375px pass — the terminal becomes a bottom-sheet, the grant panel and
course grid reflow cleanly, no horizontal scroll.

> "It's built in React, TypeScript and Framer Motion, responsive from mobile to desktop,
> and animations stay smooth. The goal was a sale that feels like a real STRIKE feature —
> discovered, not advertised. Thanks for watching."

---

## Shot checklist (tick while recording)
- [ ] Full homepage scroll (recreation fidelity)
- [ ] Discovery signals: robot mascot + System pill
- [ ] Terminal boot + Skip button visible
- [ ] Grant panel: countdown, coupon, **copy click + copied state**
- [ ] Price decrypt-scramble on courses AND memberships
- [ ] **Refresh → countdown persists** (the money shot)
- [ ] Toggle back to Standard → prices revert (dismissable)
- [ ] Expired state (struck-through coupon) — live or described
- [ ] Mobile 375px pass — no horizontal scroll

## Talking points if asked "why this approach?"
- A banner interrupts; discovery **invites**. Curiosity → click → reward is a stronger funnel.
- "Overclock" is native to the developer audience — the metaphor *is* the theme match.
- Single-source-of-truth state means the sale can never enter an inconsistent state
  (live coupon + expired price), which is where naive implementations break.
