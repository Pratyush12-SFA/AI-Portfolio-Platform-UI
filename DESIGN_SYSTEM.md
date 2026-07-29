# Ascend — Design System & Product Foundation (Phase 0)

> **Single Source of Truth (SSOT) for the Ascend Career Operating System**
> Version: 1.0.0 | Date: July 2026

---

## 1. Brand Guidelines & Identity

### 1.1 Brand Profile
* **Product Name**: `Ascend`
* **Tagline**: `Build. Improve. Get Hired.`
* **Mission**: Ascend is an AI-powered Career Operating System that helps students and professionals build resumes, portfolios, optimize career trajectories with AI, analyze job descriptions, and prepare for interviews.

### 1.2 Brand Personality & Tone
The voice of Ascend is designed to feel highly premium, modern, calm, and trustworthy.
* **Premium**: Sophisticated presentation reminiscent of Vercel or Linear.
* **Confident**: Minimalistic and direct, prioritizing quality over clutter.
* **Friendly**: Accessible, supporting candidates at any stage.
* **Professional**: Clean typography and layouts that convey maturity.
* **Minimal**: No unnecessary decorative elements.
* **Tone Constraint**: **Never playful or childish**. Avoid bright, cartoonish gradients, rounded bubble vectors, or conversational filler. It is a high-end tool for professional enablement.

---

## 2. Design Principles

Every interaction inside Ascend must follow these three core principles:
1. **Calm Workspace**: Maximize whitespace. Avoid noisy widgets, constant notifications, or overloaded sidebars. Colors and surfaces should draw focus to the candidate's work.
2. **AI-First Integration**: AI should never feel like a separated tab or sidebar add-on. AI actions must be contextual, sitting directly next to content boxes, text areas, and list items.
3. **Task-Oriented UX**: Avoid standard CRUD tables or long forms. Instead, present cards that represent real-world work items. Reduce clicks and support keyboard-driven actions.

---

## 3. Color Tokens

Ascend utilizes a **Luxury Modern Dark** theme by default. All colors are mapped to CSS custom properties to support semantic utilities and a future light theme.

| Token | CSS Variable | Hex Value | Semantic Usage |
| :--- | :--- | :--- | :--- |
| `color-bg` | `--color-ascend-bg` | `#0B0B0F` | Main app background canvas |
| `color-surface` | `--color-ascend-surface` | `#14141A` | Card, container, and list backgrounds |
| `color-surface-elevated`| `--color-ascend-surface-elevated` | `#1B1B24` | Popovers, dropdown menus, and dialogs |
| `color-sidebar` | `--color-ascend-sidebar` | `#101014` | Sidebar and sticky navigational panels |
| `color-border` | `--color-ascend-border` | `rgba(255,255,255,0.08)` | Dividers, card edges, and focus strokes |
| `color-primary` | `--color-ascend-primary` | `#F5B301` | Active navigation, primary action buttons |
| `color-ai` | `--color-ascend-ai` | `#7C3AED` | Sparkles, AI buttons, suggestion widgets |
| `color-info` | `--color-ascend-info` | `#3B82F6` | Informational status indicators |
| `color-success` | `--color-ascend-success` | `#22C55E` | Verification badges, completed timelines |
| `color-warning` | `--color-ascend-warning` | `#F59E0B` | Incomplete actions, warnings |
| `color-danger` | `--color-ascend-danger` | `#EF4444` | Delete triggers, revoked sessions, errors |
| `text-primary` | `--color-ascend-text-primary` | `#FFFFFF` | Core titles, header text, and bold items |
| `text-secondary` | `--color-ascend-text-secondary` | `#A1A1AA` | Body copy, secondary links, card subtitles |
| `text-muted` | `--color-ascend-text-muted` | `#71717A` | Labels, placeholders, and footer texts |
| `text-disabled` | `--color-ascend-text-disabled` | `#52525B` | Disabled action tabs or empty list markers |

