# STRIKE Visual Design & Wireframe Specification

## 1. Visual Direction
Based on the STRIKE website (`https://strikes.in/`), the core visual system is a high-contrast, premium, dark-mode ed-tech interface.

- **Background:** Deep black (`#000000`).
- **Primary Text:** Stark white (`#ffffff`).
- **Secondary Text:** Muted gray (`#a1a1aa` or `#888888`).
- **Accent Colors:** Electric/neon blue (`#3b82f6` scale) and energetic yellow (`#fbbf24`), symbolizing "Strike/Thunder".
- **Borders:** Thin, subtle low-opacity white (`rgba(255,255,255,0.1)`).
- **Cards:** Slightly elevated with a dark gray surface (`#111111` or `#18181b`).
- **Buttons:** Solid accent fill for primary, subtle outlines for secondary. High contrast text.
- **Typography:** `Fira Sans` (primary, clean, readable, tech-focused).
- **Spacing:** Generous macro-whitespace (e.g., 96px between sections) to separate dense technical content.
- **Section Widths:** Max-width containers (e.g., `1200px`) to keep line lengths readable.
- **Border Radius:** Modern, subtle curves (`8px` to `12px`).
- **Shadows & Glows:** Traditional drop shadows are avoided. Uses subtle box-shadow glows (`0 0 15px rgba(accent, 0.2)`) on active/hover states.
- **Grid/Background Treatment:** Mostly flat black, occasionally using subtle radial gradients behind key focal points (like the Hero).

## 2. Desktop Wireframe

```text
======================================================================
                              NAVBAR
======================================================================
 [ STRIKE LOGO ]                                      [Login] [Sign Up]
 Home     Courses     Practice     Projects
======================================================================

                              HERO
======================================================================
                  
                  Master DSA & Web Development
                  
           Learn Data Structures, Algorithms, Web Dev, 
           and Gen AI with Rohit Negi.
           
                  [ Explore Courses ]   [ View Combos ]
                  
======================================================================

                              COURSES
======================================================================
 [Foundations]  [Advanced]  [Combos]

 ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
 │ [Image]         │   │ [Image]         │   │ [Image]         │
 │ Web Dev         │   │ DSA + AI        │   │ System Design   │
 │ Rohit Negi      │   │ Rohit Negi      │   │ Rohit Negi      │
 │                 │   │                 │   │                 │
 │ ₹ 4,999         │   │ ₹ 6,999         │   │ ₹ 3,999         │
 │ [ Enroll Now ]  │   │ [ Enroll Now ]  │   │ [ Enroll Now ]  │
 └─────────────────┘   └─────────────────┘   └─────────────────┘

======================================================================
                              FOOTER
======================================================================
                                                         ┌────────────┐
                                                         │ > System:  │
                                                         │   Standard │
                                                         └────────────┘
```

**Section Details:**
- **Navbar:** Sticky, frosted glass effect (`backdrop-filter: blur(8px)`), minimal.
- **Hero:** Centered text, large H1, supportive subtitle, high-impact CTA. 
- **Courses:** Grid layout (3 columns on desktop), filter pills above the grid. Normal STRIKE styling.
- **Sale Discovery:** A fixed-position pill in the bottom-right corner. It periodically glitches to read `> Overclock?`.

## 3. Overclock Activation (The Terminal Drawer)

When the user clicks `> init_overclock()`:

```text
┌──────────────────────────────────────────────────────────────────┐
│ _                                                       [ Close ]│
│ > Connecting to STRIKE mainframe...                              │
│ > Authenticating developer access...                             │
│ > Access Granted.                                                │
│ > Developer Grants located.                                      │
│ > Recalibrating UI...                                            │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Specifications:**
- **Size:** 100% width, ~30vh height (bottom anchored).
- **Position:** Fixed at the bottom, sliding up.
- **Background:** Very deep charcoal (`#0a0a0a`) with a subtle noise texture to feel physical.
- **Border:** Top border only (`1px solid rgba(59, 130, 246, 0.5)`).
- **Typography:** Monospace (e.g., `Fira Code` or `Consolas`), 14px/16px.
- **Accent Color:** Neon green (`#10b981`) or STRIKE blue (`#3b82f6`).
- **Text Animation:** Auto-typing effect, appearing line by line rapidly.
- **Close/Skip:** A subtle `[ Close ]` or `[ Esc ]` button in the top right to instantly skip the animation.
- **Backdrop:** A dark overlay (`rgba(0,0,0,0.6)`) dims the rest of the site to focus attention.
- **Vibe:** Modern CLI tool (like Next.js or Vite terminal output), NOT a 1990s hacker movie.

## 4. Overclocked State

The visual transformation after the terminal completes.

