# Demo Script — STRIKE Overclock Edition

A tight ~90-second walkthrough for the submission video. Do a dry run once so the
countdown and scramble timings feel natural.

**Before recording:** open the site in a fresh tab (or clear `localStorage`) so the
grant starts locked. Desktop viewport for the main take; keep a phone/responsive view
ready for the last beat.

---

## Beat 1 — The landing (0:00–0:15)
- Scroll the homepage top to bottom once: Hero → **stats band counts up** → "Why Strike"
  cards → membership plans → courses → FAQ.
- Line: *"A polished STRIKE landing page — but it's hiding something."*

## Beat 2 — Spot the secret (0:15–0:25)
- Hover the floating **robot mascot** (right edge) — the *"Psst… I've got a surprise"*
  bubble appears. Point out the `System: Standard` pill bottom-right.
- Line: *"Two signals invite you to explore."*

## Beat 3 — Boot the terminal (0:25–0:40)
- Click the robot. The **terminal drawer** slides up and streams the auth sequence.
- Line: *"Overclocking the system authenticates 'developer access'…"*
- (Mention the **Skip** button and reduced-motion fallback exist.)

## Beat 4 — Grant unlocked (0:40–0:55)
- The **Developer Grant** panel auto-opens: live **countdown**, **`OVERCLOCK`** coupon.
- Click **Copy** — show the "Copied" state. Then click **Deploy Grant**.

## Beat 5 — The payoff (0:55–1:10)
- Prices **decrypt-scramble** into discounted developer rates on courses and memberships.
- Line: *"Pricing decrypts in place — save up to 40% on courses, 15% on plans."*

## Beat 6 — It's real state, not a gimmick (1:10–1:25)
- **Reload the page.** Point out: the sale is still active *and the countdown did not
  reset* — it's pinned to a fixed deadline.
- Toggle the `System Overclocked` pill off → prices revert. Toggle back on.

## Beat 7 — Responsive close (1:25–1:35)
- Switch to mobile width. Re-open the grant — it's a **bottom sheet**; layout adapts.
- Line: *"Fully responsive, accessible, and refresh-proof. That's the Overclock."*

---

### Optional talking points if time allows
- Expiry behaviour: once the timer hits zero the coupon is disabled and pricing can no
  longer be redeemed (single source of truth in `OverclockContext`).
- Everything is front-end React state — no backend — see the README for the honest
  known-limitations list.
