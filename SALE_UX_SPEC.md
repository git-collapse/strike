# STRIKE Sale Experience: Comprehensive UX/Product Specification

## 1. STRIKE Visual Analysis
Based on the live STRIKE website, the design language is unequivocally targeted at software engineers and tech enthusiasts.
- **Brand Identity:** High-energy, professional, developer-centric ed-tech.
- **Overall Visual Language:** Sleek dark mode, code-editor aesthetic, zero clutter.
- **Color Palette:** Background is deep black (`#000000`), text is stark white (`#ffffff`) and muted grays (`#a1a1aa`). Accents are vibrant neon/electric hues (blues, yellows) representing "Strike/Thunder".
- **Typography:** `Fira Sans` – highly legible, modern sans-serif that feels like a clean code editor.
- **Navbar:** Sticky, minimal, glassmorphism or solid black backing, clear authentication CTAs.
- **Hero Section:** High-impact, direct value proposition, bold typography, focused on career acceleration.
- **Background Treatment:** Mostly flat black, utilizing subtle radial gradients or thin grid lines for depth instead of complex shapes.
- **Course Presentation:** Clean CSS grids, segmented by categories (Web Dev, DSA, AI).
- **Course Cards:** Atomic components containing a thumbnail, title, instructor name, technology tags, and price. Highly scannable.
- **Buttons and CTA:** High-contrast solid fills for primary actions, subtle outlines for secondary actions.
- **Borders/Radius/Shadows:** Since drop shadows vanish on black backgrounds, STRIKE relies on subtle low-opacity white borders (`rgba(255,255,255,0.1)`), soft neon glows, and slight border-radii (~8px - 12px) for separation.
- **Images/Illustrations:** High-quality instructor photos, clean 3D tech icons, minimal abstract geometry.
- **Animations:** Purposeful micro-interactions (e.g., hover states lifting cards slightly with a border glow).
- **Scroll Behavior:** Smooth, standard vertical scroll.
- **Mobile/Responsive:** Grid collapses to a single column, hamburger menu for navigation.
- **Emotional Tone:** Motivating, serious, premium, and focused on technical mastery.

## 2. Three Concepts

### Concept 1: System Overclock (The Dev Terminal)
- **One-line description:** A hidden "developer mode" that users trigger to overclock the platform, revealing discounted grants.
- **Core idea:** The sale is framed not as a discount, but as a hidden "Developer Grant" accessible only to those curious enough to interact with a glitching UI element.
- **Why it fits STRIKE:** Deeply resonates with the developer target audience and the "Strike/Thunder" tech aesthetic.
- **User journey:** Notice glitching pill -> Click -> Terminal slides up -> Authenticates "Dev Mode" -> Site transforms -> Unlocked prices decrypt.
- **Main interaction:** Clicking a glitching system status pill to initialize an interactive terminal sequence.

### Concept 2: The Debugger (Code Refactor Challenge)
- **One-line description:** A mini interactive code snippet on the homepage that users must "fix" to unlock the sale.
- **Core idea:** Prove your skills to unlock the discount. The user selects the correct line of code to fix an intentional bug (e.g., an $O(N^2)$ loop).
- **Why it fits STRIKE:** STRIKE teaches DSA. A code challenge perfectly aligns with the core product offering.
- **User journey:** Notice glowing code block -> Read comment "Fix to unlock" -> Select correct fix -> Code compiles -> Sale reveals below it.
- **Main interaction:** A lightweight multiple-choice selection or drag-and-drop within a syntax-highlighted code block.

### Concept 3: The Skill Tree (Level Progression)
- **One-line description:** Users plot their career path on a visual tech tree, and a "lightning strike" reveals a bundle deal for their specific path.
- **Core idea:** Shift the focus from buying a course to investing in a career trajectory.
- **Why it fits STRIKE:** "Strike" branding aligns with the lightning reveal. Matches the platform's structured learning paths.
- **User journey:** See interactive node graph -> Select desired career (e.g., Gen AI) -> Lightning animation connects nodes -> Custom sale bundle revealed.
- **Main interaction:** Clicking connected nodes in an interactive, diagrammatic skill tree.

## 3. Concept Comparison
- **STRIKE brand fit:** All three fit well. Concept 1 (Terminal) feels the most native to the existing UI. Concept 2 (Debugger) is very relevant but might disrupt the browsing flow. Concept 3 (Skill Tree) is highly visual but requires a massive structural change to the page.
- **Curiosity/Engagement:** Concept 1 creates mystery (Why is this glitching?). Concept 2 challenges the user (Can I solve this?). Concept 3 is exploratory.
- **Interaction Quality:** Concept 1 relies on a single, memorable, cinematic transition. Concept 2 requires cognitive load. Concept 3 requires multiple clicks.
- **Discoverability:** Concept 2 is the most obvious. Concept 1 requires careful placement to ensure it's not missed. Concept 3 dominates the viewport.
- **Feasibility:** Concept 1 is the most feasible to build on top of the existing STRIKE architecture without tearing down the existing course grid.

