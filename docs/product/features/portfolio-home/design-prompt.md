# Design prompt: portfolio-home (Claude Design or v0)

Use this to make higher-fidelity mocks of two screens of everas.dev. The source of truth is
`ux.md` in this folder. Don't invent content or new visual styles.

## What the feature is

everas.dev is a personal site moving from a blog to a professional profile for recruiters and
hiring managers filling senior remote roles. The look stays as it is. Only content, navigation
and one link colour change.

## Where it sits

- **Home `/`** replaces the old home (a blog greeting, a list of five posts and a newsletter form).
- **About `/about`** keeps its layout: a photo column and a two-thirds bio column from 1280px,
  stacked below that.
- Both sit in the existing frame. The header has the logo, "everas.dev", "About", "Résumé", a
  theme switch, and a menu button below 640px. The footer has the Email, GitHub and LinkedIn
  icons and "Enmanuel Veras • © 2026 • everas.dev".

**Attach screenshots of the current live screens before generating: `https://everas.dev/` and
`https://everas.dev/about`, in light and dark, at 400px and 1280px wide.**

## Design system

Attach `DESIGN.md` from the repository root and use only its tokens. The key ones:

- **Font:** Montserrat for everything.
- **Colours:**
  - Light: `surface` #ffffff, `heading` #111827, `muted` #6b7280, `border` #e5e7eb.
  - Dark: `surface-dark` #030712, `heading-dark` #f3f4f6, `muted-dark` #9ca3af,
    `border-dark` #374151.
- **Link colour (changed by this feature):**
  - Light: #0270a0, hover #065f86.
  - Dark: #0db1ea, hover #37c7f9.
- **Type:**
  - `display`: 3.75rem / 700, tight. `display-sm` 2.25rem and `display-xs` 1.875rem on smaller
    screens.
  - `card-title`: 1.5rem / 700.
  - `form-title`: 1.125rem / 600.
  - `lead`: 1.125rem / 400.
  - `meta`: 1rem / 500.
- **Layout:** one centred column, 48rem wide, 64rem from 1280px. Gutters are 1rem, 1.5rem from
  640px.
- **Shapes:** cards have a 2px border and 0.375rem radius. The look is flat, with no shadows.

## Screens to mock

Mock each at 400×800 and 1280×800, in light and dark.

### 1. Home
1. **Hero, no photo.** In order:
   - `h1` "Enmanuel Veras" (`display`)
   - "Senior Software Engineer" (`card-title`, `heading` colour)
   - The intro in `lead`, `muted` colour: "I build full-stack products in TypeScript and LLM
     systems in Python. 8 years shipping React, Node.js and AWS; most recently, the RAG pipeline
     behind an AI sales assistant used by ~150 car dealerships."
   - A row of text links: "Résumé (PDF) →", "Email", "GitHub", "LinkedIn".

   All of the hero must be visible without scrolling at 400×800.
2. A thin divider.
3. **"Selected work"** `h2` (`card-title`). Three bordered cards, single column, full width. Each
   card has a title (`form-title`), a muted meta line and a muted description:
   - "AI Sales Assistant for Car Dealerships"
     - Meta: "Contract · 2023–2025"
     - "Built the RAG pipeline (Python, FastAPI, LangChain, OpenAI, Cohere). Parallelized the SQS
       worker, cutting the slowest messages from 3–5+ minutes to about 1 minute."
   - "Paperless document delivery for a Fortune 500 insurer"
     - Meta: "2am.tech"
     - "Leading the rebuild for 6 tenants. Reverse-engineered the legacy system and proposed a
       Node.js microservice that the architecture board approved. 15+ ADRs."
   - "Event-driven consent sync on AWS"
     - Meta: "Toptal"
     - "Lambda, SQS, DynamoDB and Serverless Framework integrations syncing users' consent choices
       to clients' email, user management and analytics tools."
4. **"Credentials"** `h2`. Two badge slots side by side:
   - Credly "Claude Certified Developer – Foundations", 150×270.
   - Toptal "Top 3% Talent".

   Under each slot is a text link: "Verify on Credly →" and "Toptal profile →". The badges are
   vendor embeds with their own light styling, even in dark theme. Draw them as placeholders.

### 2. About
- `h1` "About", then a divider.
- **Photo column:**
  - Round 192px photo.
  - "Enmanuel Veras" as `h2` (`card-title`).
  - "Senior Software Engineer" and "2am.tech" in `muted`.
  - Email, GitHub and LinkedIn icons.
  - "Résumé (PDF) →".
- **Bio column:** three paragraphs (the bio in `ux.md`, Microcopy).
- A divider, then "Credentials" as on Home, full width.

### States to show
- **Credentials, embeds still loading or blocked.** Each slot keeps its size and shows muted
  placeholder text, "Claude Certified Developer – Foundations · Anthropic" or "Toptal · Top 3%
  Talent". The text links below stay visible.
- **404.**
  - Copy: "This page doesn't exist." / "It may have moved, or the link has a typo."
  - Button: "Back to home", with background #0270a0, white text, 0.5rem radius and a visible 2px
    focus ring.

## Don't
- Add new colours, gradients, shadows, illustrations, icons or a hero image.
- Add links to the work cards.
- Show a phone number, a blog, tags, search or a newsletter.