---

## 4. Typography System

* **Primary Font Stack**: `Geist`, `Inter`, -apple-system, system-ui, sans-serif.
* **Secondary Font Stack (Code/Telemetry)**: `Geist Mono`, `Fira Code`, monospace.

### 4.1 Typography Scale

| Scale Role | Font Size | Weight | Line Height | Letter Spacing |
| :--- | :--- | :--- | :--- | :--- |
| **Hero** | `48px` / `3rem` | Bold (700) | `1.15` | `-0.02em` |
| **Display** | `40px` / `2.5rem` | Bold (700) | `1.2` | `-0.01em` |
| **Page Title** | `32px` / `2rem` | Bold (700) | `1.25` | `0` |
| **Section Title** | `24px` / `1.5rem` | Semibold (600) | `1.3` | `0` |
| **Card Title** | `18px` / `1.125rem` | Semibold (600) | `1.4` | `0` |
| **Body** | `16px` / `1rem` | Regular (400) | `1.5` | `0` |
| **Small** | `14px` / `0.875rem` | Regular/Medium | `1.45` | `0` |
| **Caption** | `12px` / `0.75rem` | Medium (500) | `1.4` | `0.05em` (uppercase) |

### 4.2 Readability Constants
* **Maximum Paragraph Width**: `64ch` (roughly `640px` to `700px`). Beyond this, wrap text blocks in grid configurations.
* **Heading Constraint**: Headings should utilize `tracking-tight` utilities for values above `24px`.

---

## 5. Spacing System

Ascend uses an **8px spacing grid** to maintain visual alignment across layout grids, card pads, and margins.

```css
--spacing-xxs:  4px;
--spacing-xs:   8px;
--spacing-sm:   12px;
--spacing-md:   16px;
--spacing-lg:   20px;
--spacing-xl:   24px;
--spacing-xxl:  32px;
--spacing-3xl:  40px;
--spacing-4xl:  48px;
--spacing-5xl:  64px;
--spacing-6xl:  80px;
--spacing-7xl:  96px;
--spacing-8xl:  128px;
```

### 5.1 Spacing Usage Guidelines
* **Margins (Outer Layout)**: Desktop uses `--spacing-xxl` (`32px`) or `--spacing-4xl` (`48px`). Mobile uses `--spacing-md` (`16px`).
* **Card Padding (Inner)**: Cards use `--spacing-xl` (`24px`) or `--spacing-xxl` (`32px`).
* **Component gaps**: Stacked content items use `--spacing-sm` (`12px`) or `--spacing-md` (`16px`).

---

## 6. Radius System

Strict corner shapes separate interactive components from structural background panels:

```css
--radius-button: 12px;
--radius-input:  14px;
--radius-card:   20px;
--radius-drawer: 24px;
--radius-dialog: 24px;
--radius-panel:  28px;
```

---

## 7. Elevation System

Elevation in modern dark themes is defined by background color tinting (surface elevation) and soft dropshadow opacity scaling rather than high-intensity spreads.

### 7.1 Shadow Tokens

```css
/* Base surface shadows */
--shadow-surface: 0 1px 2px 0 rgba(0, 0, 0, 0.5);

/* Cards / Workspace panels */
--shadow-card: 0 4px 12px -2px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3);

/* Dialogs / Command Palettes / AI Drawers */
--shadow-floating: 0 24px 48px -12px rgba(0, 0, 0, 0.6), 0 0 2px 1px rgba(255, 255, 255, 0.05);
```

---

## 8. Motion Guidelines

Animations are implemented with **Framer Motion** for React interfaces. Keep transitions light to maintain a responsive SaaS performance.

### 8.1 Motion Constants

