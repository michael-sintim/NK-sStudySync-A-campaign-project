# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.


# 📘 NK's StudySync — Contributor Documentation

Welcome to the **NK's StudySync** codebase! This document is your complete guide to understanding, navigating, and contributing to the project. Whether you're fixing a bug, adding a feature, or just exploring, start here.

---

## 📑 Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Folder & File Structure](#3-folder--file-structure)
4. [Core Concepts](#4-core-concepts)
5. [File-by-File Breakdown](#5-file-by-file-breakdown)
   - [NKsStudySync.jsx (Homepage)](#51-nksstudysyncjsx-homepage)
   - [ContactPage.jsx (Registration)](#52-contactpagejsx-registration)
   - [CWATargetPlanner.jsx (CWA Calculator)](#53-cwatargetplannerjsx-cwa-calculator)
   - [InternshipHelpDesk.jsx (Company Directory)](#54-internshiphelpdeskjsx-company-directory)
   - [InternshipPage.jsx (Internship Wrapper)](#55-internshippagejsx-internship-wrapper)
6. [Design System](#6-design-system)
7. [Supabase Integration](#7-supabase-integration)
8. [Common Patterns](#8-common-patterns)
9. [How to Contribute](#9-how-to-contribute)
10. [FAQ / Gotchas](#10-faq--gotchas)

---

## 1. Project Overview

**NK's StudySync** is a React-based web platform for KNUST engineering students. It provides:

- 🎯 A landing page promoting the movement and manifesto
- 📝 A student registration form (backed by Supabase)
- 🧮 A **CWA Target Planner** that calculates what grades a student needs
- 🏢 An **Industry Bridge** directory of 178+ verified internship companies in Ghana
- 🤖 Integration with **QuizLensAI** (external AI study tool)

The audience is university students in Ghana, so the design is bold, energetic, and uses an amber/black/red palette inspired by a campaign aesthetic.

---

## 2. Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | React (functional components + hooks) |
| **Routing** | `react-router-dom` (`useNavigate`) |
| **Backend / DB** | [Supabase](https://supabase.com/) (Postgres + REST API) |
| **Styling** | Mix of external CSS file + inline `<style>` tags + inline JS objects |
| **Fonts** | Google Fonts — *Oswald* (headings), *Plus Jakarta Sans* / *Poppins* (body) |
| **Icons** | Inline SVGs (no icon library dependency) |

> ⚠️ **Important:** This project has **no build tooling documented here** — it's assumed to be a Vite or Create React App project. Check `package.json` for the exact scripts.

---

## 3. Folder & File Structure

Based on the provided files, the structure looks like:

```
src/
├── NKsStudySync.jsx            # Homepage / landing page
├── NKsStudySync.css            # Global styles for homepage
├── ContactPage.jsx             # Student registration form
├── CWATargetPlanner.jsx        # CWA / GPA target calculator
├── InternshipHelpDesk.jsx      # Internship directory component
├── InternshipPage.jsx          # Page wrapper for internships
├── supabaseClient.js           # Supabase client instance (imported everywhere)
└── ...
public/
└── IMG_8586.JPG.jpeg           # NK's StudySync logo
```

### Key relationships

- `NKsStudySync.jsx` **imports** `InternshipHelpDesk` (though it doesn't currently render it — see [Gotchas](#10-faq--gotchas)).
- `InternshipPage.jsx` **imports** `InternshipHelpDesk` and renders it as the main content.
- Every form component imports `supabase` from `./supabaseClient`.

---

## 4. Core Concepts

Before diving into files, understand these recurring ideas:

### 🎨 The THEME object
Most files define a local `THEME` constant holding brand colors. This is duplicated intentionally so each file is self-contained.

```js
const THEME = {
  amber: "#F5A300",
  red: "#D32F2F",
  black: "#111111",
  white: "#FFFFFF",
};
```

### 🔍 useScrollReveal / IntersectionObserver
The homepage uses `IntersectionObserver` to trigger "reveal on scroll" animations. Sections fade in when they enter the viewport — see `useScrollReveal()` and `RevealSection`.

### 🔢 useCountUp
A custom hook that animates a number from `0` to `target` when a stat card becomes visible. Used for the "impact" stats.

### 📩 Supabase inserts
Forms don't use a REST backend you wrote — they insert directly into Supabase tables:

| Table | Used in | Purpose |
| :--- | :--- | :--- |
| `email_signups` | Homepage "Join" | Quick email capture |
| `contact_signups` | ContactPage | Full student registration |
| `QuizLensAI_clicks` | Homepage | Click analytics for the QuizLensAI CTA |

### 🧭 Navigation pattern
Navigation uses `react-router-dom`'s `useNavigate()`:
```js
navigate("/internships")  // goes to the internships page
navigate("/cwa")          // goes to the CWA calculator
navigate("/contact")      // goes to the registration form
```
In-page sections use `scrollTo(id)` (smooth scroll to `#id`).

---

## 5. File-by-File Breakdown

### 5.1 `NKsStudySync.jsx` (Homepage)

**Purpose:** The main landing page — the "campaign" site.

**Sections (in order):**

| Section ID | What it is |
| :--- | :--- |
| `hero` | Animated headline + CTA buttons |
| `mission` | Three mission cards (Academic Equity, Collaboration, Tutorials) |
| `problem` | Stat cards (73%, 60%, 80%, 12%) describing student struggles |
| `impact` | Big numbers + logo strip of engineering schools |
| `voices` | Three student testimonials |
| `manifesto` | Five-point academic manifesto |
| `QuizLensAI` | Promo section for the AI tool |
| `internships` | Teaser linking to `/internships` |
| `cwa` | Teaser linking to `/cwa` |
| `join` | Email signup form + social links |
| _(footer)_ | Brand, links, socials |

**Key sub-components (defined in the same file):**

- `StatCard` — animated number used in the Problem section
- `ImpactStat` — animated number used in the Impact section
- `RevealSection` — wrapper that fades content in on scroll

**State:**
- `scrolled` — toggles nav style when user scrolls past 60px
- `drawerOpen` — controls the mobile hamburger drawer
- `heroWords` — staggered word-by-word animation for the hero title
- `email`, `submitted`, `signupError`, `loading` — for the signup form

**Key functions:**
- `handleSignup()` — validates email, inserts into `email_signups`
- `handleQuizLensAIClick()` — logs a click to `QuizLensAI_clicks`, then opens the external site
- `scrollTo(id)` — smooth scroll to a section

**`navItems` array format:**
```js
[id, label, isRoute]
// isRoute=true  → navigate("/id")
// isRoute=false → scrollTo(id)
```

---

### 5.2 `ContactPage.jsx` (Registration)

**Purpose:** Full student registration form, submitted to Supabase `contact_signups`.

**Fields collected:**

| Field | Required | Notes |
| :--- | :--- | :--- |
| `full_name` | ✅ | |
| `email` | ✅ | Validated with regex, lowercased before insert |
| `phone` | ❌ | |
| `level` | ✅ | Level 100–400 |
| `programme` | ✅ | From `PROGRAMMES` array |
| `campus_status` | ✅ | "On Campus" / "Off Campus" toggle |
| `hostel_name` | ❌ | Placeholder changes based on campus status |
| `reason` | ❌ | Free text |

**Validation:** `validate()` returns an `errors` object. If any required field is missing/invalid, the form won't submit.

**Styling approach:** This file injects a big `<style>` tag at runtime using `getStyles()`. The style is added to `document.head` in a `useEffect` and removed on unmount. There's also a `styleVersion` hack that forces a re-render to make sure styles apply.

**Success state:** After submission, the form is replaced by a success card that greets the user by first name.

**Error handling:**
- `23505` (Postgres unique violation) → "This email is already registered!"
- Other errors → generic message

---

### 5.3 `CWATargetPlanner.jsx` (CWA Calculator)

**Purpose:** Given a student's current CWA, credits, target CWA, and this semester's credit load, calculate:
- The average they need this semester
- Whether the target is achievable
- What-if scenarios across grade bands
- A step-by-step breakdown of the math

**KNUST grading classes (defined in `CLASSES`):**

| Class | Min CWA |
| :--- | :--- |
| First Class | 70% |
| Second Class Upper | 60% |
| Second Class Lower | 50% |
| Pass | 45% |
| Fail | below 45% |

**Core math:**
```
totalCreds      = cumCreds + semCreds
currentWeighted = curCWA * cumCreds
neededFromSem   = targetCWA * totalCreds - currentWeighted
requiredAvg     = neededFromSem / semCreds
```

**Sub-components:**
- `HeroCard` — the big "you need X%" result
- `TargetsCard` — table of required averages for each class
- `ScenariosCard` — grid of "if you average X%, you'll get Y%"
- `MathCard` — shows the calculation step by step

**Styling approach:** Uses inline JS style objects (`const S = { ... }`) — no CSS file.

**Note:** All output is computed client-side — no Supabase call here.

---

### 5.4 `InternshipHelpDesk.jsx` (Company Directory)

**Purpose:** A filterable, searchable directory of internship companies.

**Data source:** The `INTERNSHIP_DATA` array — a big hardcoded list at the top of the file. Each entry has:

```js
{
  program: "Civil Engineering",
  company: "Taysec Construction Ltd",
  region: "Greater Accra",
  city: "Accra",
  email: "info@taysec.com.gh",
  focus: "Heavy civil construction...",
  interests: ["Construction", "Infrastructure", "Private Sector"],
}
```

> 💡 **If you want to add a company, just append a new object to `INTERNSHIP_DATA`.** It will automatically show up in filters and search.

**Derived lists (computed at module load):**
- `ALL_PROGRAMS` — unique programmes
- `ALL_CITIES` — unique cities
- `ALL_INTERESTS` — unique interest tags

**State:**
- `search` — free text
- `filterProgram`, `filterCity`, `filterInterest` — dropdowns/pills

**Filtering:** `useMemo` recomputes the visible list whenever any filter changes.

**Styling:** Injected `<style>` tag via a `styles` template string.

**Program colors:** `programColors` maps each engineering programme to an accent color used on the card's top border and label.

---

### 5.5 `InternshipPage.jsx` (Wrapper)

**Purpose:** A thin page wrapper around `InternshipHelpDesk`.

It renders:
1. A fixed nav bar with the logo and a "Back to Home" button
2. The `<InternshipHelpDesk />` component

This exists so that the `InternshipHelpDesk` component can be reused elsewhere (e.g. as a section on the homepage) while still being reachable as its own route (`/internships`).

---

## 6. Design System

### Color palette

| Token | Hex | Use |
| :--- | :--- | :--- |
| Amber | `#F5A300` | Primary brand color, headings, CTAs |
| Amber Light | `#FFB800` | Gradients, nav backgrounds |
| Amber Dark | `#E09000` | Gradient stops |
| Black | `#111111` | Text, nav, dark sections |
| Red | `#D32F2F` | Accents, "danger"/highlight |
| White | `#FFFFFF` | Backgrounds, text on dark |

### Typography

| Font | Usage |
| :--- | :--- |
| **Oswald** (400–700) | Headings, buttons, tags, labels |
| **Plus Jakarta Sans** | Body text (ContactPage, InternshipHelpDesk) |
| **Poppins** | Body text (NKsStudySync, CWATargetPlanner) |

### Visual motifs

- **Neo-brutalist shadows**: `box-shadow: 5px 5px 0 var(--black)` — solid offset shadows
- **Uppercase tracked tags**: `.section-tag` — small pill with letter-spacing
- **Reveal-on-scroll**: sections fade/slide in
- **Gradient backgrounds**: amber gradients and dark `#111 → #1a1a1a` gradients

### Breakpoints

- `768px` — filters stack; mobile card layout changes
- `700px` — internship grid becomes single-column
- `600px` — contact form fields stack

---

## 7. Supabase Integration

The Supabase client is imported from `./supabaseClient` in every file that touches the DB.

### Tables expected

| Table | Columns used |
| :--- | :--- |
| `email_signups` | `email` (unique) |
| `contact_signups` | `full_name`, `email`, `phone`, `level`, `programme`, `campus_status`, `hostel_name`, `reason` |
| `QuizLensAI_clicks` | `clicked_at`, `referrer`, `user_agent` |

### Insert pattern

```js
const { error } = await supabase.from("table_name").insert([{ ...fields }]);
if (error) {
  // handle error.code === "23505" for unique violations
}
```

> 🔐 **Contributors:** You'll need the `.env` file with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (or their CRA equivalents). Ask the maintainer for access, or use your own Supabase project for testing.

---

## 8. Common Patterns

### Adding a new page

1. Create `MyNewPage.jsx` in `src/`.
2. Import `useNavigate` if you need back/home navigation.
3. Add a route in your router config (likely `App.jsx` or `main.jsx`).
4. Add a nav item in `navItems` inside `NKsStudySync.jsx` if it should appear in the menu.

### Adding a new section to the homepage

1. Add a `<section id="my-section">` inside `NKsStudySync.jsx`.
2. Wrap contents in `<RevealSection>` for the fade-in effect.
3. Add `["my-section", "My Section", false]` to `navItems`.

### Adding a new internship company

Append to `INTERNSHIP_DATA` in `InternshipHelpDesk.jsx`. Filters update automatically.

### Adding a new color

Add it to the local `THEME` constant in the file you're editing (colors are duplicated per-file by design).

### Creating a new animated stat

```jsx
<StatCard target={85} suffix="%" label="Your label here" />
```
It will animate from 0 → 85 when scrolled into view.

---

## 9. How to Contribute

### Setup

```bash
# 1. Clone
git clone https://github.com/<owner>/<repo>.git
cd <repo>

# 2. Install
npm install

# 3. Add environment variables
# Create a .env file with Supabase keys (ask the maintainer)

# 4. Run
npm run dev
```

### Workflow

1. **Branch off `main`:**
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. **Make your changes.** Follow existing patterns (see above).
3. **Test locally** — check both desktop and mobile widths.
4. **Commit with a clear message:**
   ```
   feat: add new internship company for Biomedical Engineering
   fix: correct CWA calculation when target < current
   docs: update README with setup steps
   ```
5. **Push and open a Pull Request** describing what changed and why.

### Code style guidelines

- Use **functional components** + **hooks** (no class components).
- Use **inline SVG** for icons (no external icon libraries).
- Keep the `THEME` constant local to each file — don't refactor into a shared module without discussion.
- Use `useMemo` for expensive derived data (like filtering).
- Use `useCallback` for handlers passed to child components.
- Name CSS classes with a component prefix (e.g. `ihd-`, `cp-`, `ip-`) to avoid collisions.

### Asking for access

If you need collaborator access to the repo, ask the owner to add you via **Settings → Collaborators → Add people**. See the earlier Git/GitHub guide for details.

---

## 10. FAQ / Gotchas

### ❓ Why does each file duplicate the `THEME` object?
Because the project evolved organically and prefers self-contained files. It's a trade-off: less DRY, but each file can be copy-pasted without breaking imports.

### ❓ Why is `InternshipHelpDesk` imported in `NKsStudySync.jsx` but never used?
It was likely meant to be embedded as a section but ended up being routed separately via `InternshipPage.jsx`. You can safely remove the unused import — or better, actually render it. **Check before deleting.**

### ❓ Why does ContactPage use that weird `styleVersion` hack?
Runtime-injected styles sometimes don't apply on first render in some setups. The hack forces a re-render. It's not elegant — a future refactor could move styles to a proper `.css` file.

### ❓ The nav in `InternshipPage.jsx` calls `scrollTo("hero")` but that function doesn't exist in scope.
That's a **bug**. It's inside an `onClick` on a `<div>` in the logo, but `scrollTo` is not imported or defined. It won't break the app unless the user clicks the logo image, but it should be removed or replaced with `navigate("/")`.

### ❓ Some files import `InternshipHelpDesk from "./Internshiphelpdesk "` (with a trailing space).
This is a **bug waiting to happen**. File names with trailing spaces are fragile. Rename the file to `InternshipHelpDesk.jsx` (no space, correct casing) and fix the imports.

### ❓ Can I use TypeScript?
The codebase is plain JavaScript. If you want to migrate, open an issue first — it's a big change.

### ❓ Where are the routes defined?
Not in the files provided. Look in `App.jsx`, `main.jsx`, or wherever `<Routes>` / `<BrowserRouter>` is set up. The routes referenced are:
- `/` → `NKsStudySync`
- `/contact` → `ContactPage`
- `/cwa` → `CWATargetPlanner`
- `/internships` → `InternshipPage`

### ❓ How do I test Supabase inserts locally?
Use a **Supabase test project** with the same table schemas. Never commit real keys to the repo — use `.env` and add it to `.gitignore`.

---

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

click here to access the website  https://nk-s-study-sync-a-campaign-project.vercel.app/