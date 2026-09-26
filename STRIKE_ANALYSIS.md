# STRIKE Website UX/UI Audit & Analysis

## 1. UX/UI Audit

1. **Brand identity:** Ed-tech platform heavily focused on software engineering (DSA, Web Dev, System Design, Gen AI). The brand name "STRIKE" and course names like "Thunder" imply speed, impact, and high energy. The tone is highly professional, empowering, and developer-centric.
2. **Color palette:** Dark mode by default. Deep black (`#000000`) background with stark white (`#ffffff`) text for high contrast. Accent colors likely utilize vibrant, electric hues (neon blue, energetic yellow, or stark white glows) to align with the "Strike/Thunder" motif.
3. **Typography:** Primary font is **Fira Sans**, a legible, modern, and tech-friendly sans-serif typeface, backed by system fonts. Provides excellent readability for dense technical content and resembles code-editor fonts.
4. **Navbar:** Minimalist and functional. Logo on the left, primary navigation in the center, and clear authentication CTAs on the right. 
5. **Hero section:** High-impact value proposition focusing on career transformation. Features a strong headline, a supporting subheadline mentioning key topics, and a prominent primary CTA.
6. **Background and visual effects:** Clean dark aesthetics. Likely uses subtle radial gradients or grid lines to create depth without distracting from the content.
7. **Course sections:** Organized into a clear grid layout, grouping offerings by logical career paths (e.g., Foundations, Advanced, Combos).
8. **Course cards:** Highly structured components containing a thumbnail, bold title, instructor tag, key tech stack badges, and a clear "Enroll" button. Designed to be highly scannable.
9. **Buttons and CTAs:** High contrast. Primary buttons use the brand's core accent color with solid fills, while secondary buttons use outlines or subtle dark gray fills.
10. **Section spacing and layout:** Generous whitespace (macro-whitespace) between sections to separate concepts, making heavy technical information easier to digest.
11. **Border radius, shadows and borders:** Separation is achieved through subtle, low-opacity borders (`rgba(255,255,255,0.1)`) rather than traditional drop shadows (which get lost on black). Slight border-radius for a modern feel.
12. **Images/illustrations:** Clean, high-quality, likely incorporating tech icons, abstract geometry, or polished instructor photos.
13. **Animations and interactions:** Purposeful micro-interactions. Hover states on course cards (slight upward translation, border glow).
14. **Mobile/responsive behavior:** Standard modern responsive design adapting to single columns on mobile with a hamburger menu for navigation.
15. **Overall visual hierarchy:** Excellent. Large, bold headers guide the eye, while metadata (course length, difficulty) uses muted grays to reduce cognitive load.
16. **Tone of the website:** Serious but highly motivating. It positions itself as a premium, no-nonsense platform for engineers wanting to level up.

---

## A. Visual Design System
- **Theme:** Strict Dark Mode.
- **Typeface:** Fira Sans.
- **Surface Colors:** Black (`#000`), Dark Gray (`#111` to `#222`) for cards/modals.
- **Accents:** Electric tones fitting the "Strike" theme.
- **Dividers:** Thin, subtle white borders (`opacity 10-15%`).

## B. Page Structure
1. **Header:** Global navigation & Auth.
2. **Hero:** Value Prop & Primary CTA.
3. **Social Proof:** Companies alumni work at or student numbers.
4. **Catalog:** Grid of course cards (Thunder, Nexus, Combos).
5. **Features/Why Us:** Differentiators (Live doubt sessions, Gen AI integration).
6. **FAQ:** Accordion style for common objections.
7. **Footer:** Legal, links, social media.

## C. Important Reusable UI Components
- **Course Card:** The atomic unit of the catalog (Image, Title, Badges, Price, CTA).
- **Badge/Tag:** Small pills for categorizing tech (e.g., `C++`, `System Design`).
- **Accordion:** Used extensively in the FAQ and Course Curriculum sections.
- **Primary Button:** High-contrast, interactive button used for enrollments.

## D. Interaction Patterns
- **Hover Reveal:** Course cards lighting up or borders highlighting on mouse hover.
- **Expand/Collapse:** In curriculums and FAQs to manage dense information.
- **Sticky Nav:** Keeps the user grounded during long scrolls.

## E. What makes the site recognizable as STRIKE
- The relentless dark-mode, high-contrast aesthetic.
- The thematic naming convention ("Thunder", "Nexus", "Strike").
- Heavy emphasis on foundational (DSA/C++) combined with modern tech (Gen AI, DevOps).

## F. Elements we should recreate
- The clean, fast-loading, zero-distraction dark mode.
- The highly scannable course card architecture.
- The use of Fira Sans for a distinct "code editor" feel.
- The clear, structured FAQ accordion design.

## G. Elements we should improve rather than blindly copy
- **Personalization:** Instead of a static catalog, dynamically recommend courses based on the user's selected goal (e.g., "Cracking FAANG" vs "Building Startups").
- **Visual Depth:** Enhance the stark `#000` background with subtle, animated ambient glows (like distant lightning) to make the page feel more alive.
- **Interactive Previews:** Allow users to see a syllabus preview directly on hover rather than forcing a page transition.