| Interaction | Duration | Easing | Style |
| :--- | :--- | :--- | :--- |
| **Hover Transitions** | `150ms` to `200ms` | `cubic-bezier(0.4, 0, 0.2, 1)` | Ease-out opacity/scale |
| **Page Transitions** | `250ms` | `cubic-bezier(0.16, 1, 0.3, 1)` | Slide up & fade |
| **Drawer Slide** | `350ms` | `spring` (stiffness: 300, damping: 30) | Decelerate snap |
| **Modal / Dialog** | `200ms` | `cubic-bezier(0.32, 0.94, 0.6, 1)` | Scale entry (0.95 to 1) |

### 8.2 Standard Motion Behaviours
* **Cards**: Hovering a card triggers a `scale: 1.01` and `y: -4px` lift with a soft glow overlay.
* **Loading Skeleton**: Shimmer pulse utilizing infinite keyframes with opacity oscillations between `0.4` and `0.8` (cycle: `2s`).
* **Streaming AI text**: Typewriter rendering. Text displays character-by-character with a blinking cursor indicator at the end.

---

## 9. Layout Rules

```css
--layout-max-width: 1400px;
--layout-sidebar-width: 280px;
--layout-navbar-height: 64px;
--layout-ai-drawer-width: 420px;
```

* **Desktop Structure**: Three-column configuration. Left column (Sidebar: 280px), Center column (Flex-1, max-width: 800px workspace), Right column (AI Coach: 420px).
* **Tablet Structure**: Two-column layout. Left Sidebar + Center content. AI Coach panel collapses into a sliding right drawer.
* **Mobile Structure**: Single-column viewport. Bottom Nav replaces the sidebar. AI coach operates as a full-viewport modal sheet.

---

## 10. Responsive Breakpoints

All breakpoints conform to standard viewport width boundaries:

* **`xs` (480px)**: Large mobile. Switch list items to single column grid stacks.
* **`sm` (640px)**: Tablet portrait. Navigation switches to bottom bars.
* **`md` (768px)**: Tablet landscape. Sidebar slides out, navbar shrinks.
* **`lg` (1024px)**: Laptop. Full 3-column workspace accessible.
* **`xl` (1280px)**: Desktop. Maximum layout boundaries enforced.
* **`2xl` (1536px)**: Large displays. Align workspace elements using centring templates.

---

## 11. Accessibility (a11y) Rules

1. **Color Contrast**: All primary text elements must maintain a minimum contrast ratio of `4.5:1` against their respective backgrounds (WCAG AA standard). Secondary and muted text must maintain `3:1`.
2. **Keyboard Focus**: Focusable elements must feature a clear outline reset:
   `focus-visible:ring-2 focus-visible:ring-[#F5B301] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0F] focus-visible:outline-none`.
3. **ARIA Semantics**: Use landmark tags (`aside`, `main`, `nav`, `header`). All custom buttons must have `role="button"` and `aria-label` declarations.
4. **Reduced Motion**: Respect system preferences:
   ```css
   @media (prefers-reduced-motion: reduce) {
     * {
       animation-duration: 0.01ms !important;
       animation-iteration-count: 1 !important;
       transition-duration: 0.01ms !important;
       scroll-behavior: auto !important;
     }
   }
   ```

---

## 12. Component Design Standards

### 12.1 Interactive Components
* **Buttons**:
  * *Primary*: Golden background (`#F5B301`), dark text, `rounded-xl`.
  * *Secondary*: Translucent grey background, white text, thin border.
  * *AI Sparkle*: Gradient background (Gold-to-Purple) with a pulsing hover shadow.
* **Inputs**:
  * Background of `#14141A` (surface) with a 1px border. Focus state scales border color to `#F5B301` or `#7C3AED` with a matching glow shadow.
* **Command Palette**:
  * Glass overlay centered in the viewport. Built-in search bar with hotkey commands (`CMD + K`).

### 12.2 Structural Panels
* **Modals & Dialogs**:
  * Centered popups (`rounded-[24px]`) with glass background effects (`backdrop-blur-md`).
* **AI Coach Drawer**:
  * Persistent panel on the right with a message stream that mimics Cursor's editor chat interface.

