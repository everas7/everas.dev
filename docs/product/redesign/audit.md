---
stage: redesign-audit
status: final
decision: fix-list
updated: "2026-11-26T17:21"
based_on: "ux@2026-11-26T16:33"
---

# Redesign audit: everas.dev

## Thresholds

Written before the evidence was weighed.

- **Full redesign (`go`)** if any of these holds:
  - The new purpose needs flows or screen structure the current layouts can't hold. For example, a
    multi-page portfolio with case-study pages, or interactive content.
  - The human wants a new visual identity: new type, color or layout system.
  - Usage data shows recruiters arriving and failing to reach the contact links or résumé. This
    needs an Umami export.
- **Fix list (`fix-list`)** if the new purpose fits the current visual system and frame (header,
  centred column, footer), and the work is content, navigation and metadata changes on a named set
  of screens.
- **Leave it (`no`)** if the current home and About already show the role, the selected work and
  the contact routes a recruiter needs within one screen.
- **Deadline:** none given. [ASSUMPTION: no hard date; ship when the epic's checks pass.]

## Goals

The audience is recruiters and hiring managers filling senior remote roles (human, 2026-11-26).

| Goal | Measured by |
| --- | --- |
| G-1 Within the first screen of `/`, a visitor sees name, title, positioning and how to make contact | Manual check at 400px and desktop width, light and dark |
| G-2 Visitors reach the résumé and contact links | Umami events on Résumé, Email, GitHub, LinkedIn and badge links (`NEXT_UMAMI_ID` is set on Vercel) |
| G-3 Every page says the same facts (name, role, employer, dates, location) | Text check of home, About, metadata and footer against the facts list in the request |
| G-4 Old post URLs keep working, and search engines index the professional pages, not the blog | `curl` status 200 on both post URLs; blog pages carry `noindex`; sitemap lists only `/` and `/about` |
| G-5 The pages that change pass basic accessibility | No text pair below 4.5:1 on changed screens; one visible `h1` per page |

## Screen inventory

| Screen (EXPERIENCE.md) | Problems seen | Evidence | Severity |
| --- | --- | --- | --- |
| `/` | Shows a blog greeting, the post list and the newsletter form. No role, work or contact routes. Doesn't serve G-1 | `app/Main.tsx:15`, `data/siteMetadata.js:6`, EXPERIENCE "Screens" | High (wrong purpose) |
| `/about` | Name "Enmanuel Veras Vargas"; says you freelance at Toptal (now false); outdated stack; `h1`→`h3` jump; alt text "avatar" | `data/authors/default.mdx:2,19`; capture-notes "Accessibility gaps" (`layouts/AuthorLayout.tsx:33,27`) | High (wrong facts) |
| `/blog`, `/blog/page/[page]` | Linked from the header. The out-of-range page returns 200 | `data/headerNavLinks.ts`; capture-notes "Missing states" | Medium (must be hidden) |
| `/blog/[...slug]` | Must keep working. An unknown slug returns 200 "Under Construction" | capture-notes (`app/blog/[...slug]/page.tsx:87`) | Medium |
| `/tags`, `/tags/[tag]` | Linked from the header. An unknown tag returns 200 | capture-notes (`app/tags/[tag]/page.tsx:33`) | Medium (must be hidden) |
| `/projects` | Starter-template content, reachable by URL; links to a missing post | capture-notes "Other observations" (`data/projectsData.ts:16`) | Medium (a recruiter could land on it) |
| 404 | Off-palette `blue-600` button; the focus outline is removed | capture-notes "Design drift", "Accessibility gaps" (`app/not-found.tsx:18`) | Low |
| Search dialog | Searches posts only. Pointless once the blog is hidden | EXPERIENCE "Overlays" | Medium (remove) |
| Mobile menu | Lists Blog and Tags. Stays in the tab order when closed; `Esc` doesn't close it | `data/headerNavLinks.ts`; capture-notes (`components/MobileNav.tsx:39`) | Medium |
| Header / footer (frame) | Blog and Tags links; footer has the "Tailwind Nextjs Theme" credit | `components/Header.tsx:28`, `components/Footer.tsx:25` | Medium |
| `/api/newsletter`, newsletter form | Being removed. `GET` returned 500 locally | capture-notes (`app/api/newsletter/route.ts:9`) | Remove |
| Feeds, sitemap, robots | The sitemap lists blog routes; RSS is advertised in metadata | EXPERIENCE "Non-screen endpoints" | Medium (G-4) |

## What works

- The frame: centred column, header, footer, and light/dark following the system. A text-first
  layout suits a one-page professional profile.
- Montserrat with one cyan accent. You said to keep the current look (2026-11-26).
- The two existing posts and their URLs, which must keep resolving.
- Footer social icons, which render only when a URL is set.

## Evidence summary

- **User data:** none. No analytics export or recruiter feedback was provided, so no threshold is
  met on usage evidence. Every "problem" above is a mismatch between the site and its new purpose
  (`/` doesn't state role or contacts; `/about` has the wrong facts), not observed user struggle.
- **New structure needed?** No. Home becomes a profile section plus three text cards and a chip
  row. Those fit the current column, and `components/Card.tsx` already exists. No new flows: F-5
  ("learn about the author and get in touch") becomes the main flow, and F-1 to F-4 and F-6 are
  hidden or removed.
- **New visual identity wanted?** No. You chose to keep the look.
- **Drift and gaps on screens that change** (from capture-notes): `primary` links at 2.47:1 on
  white (`components/Tag.tsx:11`, `app/Main.tsx:59`). The home links and chips will use `primary`,
  so this lands on the most important screen in light theme. Also the About heading jump and alt
  text, the mobile-menu focus problems, and the 404 button. These fit inside the fix list.
- **Result:** the fix-list threshold is met. No `go` threshold is met.

## Options

| Option | What | Cost | Risk |
| --- | --- | --- | --- |
| Leave it | No change | None | `/` and `/about` keep misrepresenting you to recruiters. Fails G-1 and G-3 |
| **Targeted fix list** | Content, navigation, metadata and accessibility changes on `/`, `/about`, the frame, blog/tag routes, `/projects`, 404 and endpoints. Existing tokens. One epic | Small: about 5–7 S/M stories | Low. A fix to `primary` contrast changes link color site-wide, which is acceptable |
| Visual refresh | New tokens and components, same structure | Medium | Taste-driven with no evidence; you declined it |
| Full redesign | New structure and flows, `DESIGN.next.md`, switch | Large | Process with no payoff on a 2-post site |

## Decision

**`fix-list`.** The new purpose fits the current frame and visual system, you want to keep the
look, and there's no usage evidence of struggle. That meets the fix-list threshold and no `go`
threshold. Evidence that would reopen this: a request for new visual identity, or case-study pages.

The fix list becomes one roadmap epic, not a redesign. No `DESIGN.next.md` and no switch.
Grouped by your numbered items:

1. **Hide the blog (item 2).**
   - Remove Blog and Tags from the header and mobile menu, and the post list from home.
   - Post, blog and tag pages keep returning 200 for real content, with `robots: noindex`.
   - Remove search, the RSS `alternate` links and blog routes from the sitemap.
   - Unknown slugs and tags return a real 404.
2. **Remove the newsletter (item 3):** the form, `/api/newsletter`, the `newsletter` config, the
   Mailchimp variables in `.env.example`, and the Mastodon placeholder in `siteMetadata`.
3. **Home (item 4):**
   - Name, title, intro, links and three "Selected work" cards as given, text only.
   - A commented-out Projects section.
   - The Résumé link points to `/static/resume.pdf`.
4. **About (item 4):**
   - Rewrite the bio with the given facts: 2am.tech since Apr 2022; no Toptal freelancing claim;
     Santo Domingo, remote with US Eastern overlap; English and Spanish.
   - Use "Enmanuel Veras" everywhere.
   - Fix the heading levels and alt text.
5. **Credentials (item 6).** A row on home and About with the vendor embeds (OQ-2, decided by
   human 2026-11-26):
   - Claude: the Credly embed for badge `523d4204-1cad-42fe-8a94-aa6aa6fa9966`, with the script
     loaded over `https://` (the pasted snippet uses a protocol-relative `//` URL).
   - Toptal: the "Top 3% Talent" snippet as a component with its CSS scoped so `:root` and the
     one-letter classes can't leak. "Hire me" links to
     `https://www.toptal.com/developers/resume/enmanuel-veras-vargas`.
   - Fallback: a plain text link per badge for when a script fails or is blocked.
   - CSP in `next.config.js`: `cdn.credly.com` in `script-src`; `www.credly.com` in `frame-src`;
     `use.typekit.net` in `style-src` and `font-src`. [ASSUMPTION: exact hosts confirmed against
     the browser console on a build; Typekit may also call `p.typekit.net`.]
6. **Metadata (item 8):**
   - A description built from the intro.
   - Open Graph title "Enmanuel Veras – Senior Software Engineer".
   - Footer year computed at build time; remove the theme credit.
7. **Accessibility on changed screens:**
   - Bring `primary` text to 4.5:1 on white.
   - Fix mobile-menu focus and `Esc`.
   - Fix the 404 button color and focus.
8. **Remove `/projects`** (404 until the two apps exist) and the starter data. Confirmed by human
   2026-11-26.

### Open questions

- ~~**OQ-1 Résumé PDF.**~~ Resolved 2026-11-26: added at `public/static/resume.pdf`, served as
  `/static/resume.pdf`.
- ~~**OQ-2 Badge embeds.**~~ Resolved 2026-11-26: embed both vendor snippets. This replaces the
  original "local images, plain text chips until then, don't hotlink third-party images"
  requirement. The human accepted the trade-offs: third-party requests on every visit, CSP
  changes, the badges ignoring dark mode, and a larger footprint than a chip. All Toptal links use
  `https://www.toptal.com/developers/resume/enmanuel-veras-vargas`.
- ~~**OQ-3 Umami.**~~ Resolved 2026-11-26: `NEXT_UMAMI_ID` is set on Vercel. G-2 stays. Add
  Umami event attributes (`data-umami-event`) to the Résumé, Email, GitHub, LinkedIn and badge
  links so clicks are counted.
