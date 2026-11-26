# E1-S2 design: Credentials row with embeds, fallbacks and CSP

Status: draft, awaiting the human's approval. Story: `docs/product/roadmap.md` E1-S2 (FR-5, FR-6,
FR-7, FR-8).

## Intent
A hiring manager checking the résumé (UJ-2) sees the Claude certification and the Toptal
"Top 3% Talent" badge on `/` and `/about`, and can open either one to verify it, even when a
vendor host is blocked. The embeds must not change the rest of the site's styles or cause CSP
violations. The row goes on both pages in this story so production never shows the new home next
to the old Toptal claim for long (roadmap Decisions). It ships straight to `main`.

## Goals / non-goals
- Goals: `components/Credentials.tsx` on `/` and `/about`; a text link under each badge that is
  always visible; Umami events on the badge links; the minimum CSP change; `e2e/credentials.spec.ts`.
- Non-goals: Selected work (E1-S4), the About bio, heading and alt text fixes (E1-S3), dark-mode
  styling for the badges (OQ-2, accepted), the `primary` colour change (E1-S10).
- Anti-goals: any third-party CSS reaching `:root`, `body` or other elements; a badge that renders
  only after a full page load; widening the CSP beyond what the badges need.

## Constraints
- Next.js 13 app router. `/` and `/about` are static, and the header links navigate on the client.
- CSP in `next.config.js`: `frame-src giscus.app`, `font-src 'self'`, `style-src 'self' 'unsafe-inline'`.
- The vendor snippets (pasted by the human on 2026-11-26):
  - Credly: `<div data-iframe-width="150" data-iframe-height="270" data-share-badge-id="523d4204-…"
    data-share-badge-host="https://www.credly.com">` plus `//cdn.credly.com/assets/utilities/embed.js`.
  - Toptal: static HTML and a `<style>` block, with no script. It leaks `:root{--h}`, the global
    classes `.h .a .b .c .d .f` and `#r`, and runs `@import "https://use.typekit.net/kmj5qkr.css"`
    (Toptal's kit: 6 `@font-face` rules from `use.typekit.net`, plus a tracking `@import` of
    `p.typekit.net/p.css`).

## Findings that shaped the design
- `embed.js` (read 2026-11-26, version `20210331`, 1 KB) finds each `[data-share-badge-id]` once,
  when it loads, and replaces it through `outerHTML` with
  `<iframe name="acclaim-badge" src="https://www.credly.com/embedded_badge/<id>" style="width:150px;height:270px" title="View my verified achievement on Credly." scrolling="no" frameborder="0">`.
  It never runs again after client-side navigation, and it replaces an element that React manages.
- Adobe kits are usually locked to their owner's domains, so on everas.dev the Toptal kit's fonts
  would most likely fail and fall back to Arial. Each visit would still cost two third-party requests, one of them tracking.

## Approaches
Credly:
1. **Render the iframe directly** (chosen by the human). Same markup that `embed.js` writes, with no
   script. Only `www.credly.com` goes into the CSP (`frame-src`). It works after client-side
   navigation and renders on the server.
2. Load `embed.js` with `next/script`. This is the spec as written. It needs a way to run again on
   each navigation, it fights React over the replaced node, and it adds `cdn.credly.com` to `script-src`.

Toptal:
- **A. Port the snippet to JSX with a CSS Module** (chosen by the human). Every selector sits
  under one wrapper class, `--h` and the font stack move onto the wrapper, it renders on the server
  with no JavaScript, and "Hire me" can carry an Umami event.
- B. Shadow DOM: perfect isolation, but it needs client JavaScript, renders late, and `@font-face`
  doesn't apply inside a shadow root.
- C. `srcdoc` iframe: fully isolated, but Umami can't count clicks on "Hire me" inside it, and its size is set by hand.

Typekit: dropped. The badge uses the snippet's own fallback stack, `proxima-nova, Arial, sans-serif`. Claude
recommended this as part of "1 + A", and the human picked "1 + A". **Confirm when reviewing.**

## Design

### Data
- `data/profile.ts` already holds both credentials (`url`, `badgeId`, `linkLabel`, `event`). No
  new fields: the Credly placeholder is `${name} · ${issuer}`.

### `components/Credentials.tsx` (server component)
- Props: `where: 'home' | 'about'` (Umami `-where`), plus an optional `className`.
- A row of two slots: `flex flex-wrap gap-6` (ux: `space-x-6`, wrapping below `sm`). At 400px the
  content width is 368px and the slots need 150 + 24 + 212px, so they stack. That is expected.
