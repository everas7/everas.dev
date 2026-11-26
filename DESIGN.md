---
# Captured from code at commit 7bfa77c. The comment on each token is the file it came from.
# "tw default" = Tailwind CSS 3.3.3 default theme, used at the file shown.
name: "everas.dev"
description: "Personal blog: text-first, system light/dark, one cyan accent on Tailwind grays."
colors:
  # brand and action
  primary: '#0db1ea' # tailwind.config.js:37 (primary-500)
  primary-hover: '#018ec8' # tailwind.config.js:38 (600); app/Main.tsx:59, light theme
  primary-hover-dark: '#37c7f9' # tailwind.config.js:36 (400); app/Main.tsx:59, dark theme
  primary-pressed: '#0270a0' # tailwind.config.js:39 (700); pliny/ui/NewsletterForm.js:77, light hover
  selection: '#018ec8' # tailwind.config.js:38; pliny/chunk-R2UQHQLC.js:48, active search result
  link-code: '#37c7f9' # tailwind.config.js:54, code inside a prose link
  logo: '#06b6d4' # data/logo.svg:33,37,54
  # surfaces
  surface: '#ffffff' # app/layout.tsx:75
  surface-dark: '#030712' # app/layout.tsx:75 (gray-950)
  surface-subtle: '#f9fafb' # layouts/ListLayoutWithTags.tsx:87 (gray-50)
  surface-subtle-dark: '#111827b3' # layouts/ListLayoutWithTags.tsx:87 (gray-900 at 70%)
  # text
  on-surface: '#000000' # app/layout.tsx:75
  on-surface-dark: '#ffffff' # app/layout.tsx:75
  heading: '#111827' # app/Main.tsx:14 (gray-900)
  heading-dark: '#f3f4f6' # app/Main.tsx:14, tailwind.config.js:78 (gray-100)
  muted: '#6b7280' # app/Main.tsx:17 (gray-500)
  muted-dark: '#9ca3af' # app/Main.tsx:17 (gray-400)
  prose-body: '#374151' # @tailwindcss/typography default; layouts/PostSimple.tsx:44
  prose-body-dark: '#d1d5db' # @tailwindcss/typography invert default; layouts/PostSimple.tsx:44
  on-primary: '#ffffff' # pliny/ui/NewsletterForm.js:77
  # lines and neutral controls
  border: '#e5e7eb' # app/Main.tsx:12 (gray-200)
  border-dark: '#374151' # app/Main.tsx:12 (gray-700)
  control: '#e5e7eb' # components/ScrollTopAndComment.tsx:33
  control-hover: '#d1d5db' # components/ScrollTopAndComment.tsx:33
  control-dark: '#374151' # components/ScrollTopAndComment.tsx:33
  control-hover-dark: '#4b5563' # components/ScrollTopAndComment.tsx:33
  # one-off action color
  not-found-action: '#2563eb' # app/not-found.tsx:18 (blue-600)
  not-found-action-hover: '#1d4ed8' # app/not-found.tsx:18 (blue-700, light)
  # feedback
  error: '#ef4444' # pliny/ui/NewsletterForm.js:84 (red-500)
  error-dark: '#f87171' # pliny/ui/NewsletterForm.js:84 (red-400)
  success: '#4ade80' # pliny/ui/Pre.js:29, "copied" border (green-400)
  # code
  inline-code: '#6366f1' # tailwind.config.js:64 (indigo-500)
  code-bg: '#1f2937' # @tailwindcss/typography default pre background; layouts/PostSimple.tsx:44
  code-bg-dark: '#00000080' # @tailwindcss/typography invert pre background; layouts/PostSimple.tsx:44
  code-text: '#e5e7eb' # @tailwindcss/typography default pre text; layouts/PostSimple.tsx:44
  code-text-dark: '#d1d5db' # @tailwindcss/typography invert pre text; layouts/PostSimple.tsx:44
  code-title-bg: '#374151' # css/prism.css:10 (dark theme: #1f2937)
  code-inserted: '#22c55e33' # css/prism.css:27
  code-deleted: '#ef444433' # css/prism.css:31
  syntax-comment: '#637777' # css/prism.css:54
  syntax-punctuation: '#c792ea' # css/prism.css:59
  syntax-namespace: '#b2ccd6' # css/prism.css:63
  syntax-property: '#80cbc4' # css/prism.css:73
  syntax-keyword: '#7fdbca' # css/prism.css:79
  syntax-boolean: '#ff5874' # css/prism.css:83
  syntax-number: '#f78c6c' # css/prism.css:87
  syntax-function: '#82aaff' # css/prism.css:94
  syntax-string: '#addb67' # css/prism.css:114
  syntax-class: '#ffcb8b' # css/prism.css:120
  syntax-variable: '#d6deeb' # css/prism.css:126
