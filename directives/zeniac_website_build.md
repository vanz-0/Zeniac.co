
> [!IMPORTANT]
> **PROTOCOL CHANGE**: Do not ask for permissions or reviews mid-task. Execute the plan, build the finished product, push to GitHub, and THEN ask for review.

## 1. Objective
Construct the **Zeniac.Co** "Operating System" website—a premium, high-performance marketing and operations platform for small businesses. The site must embody the **Zenith** (High-End/Gold) + **Brainiac** (Smart/Tech) identity using the "Front-Style" aesthetic, primarily serving female-centric brands but positioned as a comprehensive operations partner for all high-growth small businesses.

## 2. Inputs & Context
*   **Brand Identity:** "Dark Mode Front". Deep Zinc backgrounds (`#09090b`), Zenith Gold (`#FFD700`) accents, crisp White text.
*   **Target Audience:** High-growth small businesses, primarily (but not exclusively) women-owned businesses in Beauty, Wellness, and Fashion.
*   **Voice:** "The Strategic Operations Partner" (Confident, Direct, Strategic).
*   **Component Library:** `resources/Components/`

## 3. Technology Stack (Execution Layer)
*   **Core:** Next.js 16 (App Router), TypeScript.
*   **Styling:** Tailwind CSS v4, Shadcn UI.
*   **Motion:** Framer Motion, Three.js, Canvas Confetti.

## 4. Procedure (Orchestration Steps)

### Phase 1: Foundation
1.  **Scaffold:** Initialize Next.js project with `create-next-app` (Clean Slate).
2.  **Configure:** Setup `globals.css` with the "Zeniac Dark" palette and Tailwind 4 theme.
3.  **Dependencies:** Install `lucide-react`, `framer-motion`, `clsx`, `tailwind-merge`, `three`.

### Phase 2: User Component Integration (Adapt to Black/Gold)
1.  **Background:** Implement `Meteors` from `Backgrounds/Components and various div's background.txt`.
2.  **Hero:** Implement `Hero Section Animation.txt`.
3.  **Process:** Implement `The Process Orbital Visualization.txt` (Zeniac Core).
4.  **Layout:** Implement `Bento Grid.txt` for Service offerings.
5.  **Social Proof:** Implement `Rivew and Testimonials.txt` and `Intaractive Icon cloud.txt`.

### Phase 3: Assembly
1.  **Page Structure:** Assemble the components into `app/page.tsx`.
2.  **Refinement:** Ensure all text matches the "Female-Centric" copy strategy (e.g. "Empower", "Elevate").

### Phase 4: Verification
1.  **Check:** Ensure no hydration errors.
2.  **Review:** Verify component responsiveness and "Gold" styling override.
