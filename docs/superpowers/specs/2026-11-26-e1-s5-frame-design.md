# E1-S5 design: professional header, mobile menu and footer

Approved by the human on 2026-11-26 ("approved": mobile menu option B and both side-effect
fixes). Items marked "(my call)" were not discussed. Story: `docs/product/roadmap.md` E1-S5
(FR-8, FR-10, FR-11, FR-17).

## Intent
A recruiter or hiring manager (UJ-1, UJ-2) gets a professional frame on every page: the header
and menu lead to About and the résumé, not to the blog. Keyboard and screen reader users can use
the mobile menu. The story ships straight to `main`.

## Goals / non-goals / anti-goals
- Goals: new header and menu links; search removed; the mobile menu behaves like a dialog; theme
  credit removed; `e2e/frame.spec.ts`.
- Non-goals: site titles, description and RSS links (E1-S6), `noindex` and dropping posts from the
  sitemap (E1-S7), the blog list's own search box, deleting other leftovers such as
  `LayoutWrapper.tsx` (E1-S11), colours (E1-S10), EXPERIENCE.md and DESIGN.md (E1-S12).
- Anti-goals: a new dependency; any change to how the header, menu or footer look beyond the links
  and removals; production listing the résumé PDF in the sitemap.

## Constraints
- Next.js 13 app router, React 18.2.
- `components/Link.tsx` routes `/static/resume.pdf` through the Next.js router, so the résumé
  needs a plain `<a>`, as the home hero does.
- E1-S3 runs in another worktree and owns `AuthorLayout` and `data/authors/`. Only the roadmap
  is shared.

## Approaches
Menu behaviour (the human picked B):
- A. Only the spec: hidden when closed, `Esc`, labels. `Tab` could still reach the page behind the
  open menu.
- **B. Behave like a dialog:** also move focus in, keep it in, return it on close, and close when
  the window widens.

How to build B (my call):
- **Hand-written in `MobileNav.tsx`:** a few effects and a `Tab` handler. Keeps the markup and the
  slide animation.
- Native `<dialog>` with `showModal()`: focus handling comes free, but the slide-in and slide-out
  need workarounds in Tailwind 3.3.
- Headless UI `Dialog`: the most thorough, but a new dependency for one menu.

## Design

### Links (`data/headerNavLinks.ts`)
- Home `/`, About `/about`, Résumé `/static/resume.pdf`. Blog and Tags are removed.
- The Résumé entry carries `event: 'resume'` (my call). An entry with an `event` is a file link:
  plain `<a>`, `target="_blank"`, `rel="noopener noreferrer"`, `data-umami-event={event}` and
  `data-umami-event-where` (`header` or `menu`).

### Header (`components/Header.tsx`)
- About and Résumé from `sm`, same classes as today. Home stays filtered out.
- `SearchButton` is removed. Theme switch and menu button stay.

### Mobile menu (`components/MobileNav.tsx`)
- Closed: the panel has `aria-hidden="true"` and is `invisible`, which takes it out of the tab
  order. Visibility changes only after the slide-out, so the animation still shows.
- Open: `role="dialog"`, `aria-modal="true"`, `aria-label="Menu"` (my call). Focus moves to the
  close button. `Tab` and `Shift+Tab` wrap inside the panel. `Esc` closes. Page scrolling is off.
- Closing with the button, `Esc` or any link restores scrolling and returns focus to the menu
  button. Résumé also opens the PDF in a new tab.
- Widening to 640px (`sm`) or more closes the menu and restores scrolling.
- Labels: "Open menu" and "Close menu". The menu button also gets `aria-expanded` (my call).

### Search
- Delete `components/SearchButton.tsx`. In `app/layout.tsx` remove `SearchProvider` and the
  `pliny/search/algolia.css` import. Remove `siteMetadata.search`.
- Remove `createSearchIndex` and its imports from `contentlayer.config.ts`, so `public/search.json`
  is no longer generated (my call: nothing else reads it, and the type check needs it gone).
  Update the two mentions in `AGENTS.md`.

### Footer (`components/Footer.tsx`)
- Remove the "Tailwind Nextjs Theme" line and keep the bottom spacing.
- The site name uses `siteMetadata.headerTitle` instead of `title`, which E1-S6 changes.

### Sitemap (`app/sitemap.ts`)
- Leave out header links that have an `event`. The result is `/`, `/about` and the posts.

### `e2e/frame.spec.ts`
Expected values are written in the test, not imported from `data/`.
- **FR-11:** at 1280px the header shows exactly About and Résumé; at 400px the menu shows exactly
  Home, About and Résumé. Résumé has the PDF href, `target="_blank"` and `rel` with `noopener`.
  No Blog or Tags link in header or menu, no search button, and `Cmd+K` and `Ctrl+K` open nothing.
- **FR-8:** Résumé carries `resume` with `-where="header"` and `"menu"`.
- **FR-17:** closed menu is `aria-hidden` and `Tab` never reaches its links; open menu takes focus,
  keeps it through `Tab` and `Shift+Tab`, closes on `Esc` and returns focus; a link closes it;
  widening closes it; scrolling is restored each time. Both buttons have their labels.
- **FR-10:** the footer reads "Enmanuel Veras • © {current year} • everas.dev", with no theme credit.
- The sitemap contains `/about` and no `resume.pdf`.

## Left to the builder
Tailwind classes, how the header and menu share the file-link markup, and the test file's
structure.