## 4. Selected Concept: System Overclock (The Dev Terminal)
**Reasoning:** The "System Overclock" concept provides the best balance of narrative, creativity, and technical feasibility. It treats the user with respect (as a developer finding a hidden mode) rather than a consumer being hit with a popup. It allows the normal STRIKE homepage to remain pristine and fully functional for users who ignore the easter egg, fulfilling the core requirement that the normal experience must still exist.

## 5. Complete User Journey

### STATE 01 — FIRST ARRIVAL
- **See:** Standard STRIKE dark-mode homepage. Recognizable hero, value prop, standard course catalog.
- **Curiosity Element:** A small pill in the bottom right corner of the viewport (or appended to the navbar) reads `[ System: Standard ]`. Every 5-8 seconds, it slightly glitches (CSS skew, color split) to read `[ Overclock? ]` for a split second.

### STATE 02 — DISCOVERY
- **Notice:** The user spots the glitching element. It stands out because the rest of the site is very clean and stable.
- **Avoid Interruption:** The glitch is subtle. It does not block content, move the layout, or force a modal open. The user can browse normally if they ignore it.

### STATE 03 — FIRST INTERACTION
- **Action:** User hovers over the pill.
- **Feedback:** The glitch stops. The pill expands slightly, glowing with a neon accent. The text changes to `> init_overclock()`. The cursor becomes a pointer.

### STATE 04 — TRANSITION
- **Action:** User clicks.
- **Transition:** A sleek terminal drawer slides up from the bottom (covering ~30% of the screen). 
- **Animation:** The background website dims slightly. In the terminal, green monospace text types out rapidly:
  `> Connecting to STRIKE mainframe...`
  `> Authenticating developer access...`
  `> Access Granted. Developer Grants located.`
  `> Recalibrating UI...`
- **Duration:** 2.5 seconds total. Fast enough to not be annoying, slow enough to be cinematic.

### STATE 05 — SALE ACTIVATION
- **See:** The terminal minimizes into a sticky banner at the bottom: `[ System Overclocked: Grants Applied ]`.
- **Reveal:** The website behind it has transformed. The black background now features a glowing isometric grid. Course cards have gained a 1px neon border. The user is now in the sale experience.

### STATE 06 — COURSE DISCOVERY
- **Presentation:** The existing course grid remains, but is augmented. 
- **Interaction:** As the user scrolls down to the courses, the original prices are struck through. The new prices are actively "decrypting" (a rapid shuffle of random numbers `0104... 8492...`) before settling on the sale price.
- **Communication:** A badge on the cards reads `[ Developer Grant ]` instead of "SALE". Value is communicated via the skills they unlock at an exclusive rate.

### STATE 07 — OFFER REVEAL
- **Communication:** The final offer is revealed within the context of the course cards. A special "Combo" card (e.g., DSA + GenAI) is highlighted with a moving gradient border, showcasing the highest value deal.
- **Earned:** It feels earned because they had to "initialize" the system to see it.

### STATE 08 — FINAL CTA
- **Action:** User clicks to enroll.
- **CTA Text:** The standard "Enroll Now" button is updated in this mode to `Deploy Grant & Enroll`.

## 6. Page Structure

1. **Navbar**
   - **Purpose:** Navigation and Auth.
   - **Visual:** Standard STRIKE black nav. Sticky.

2. **Hero**
   - **Purpose:** Communicate core value.
   - **Visual:** Standard STRIKE hero. Unchanged to preserve brand trust.

3. **Sale Discovery Mechanism (The Pill)**
   - **Purpose:** The entry point.
   - **Visual:** Fixed position bottom-right. Monospace font, subtle CSS glitch animation.

4. **Terminal Drawer (Overlay)**
   - **Purpose:** The transition vehicle.
   - **Visual:** Slides up from bottom. Deep charcoal background, neon green/blue text.

5. **Interactive Sale Experience (The Overclocked UI)**
   - **Purpose:** The container for the sale.
   - **Visual:** Activated state adds a CSS radial gradient or glowing grid to the `<body>` background.

6. **Course Discovery (Catalog)**
   - **Purpose:** Display the deals.
   - **Visual:** Course cards with neon borders and decrypting price text.

7. **Final CTA (Within Cards)**
   - **Purpose:** Conversion.
   - **Visual:** Solid neon fill button.

8. **Footer**
   - **Purpose:** Legal/Links. Unchanged.