typography:
  display: # app/Main.tsx:14 (md and up)
    { fontFamily: 'Montserrat', fontSize: '3.75rem', fontWeight: 700, lineHeight: '3.5rem', letterSpacing: '-0.025em' }
  display-sm: # app/Main.tsx:14 (sm)
    { fontFamily: 'Montserrat', fontSize: '2.25rem', fontWeight: 700, lineHeight: '2.5rem', letterSpacing: '-0.025em' }
  display-xs: # app/Main.tsx:14 (base)
    { fontFamily: 'Montserrat', fontSize: '1.875rem', fontWeight: 700, lineHeight: '2.25rem', letterSpacing: '-0.025em' }
  post-title: # components/PageTitle.tsx:9 (md and up; smaller sizes match display-sm and display-xs)
    { fontFamily: 'Montserrat', fontSize: '3rem', fontWeight: 700, lineHeight: '3.5rem', letterSpacing: '-0.025em' }
  card-title: # app/Main.tsx:38, components/Card.tsx:32
    { fontFamily: 'Montserrat', fontSize: '1.5rem', fontWeight: 700, lineHeight: '2rem', letterSpacing: '-0.025em' }
  site-title: # components/Header.tsx:19
    { fontFamily: 'Montserrat', fontSize: '1.5rem', fontWeight: 600 }
  menu-link: # components/MobileNav.tsx:64
    { fontFamily: 'Montserrat', fontSize: '1.5rem', fontWeight: 700, lineHeight: '2rem', letterSpacing: '0.1em' }
  lead: # app/Main.tsx:17
    { fontFamily: 'Montserrat', fontSize: '1.125rem', fontWeight: 400, lineHeight: '1.75rem' }
  form-title: # pliny/ui/NewsletterForm.js:55
    { fontFamily: 'Montserrat', fontSize: '1.125rem', fontWeight: 600, lineHeight: '1.75rem' }
  body: # @tailwindcss/typography default; layouts/PostSimple.tsx:44
    { fontFamily: 'Montserrat', fontSize: '1rem', fontWeight: 400, lineHeight: '1.75' }
  meta: # app/Main.tsx:31 (dates, "Read more")
    { fontFamily: 'Montserrat', fontSize: '1rem', fontWeight: 500, lineHeight: '1.5rem' }
  nav: # components/Header.tsx:28,35
    { fontFamily: 'Montserrat', fontSize: '1rem', fontWeight: 500, lineHeight: '1.25rem' }
  tag: # components/Tag.tsx:11 (uppercase)
    { fontFamily: 'Montserrat', fontSize: '0.875rem', fontWeight: 500, lineHeight: '1.25rem' }
  small: # components/Footer.tsx:17
    { fontFamily: 'Montserrat', fontSize: '0.875rem', fontWeight: 400, lineHeight: '1.25rem' }
  eyebrow: # layouts/PostLayout.tsx:116 (uppercase)
    { fontFamily: 'Montserrat', fontSize: '0.75rem', fontWeight: 400, lineHeight: '1rem', letterSpacing: '0.025em' }
  code: # @tailwindcss/typography default; tw default mono stack
    { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace', fontSize: '0.875em', fontWeight: 400, lineHeight: '1.714' }
rounded:
  sm: '0.25rem' # css/prism.css:10, layouts/ListLayoutWithTags.tsx:87
  md: '0.375rem' # components/Card.tsx:9; code blocks
  lg: '0.5rem' # app/not-found.tsx:18
  2xl: '1rem' # pliny/chunk-R2UQHQLC.js (search dialog)
  full: '9999px' # components/ScrollTopAndComment.tsx:33, layouts/AuthorLayout.tsx:30
spacing: # tw default scale; steps found in app/, components/, layouts/
  '1': '0.25rem' # layouts/PostSimple.tsx:28
  '2': '0.5rem' # app/Main.tsx:13
  '3': '0.75rem' # components/Header.tsx:15
  '4': '1rem' # components/SectionContainer.tsx:9
  '5': '1.25rem' # layouts/ListLayoutWithTags.tsx:127
  '6': '1.5rem' # components/SectionContainer.tsx:9
  '8': '2rem' # app/Main.tsx:13
  '10': '2.5rem' # components/Header.tsx:11
  '12': '3rem' # app/Main.tsx:26
  '16': '4rem' # components/Footer.tsx:8
  '24': '6rem' # layouts/ListLayoutWithTags.tsx:86
  gutter: '1rem' # components/SectionContainer.tsx:9
  gutter-sm: '1.5rem' # components/SectionContainer.tsx:9
  container: '48rem' # components/SectionContainer.tsx:9 (max-w-3xl)
  container-xl: '64rem' # components/SectionContainer.tsx:9 (max-w-5xl)
components:
  text-link: { color: '{colors.primary}', typography: '{typography.meta}' } # app/Main.tsx:59
  tag: { color: '{colors.primary}', typography: '{typography.tag}' } # components/Tag.tsx:11
  nav-link: { color: '{colors.heading}', typography: '{typography.nav}' } # components/Header.tsx:35
  button-newsletter: { background: '{colors.primary}', color: '{colors.on-primary}', rounded: '{rounded.md}' } # pliny/ui/NewsletterForm.js:77
  button-not-found: { background: '{colors.not-found-action}', color: '#ffffff', rounded: '{rounded.lg}' } # app/not-found.tsx:18
  button-floating: { background: '{colors.control}', color: '{colors.muted}', rounded: '{rounded.full}' } # components/ScrollTopAndComment.tsx:33
  card: { border: '2px solid {colors.border}', rounded: '{rounded.md}', padding: '{spacing.6}' } # components/Card.tsx:9,31
  tag-sidebar: { background: '{colors.surface-subtle}', rounded: '{rounded.sm}', width: '280px' } # layouts/ListLayoutWithTags.tsx:87
  avatar: { rounded: '{rounded.full}', size: '12rem' } # layouts/AuthorLayout.tsx:30
  code-block: { background: '{colors.code-bg}', color: '{colors.code-text}', rounded: '{rounded.md}' } # @tailwindcss/typography; layouts/PostSimple.tsx:44
---

# everas.dev design

Describes the site as built at commit `7bfa77c`. Inconsistencies are listed in
[capture-notes](docs/product/ux/capture-notes.md), not fixed here.

## Brand & Style

A text-first personal blog. The look is the `tailwind-nextjs-starter-blog` theme with its own
cyan ramp, logo and font: large bold headings, grey secondary text, thin dividers, and one
accent color for links and tags. There is no separate design system or component library.
Light and dark themes follow the system setting by default (`data/siteMetadata.js:8`) and
switch through a `dark` class (`tailwind.config.js:15`).

## Colors

- `{colors.primary}` marks what can be clicked: text links, tags, "Read more", the newsletter
  button, the highlighted sidebar item. Hover goes darker in light theme and lighter in dark.
- The full ramp `primary-50` to `primary-950` is defined (`tailwind.config.js:31-43`). Steps
  400, 500, 600 and 700 are the ones found in use.
- Grays are Tailwind `gray` (`tailwind.config.js:44`): `{colors.heading}` for titles,
  `{colors.muted}` for dates and summaries, `{colors.border}` for dividers.
- `{colors.logo}` appears only in the logo.
- `{colors.not-found-action}` appears only on the 404 button.
- `{colors.inline-code}` colors inline code in prose.
- `syntax-*` colors are the Night Owl token theme and apply in both themes, on a dark block.

Contrast ratios (computed from the hex values):

| Pair | Ratio |
| --- | --- |
| `muted` on `surface` | 4.83 |
| `muted-dark` on `surface-dark` | 7.93 |
| `primary` on `surface-dark` | 8.14 |
| `primary` on `surface` | 2.47 |
| `on-primary` on `primary` | 2.47 |

The pairs found under 4.5 are listed in capture-notes.

## Typography

One family, Montserrat (Latin subset, loaded with `next/font`, `app/layout.tsx:14-17`), with
the Tailwind sans stack as fallback. Code uses the default monospace stack.

- Page headings use `display-xs` → `display-sm` → `display`. Post titles use `PageTitle`, which
  stops one step lower at `post-title`.
- `font-extrabold` is redefined as 700 (`tailwind.config.js:19`), so it equals bold.
- Prose `h1` and `h2` are 700 with tight tracking, `h3` is 600 (`tailwind.config.js:56-62`).
- Tags, sidebar items and eyebrows are uppercase.

## Layout & Spacing

- One centred column: `{spacing.container}` wide, `{spacing.container-xl}` from `xl`. Side
  padding is `{spacing.gutter}`, `{spacing.gutter-sm}` from `sm`, none from `xl`
  (`components/SectionContainer.tsx:9`). Post layouts nest a second container.
- Page frame: full-height flex column with header, `main` and footer (`app/layout.tsx:79-85`).
- Breakpoints are Tailwind defaults: `sm` 640, `md` 768, `lg` 1024, `xl` 1280 px.
- Home rows and About use a grid from `xl` (4 and 3 columns). The tag sidebar shows from `sm`.
- Lists are separated by 1px dividers.

## Elevation & Depth

Mostly flat. Shadows: `shadow-md` on the tag sidebar (`layouts/ListLayoutWithTags.tsx:87`),
`shadow` on the 404 button, `shadow-sm` around the newsletter button. Layers: the mobile menu
(`z-10`, 95–98% opaque) and the search dialog over a blurred, tinted backdrop.

## Shapes

Small radii on boxes (`sm` to `lg`), `2xl` on the search dialog only, `full` for avatars and
floating round buttons.

## Components

- **Header** (`components/Header.tsx`): logo, site title (hidden below `sm`), text links (from
  `sm`), search, theme and menu icon buttons. Icons are 24px; the menu icon is 32px.
- **Footer** (`components/Footer.tsx`): centred 24px social icons, author • year • site name,
  theme credit.
- **Social icon** (`components/social-icons/index.tsx`): gray-700 (dark gray-200), primary on
  hover.
- **Text link**: `{components.text-link}`; arrows `→` and `←` show direction.
- **Tag** (`components/Tag.tsx`): uppercase primary text, spaces shown as hyphens, no chip
  background.
- **Post row**: date, title, tags, summary. Three variants (home, tag list, unused list).
- **Tag sidebar**: `{components.tag-sidebar}`; current item in primary bold, others muted.
- **Pagination** (`layouts/ListLayoutWithTags.tsx:25-63`): Previous, "N of M", Next; the
  unavailable side is a disabled button at 50% opacity.
- **Card** (`components/Card.tsx`): bordered box with 16:9 image, title, description, "Learn
  more". Two per row from `md`.
- **Mobile menu** (`components/MobileNav.tsx`): full-screen panel sliding from the right in
  300ms, large links.
- **Search dialog** (Pliny KBar): field with `ESC` hint, results grouped under "Content" with
  date and title; active row on `{colors.selection}`.
- **Newsletter form** (Pliny): title, email field (18rem wide), "Sign up"; stacks below `sm`.
- **Code block**: `{components.code-block}`; optional filename bar; copy button on hover.
- **Floating buttons** (`components/ScrollTopAndComment.tsx`): bottom right, from `md`, after
  50px of scroll.
- **Not-found button**: `{components.button-not-found}`.

## Do's and Don'ts

These are the conventions the code follows today. No rules have been written down beyond them.

- Use `primary` for interactive text; plain headings stay `heading`.
- Give every color a light and a `dark:` value.
- Wrap page content in the single centred container.
- Use Montserrat for all non-code text.