**BEFORE (Normal STRIKE):**
- **Background:** Solid black (`#000`).
- **Grid:** None.
- **Cards:** `#111` background, subtle white border `rgba(255,255,255,0.1)`.
- **Buttons:** Solid brand color.
- **Sale Indicator:** None.

**AFTER (Overclock Mode):**
- **Background:** Remains black, but a faint, glowing isometric CSS grid fades in.
- **Cards:** Background shifts slightly to `#18181b`. The border changes to a glowing 1px accent color (`rgba(accent, 0.4)`).
- **Buttons:** Text changes to "Deploy Grant".
- **Badges:** A new glowing `[ DEVELOPER GRANT ]` badge appears on eligible courses.
- **Navigation:** The bottom pill becomes a sticky minimal banner: `[ System Overclocked: Grants Active ]`.
- **Typography:** Price text uses a monospace font during the decryption animation.

## 5. Course Card Design

**NORMAL COURSE CARD:**
```text
┌──────────────────────────────┐
│ [ Thumbnail Image ]          │
│                              │
│ 100 Days of Code: Web Dev    │
│ By Rohit Negi                │
│ [Beginner] [Frontend]        │
│                              │
│ ₹ 4,999                      │
│                              │
│ [ Enroll Now ]               │
└──────────────────────────────┘
```

**OVERCLOCKED COURSE CARD:**
```text
┌──────────────────────────────┐
│ [ DEVELOPER GRANT ]          │
│ [ Thumbnail Image ]          │
│                              │
│ 100 Days of Code: Web Dev    │
│ By Rohit Negi                │
│                              │
│ ~₹ 4,999~  →  ₹ [DECRYPT]    │
│                              │
│ [ Deploy Grant & Enroll ]    │
└──────────────────────────────┘
```

**Specifications:**
- **Dimensions:** Fixed height, flexible width based on CSS Grid (e.g., min-width 300px).
- **Spacing:** `24px` internal padding.
- **Border:** Normal: `1px solid rgba(255,255,255,0.1)`. Overclocked: `1px solid rgba(59, 130, 246, 0.5)`.
- **Hover State:** Normal: Translates up `-4px`. Overclocked: Glow intensity increases `box-shadow: 0 0 20px rgba(59, 130, 246, 0.2)`.
- **Badge:** Overclocked mode adds an absolute-positioned top-left glowing badge.
- **Button:** Fills width, standard padding (`12px 24px`).

## 6. Price Decryption

The price reveal animation for the discounted price.

**Animation Spec:**
- **Trigger:** When the course card enters the viewport in Overclock mode.
- **Sequence:**
  `₹ [Original]`
  `₹ 8274`
  `₹ 1932`
  `₹ 5019`
  `₹ [Final Sale Price]` (e.g. `₹ 2,499`)
- **Duration:** 1200ms total.
- **Cycling Speed:** Updates every 50ms.
- **Easing:** Linear for the scramble, snap to final.
- **Typography:** Uses a tabular lining monospace font to prevent the text width from jittering.
- **Reduced Motion:** If `prefers-reduced-motion` is true, skip the scramble and instantly render the final price.

## 7. Sale CTA

**Text:** `Deploy Grant & Enroll`

- **Normal State:** Solid fill (e.g., `#3b82f6`), white text, `border-radius: 8px`.
- **Hover State:** Background brightens slightly (`#60a5fa`), subtle box-shadow glow.
- **Active State:** Scales down slightly (`transform: scale(0.98)`).
- **Focus State:** `outline: 2px solid white; outline-offset: 2px;`.
- **Loading State:** Text fades out, replaced by a spinning loader/spinner, button becomes non-interactive.
- **Mobile:** Fills 100% of the container width to maximize tap target.

## 8. Mobile Wireframe

```text
======================================
 [=] MENU               [ STRIKE ]
======================================
 
       Master DSA & Web Dev
       [ Explore Courses ]

======================================
             COURSES
======================================
 
 ┌──────────────────────────┐
 │ [Image]                  │
 │ Web Dev                  │
 │ ₹ 4,999                  │
 │ [ Enroll Now ]           │
 └──────────────────────────┘
 
======================================
              FOOTER
======================================

  (FAB)
   +-------------------+
   | > Overclock System|
   +-------------------+
```

**Mobile Interaction Differences:**
- **No Hover:** The Sale Discovery mechanism cannot rely on hover to stop glitching. It is a Floating Action Button (FAB) that pulses softly.
- **Trigger:** Tapping the FAB instantly opens the Terminal as a bottom sheet.
- **Terminal Control:** Instead of auto-typing right away, the terminal might have a prominent `[ Run Sequence ]` button to let the user control the flow on touch.
- **Animations:** Simplified. Drop the background glowing grid (performance cost on mobile) and keep the visual changes contained to the course cards (borders and price decryption).