## 7. Interaction States
**The Core Interaction: The Overclock Sequence**
- **Trigger:** Click on `> init_overclock()` pill.
- **Visual response:** Terminal slides up, text auto-types.
- **Duration:** ~2.5s.
- **Transition:** Website background illuminates, terminal collapses to a banner.
- **Next state:** User is in "Overclock Mode". Scroll triggers price decryption.

## 8. Animation System
- **Page Entrance:** Standard fade-in.
- **Sale Discovery:** CSS keyframe glitch (skew, text-shadow offset) every 5s.
- **Main Interaction:** Drawer `transform: translateY(0)`. Auto-typing effect using JS intervals or CSS steps.
- **Course Reveal:** React component that rapid-cycles strings before resolving to the final price.
- **Hover States:** Course cards translate up `-4px` with a box-shadow glow.
- **Reduced Motion:** If `prefers-reduced-motion` is active, skip the auto-typing and glitch, instantly reveal the terminal text, and instantly show the new prices without decryption.

## 9. Mobile Strategy
- **Mobile Navbar/Hero:** Standard responsive stacking.
- **Sale Discovery:** Touch targets must be at least 44x44px. The bottom-right pill becomes a Floating Action Button (FAB).
- **Touch Interaction:** Since hover doesn't exist, the FAB pulses softly instead of glitching on hover. Tapping it instantly opens the terminal.
- **Terminal:** Opens as a Bottom Sheet modal taking up 50% of the screen. User must tap a `[ Run ]` button instead of waiting for auto-type (to give them control on mobile).
- **Animations:** Disable background grid illumination on mobile to save battery/performance. Rely solely on the card border color changes and price decryption.

## 10. Content Strategy
- **Discovery Pill:** `[ System: Standard ]` -> `[ Overclock? ]`
- **Terminal output:** 
  `> Connecting...`
  `> Developer Grants located.`
  `> Recalibrating UI...`
- **Course Badges:** `[ Grant Applied ]`
- **Pricing:** `[SALE_DISCOUNT]% Developer Grant Active until [SALE_END_DATE]`
- **Final CTA:** `Deploy Grant & Enroll`

## 11. Accessibility Requirements
- **Keyboard Navigation:** The glitch pill must be focusable via `tabindex="0"`. Pressing 'Enter' must trigger the terminal.
- **Focus States:** High contrast outline (`2px solid #fff`) on all interactive elements.
- **Contrast:** Ensure neon text in the terminal passes WCAG AA contrast ratios against the charcoal background.
- **Reduced Motion:** Fully respect the OS-level reduced motion media query.

## 12. Technical Implementation Plan
- **Framework:** React (Next.js or Vite).
- **Component Structure:** 
  - `<App>` wraps everything in an `<OverclockProvider>`.
  - `<GlitchPill>` (the trigger).
  - `<TerminalDrawer>` (the transition).
  - `<CourseCatalog>` (listens to context to render either standard or overclocked cards).
  - `<DecryptPrice>` (handles the number shuffle animation).
- **State Management:** React Context API or Zustand. A simple boolean `isOverclocked` at the root level dictates the UI state.
- **Animation Approach:** Framer Motion for the drawer slide and layout transitions. Pure CSS for the glitch effect to ensure 60fps performance.
- **Responsive:** Standard CSS Flexbox/Grid, media queries for the FAB and bottom sheet.

## 13. Competition/Judge Review
- **Memorable:** The narrative is incredibly strong. It turns a boring discount into a "hacker" moment.
- **Generic Risks:** If the terminal looks cheap or the typing animation is laggy, it will feel like a bad 90s movie trope. It must be polished and sleek.
- **Annoyances:** The glitch animation could be distracting if it happens too often or is too large. The terminal animation MUST be skippable or fast.
- **Judging Impact:** High marks for originality and brand fit. It proves the designer understands the specific target audience (developers).
- **Must Avoid:** Do NOT lock the normal site content behind the terminal. Users must be able to buy courses at normal price if they ignore the easter egg.
- **Elevation Details:** Add a subtle, low-volume mechanical keyboard typing sound effect during the terminal sequence (ensure it's muted by default or requires explicit interaction).

## 14. Final Implementation Checklist
- [ ] 1. Setup React Context (`isOverclocked` state).
- [ ] 2. Build the standard STRIKE Hero and Course Grid (State 01).
- [ ] 3. Create the `<GlitchPill>` component with CSS animations.
- [ ] 4. Build the `<TerminalDrawer>` with Framer Motion and typing effect.
- [ ] 5. Wire the Pill to open the Drawer, and the Drawer to trigger `setOverclocked(true)`.
- [ ] 6. Update `<CourseCard>` to read the context and alter its styling (borders, tags).
- [ ] 7. Build the `<DecryptPrice>` component.
- [ ] 8. Implement mobile overrides (Bottom sheet, FAB).
- [ ] 9. Test accessibility (Keyboard navigation, reduced motion).
- [ ] 10. Polish transitions and performance.