---

## 13. Component Inventory

A unified list of components that need to be created for Ascend:

### 13.1 Layout & Navigation
* `AppLayout`: Global wrapper with responsive grid definitions.
* `Sidebar`: Left navigation shell.
* `Navbar`: Mobile top bar.
* `BottomNavigation`: Mobile bottom navigation widget.

### 13.2 Core Component Kit
* `Button`: Primary, secondary, AI, and icon actions.
* `InputField`: Form inputs with floating labels.
* `Dropdown`: Option selection popover.
* `Modal`: Dialog popups with backdrop blur.
* `Drawer`: Slide-out sheets for mobile/tablet.
* `Toast`: Alert feedback notifications.
* `Tooltip`: Hover descriptors.
* `CommandPalette`: Keyboard-driven utility search.

### 13.3 Sub-Workspace Modules
* `MetricCard`: Interactive numeric tracker.
* `ActivityTimeline`: Action audit logs.
* `NotionEditor`: Document and block text editor.
* `InlineAIField`: Text boxes with contextual AI improvement buttons.
* `ATSScanner`: File upload container with circular progress fit scores.
* `RecruiterInbox`: Split-view messages interface.
* `CompetencyChart`: SVG line plots.

---

## 14. Frontend Folder Structure

Ascend uses a **Feature-Based / Domain-Driven Architecture** inside the `src` folder:

```
src/
├── assets/             # Brand logos, global static SVGs and images
├── config/             # Environment parameters, third-party settings
├── constants/          # Static layout dimensions, configuration arrays
├── contexts/           # Global React providers (Auth, Theme)
├── hooks/              # Global custom hooks (useMediaQuery, useLocalStorage)
├── layouts/            # Page shell layouts (DashboardLayout, PublicLayout)
├── providers/          # Root Context and TanStack query wrappers
├── routes/             # App routing maps (AppRoutes, ProtectedRoute)
├── services/           # Shared service APIs (apiClient, authService)
├── styles/             # CSS definitions (index.css, theme.css)
├── types/              # Domain typescript interfaces (Portfolio.d.ts)
├── utils/              # Utility helpers (formatting, dates, classNames)
└── features/           # Domain-specific workspace structures
    ├── home/           # Home Dashboard module
    │   ├── components/ # Dashboard metrics, timeline, and suggestions
    │   ├── hooks/      # Home activity queries
    │   └── index.ts    # Home module exports
    ├── resume/         # Resume Workspace module
    │   ├── components/ # Notion-like block editor, AI rewrite modules
    │   ├── services/   # Resume CRUD api
    │   └── types/      # Resume specific typings
    ├── portfolio/      # Portfolio themes, slug editor, and theme cards
    ├── jobs/           # ATS scanner, cover letter generator
    ├── coach/          # Persistent AI Assistant panels
    └── analytics/      # Custom SVG charts
```

---

## 15. UX Principles & Guidelines

Developers must answer these three questions on every screen:
1. **Where am I?**: Give the page a clear title (e.g. "Resume Builder") and match the active sidebar tab.
2. **What should I do?**: Every workspace should feature a clear primary action (e.g. "Add Experience").
3. **How can AI help?**: Present a secondary glowing action button (e.g. "✨ STAR Format") next to inputs to encourage AI optimization.

---

## 16. Coding Standards

* **Naming Conventions**:
  * Files: PascalCase for React components (`AppSidebar.tsx`), camelCase for utility helper functions (`formatDate.ts`).
  * Variables/Props: camelCase (`activeTab`, `setActiveTab`).
* **Component Structures**:
  * Define explicit prop interfaces for every React component:
    ```typescript
    interface ButtonProps {
      variant: "primary" | "secondary" | "ai";
      label: string;
      onClick: () => void;
    }
    ```
* **State Management**:
  * Keep state as local as possible. Share configuration parameters via Context API (`useAuth`). Use async loaders for database data fetching.