## 9. Animation Timeline

Main Interaction Timeline (0.0s to 3.0s+):

- **0.0s:** User clicks `> init_overclock()`.
- **0.0s – 0.3s:** Drawer slides up from bottom (`translateY(100%)` to `0`), Backdrop fades in (`opacity: 0` to `1`).
- **0.3s – 0.5s:** Terminal prompt `_` blinks.
- **0.5s – 1.8s:** Terminal lines auto-type sequentially (approx 200ms per line).
- **1.8s – 2.4s:** Final terminal line (`Recalibrating UI...`), website background dims, CSS grid begins to fade in.
- **2.4s – 2.8s:** Terminal minimizes to banner. Overclocked course card borders illuminate.
- **2.8s+:** User scrolls to courses; Price decryption sequence fires as cards enter viewport.

## 10. Design Tokens

```css
/* Core Colors */
--color-bg-base: #000000;
--color-bg-surface: #111111;
--color-bg-surface-hover: #18181b;
--color-text-primary: #ffffff;
--color-text-secondary: #a1a1aa;
--color-accent-primary: #3b82f6; /* STRIKE Blue */
--color-accent-glow: rgba(59, 130, 246, 0.2);

/* Borders */
--color-border-subtle: rgba(255, 255, 255, 0.1);
--color-border-overclock: rgba(59, 130, 246, 0.5);
--radius-card: 12px;
--radius-button: 8px;

/* Typography */
--font-sans: 'Fira Sans', system-ui, sans-serif;
--font-mono: 'Fira Code', 'Consolas', monospace;

/* Spacing */
--space-section: 96px;
--space-card-padding: 24px;

/* Animation */
--duration-fast: 150ms;
--duration-drawer: 300ms;
--duration-decrypt: 1200ms;
--ease-standard: cubic-bezier(0.4, 0, 0.2, 1);
```

## 11. Component Map

```text
App
├── Navbar
├── Hero
├── CourseSection
│   ├── FilterBar
│   └── CourseGrid
│       └── CourseCard (Consumes isOverclocked context)
│           ├── Thumbnail
│           ├── CourseInfo
│           ├── DecryptPrice (Handles scramble logic)
│           └── SaleCTA
├── SaleDiscovery
│   ├── TriggerPill (Desktop)
│   └── TriggerFAB (Mobile)
├── TerminalOverlay (Handles the overclock transition state)
├── OverclockBanner (Sticky active state indicator)
└── Footer
```
- **CourseCard:** Reusable UI component, wildly changes visual output based on context.
- **TerminalOverlay:** Handles the heavy lifting of the cinematic transition.
- **DecryptPrice:** A specialized component dedicated solely to the number scramble animation.

## 12. Design Quality Check (Senior Designer Review)

- **Risk:** Sale trigger is too difficult to notice.
  - *Solution:* Add a subtle pulse or glow to the pill every 10 seconds. If the user scrolls past 50% of the page without interacting, the pill nudges upward slightly.
- **Risk:** The glitch animation becomes annoying while reading.
  - *Solution:* Ensure the glitch only happens occasionally (e.g., a 200ms glitch every 6 seconds) rather than looping continuously.
- **Risk:** Terminal feels gimmicky / 90s hacker movie.
  - *Solution:* Keep the design minimalist. Use a modern, dark CLI aesthetic (like Vercel/Next.js build output). Keep the sequence fast (< 3 seconds total) and provide a `Skip` button.
- **Risk:** Sale mode looks disconnected from STRIKE.
  - *Solution:* Only change the borders, add the badge, and the grid background. Do NOT change the layout, fonts, or core card structure.
- **Risk:** Poor contrast during Overclock mode.
  - *Solution:* Ensure the neon accent color passes WCAG AA contrast ratio against `#18181b`. Use white text for the final prices.
- **Risk:** Price decryption jitters layout.
  - *Solution:* Use tabular numbers (`font-variant-numeric: tabular-nums;`) and ensure the container has a fixed minimum width.

## 13. Final Design Checklist
- [x] Defined core visual system mapped to STRIKE's dark mode.
- [x] Created ASCII desktop and mobile wireframes.
- [x] Specified the Overclock Terminal activation sequence.
- [x] Defined before/after Overclock states.
- [x] Detailed the Course Card transformations.
- [x] Outlined the price decryption animation mechanics.
- [x] Specified CTA button states (Hover, Focus, Active, Loading).
- [x] Established a 3.0s animation timeline.
- [x] Created CSS-friendly design tokens.
- [x] Mapped the React component hierarchy.
- [x] Reviewed and mitigated UX/Design risks.