- Each slot is a column: the fixed-size badge box, then a `text-link` under it.
- **Credly slot**
  - A `relative` box of exactly 150×270 with `rounded-md`.
  - Behind the frame: the placeholder text "Claude Certified Developer – Foundations · Anthropic",
    `muted`, centred.
  - On top: `<iframe src="https://www.credly.com/embedded_badge/523d4204-1cad-42fe-8a94-aa6aa6fa9966" width=150 height=270 title="View my verified achievement on Credly." loading="lazy" scrolling="no" class="absolute inset-0 border-0">`.
  - While it loads, the transparent frame lets the placeholder show through. If the frame is blocked, the browser may draw its error page over
    the placeholder, but the text link below still works (FR-6).
  - Text link: "Verify on Credly →" → `profile.credentials[0].url`, new tab, `rel="noopener noreferrer"`,
    `data-umami-event="badge-claude"`, `data-umami-event-where={where}`.
- **Toptal slot**
  - `components/ToptalBadge.tsx` plus `components/ToptalBadge.module.css`: the snippet's markup in
    JSX, and its CSS rewritten as module classes.
    - `--h` and the `font-family` go on the module's root class, not on `:root` and `#r`.
    - The CSS Module hashes the class names, so `.a`, `.b` and the rest can't collide with anything else.
    - The `@import` is removed.
  - Markup changes from the snippet, all Claude's calls:
    - "TOP 3% TALENT" becomes a `<p>`, not an `h3`, so the vendor badge stays out of the page's
      heading outline (E1-S3 checks heading levels on `/about`).
    - The star SVG gets `aria-hidden="true"`. The Toptal logo SVG gets `role="img" aria-label="Toptal"`.
    - "Hire me" keeps the vendor href, including its `#NW8430` fragment (likely Toptal's
      attribution), and adds `rel="noopener noreferrer"`, `data-umami-event="badge-toptal"`,
      `-where={where}` and `data-umami-event-via="badge"`.
  - The slot reserves the badge's size: about 212px wide, with the height measured on a build and
    fixed in the CSS, so there is no layout shift. With no font loading, there is no fallback-to-font swap.
  - Text link: "Toptal profile →" → `profile.credentials[1].url`, new tab, same `rel`,
    `data-umami-event="badge-toptal"`, `-where={where}`.
- Dark theme: the badges keep their light vendor styling (OQ-2). The text links follow the site
  colours, using the same classes as the hero links.

### Placement
- `/` (`app/Main.tsx`): after the hero, a `border` divider, then `h2` "Credentials" in `card-title`,
  then `<Credentials where="home" />`. Selected work goes between the two in E1-S4.
- `/about` (`layouts/AuthorLayout.tsx`): below the two columns, full width: a divider, `h2`
  "Credentials", then `<Credentials where="about" />`. Nothing else in the layout changes (E1-S3 owns the rest).

### CSP (`next.config.js`)
- `frame-src giscus.app https://www.credly.com`. No other directive changes: `img-src *` and
  `connect-src *` already cover anything else, and the iframe's own requests follow Credly's policy, not ours.
- OQ-6 is resolved in the browser on a production build: load `/` and `/about`, read the console
  and network panel, and write the exact hosts into the spec. If a host other than `www.credly.com`
  is needed in our CSP, add it and record it.

### Spec and roadmap updates (same commit)
- spec FR-6: the check blocks `www.credly.com` (there are no Toptal hosts left to block). FR-7: "the Credly
  badge is an `https://` iframe with no third-party script", and "the Toptal styles are scoped"
  stays.
- spec "Change boundary → Added": CSP hosts become `www.credly.com` (frame) only. OQ-6 marked resolved,
  with the date and the hosts seen.
- roadmap E1-S2: the story text matches (no `cdn.credly.com` or Typekit), and `status: doing`, then `done`
  when verify passes.

### `e2e/credentials.spec.ts`
Expected values are written in the test (copied from the spec), not imported from `data/profile.ts`.
For each of `/` and `/about`:
- **FR-5:** `h2` "Credentials" is visible. The iframe has the exact Credly `src`, and its box is 150×270. The
  Toptal badge shows "TOP 3% TALENT" and a "Hire me" link to the Toptal résumé URL.
- **FR-6:** with `page.route('**://www.credly.com/**', r => r.abort())`, "Verify on Credly →" and
  "Toptal profile →" are visible with the right hrefs, and the Credly slot keeps its 150×270 box.
  No request goes to `*.typekit.net` (a request listener).
- **FR-7:**
  - An init script records `securitypolicyviolation` events. Zero after load and a short
    wait for the frame.
  - `getComputedStyle(document.documentElement).getPropertyValue('--h')` is empty.
  - `body`'s computed `font-family` contains the Montserrat variable font. The hero `h1` keeps its
    `font-family`. The page has no element with a bare class `a`, `b`, `c`, `d`, `f` or `h`.
- **FR-8:** both text links and "Hire me" carry their `data-umami-event` and `-where` (`home` or `about`).
- No horizontal scroll at 400px, and no console errors on either page.
- The tests that load the real Credly frame need the network. The FR-6 test doesn't.

## Left to the builder
The exact Tailwind classes (match the hero and `AuthorLayout`), the Toptal badge height (measure it
on a build), the test file's structure, and how long to wait for the frame in the CSP check.
