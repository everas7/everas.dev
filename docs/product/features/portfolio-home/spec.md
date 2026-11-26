---
stage: feature-spec
feature: "portfolio-home"
ui: "yes"
status: final
updated: "2026-11-26T19:30"
based_on: "ux@2026-11-26T16:33, redesign-audit@2026-11-26T17:21"
---

# Feature: portfolio-home

This feature carries the whole fix list from the redesign audit (decision `fix-list`) as one
feature (decided by human 2026-11-26). The blog becomes a professional profile for recruiters
and hiring managers filling senior remote roles. The look stays as it is.

## Why

`/` greets blog readers ("Hi, I'm Enmanuel", a post list, a newsletter form). It doesn't state the
role, the work or how to get in touch. `/about` has wrong facts: it says "Enmanuel Veras Vargas"
and claims current Toptal freelancing (`data/authors/default.mdx:2,19`). A recruiter who follows
the link from the résumé or LinkedIn finds a blog, not a candidate.

**Evidence: none.** There is no analytics export, no recruiter feedback and no request (human,
2026-11-26). The case rests on the mismatch between the site and its new purpose, not on
observed struggle. Umami is live (`NEXT_UMAMI_ID` on Vercel), so FR-8 starts collecting the
evidence.

## Content (source of truth)

Every page, metadata field and the footer must agree with this. Given by the human on
2026-11-26; dates and the location come from `public/static/resume.pdf`.

- **Name:** Enmanuel Veras
- **Title:** Senior Software Engineer
- **Intro:** "I build full-stack products in TypeScript and LLM systems in Python. 8 years
  shipping React, Node.js and AWS; most recently, the RAG pipeline behind an AI sales assistant
  used by ~150 car dealerships."
- **Links:** Résumé (PDF, `/static/resume.pdf`), Email (enmaveras07@gmail.com), GitHub
  (github.com/everas7), LinkedIn (linkedin.com/in/everas7)
- **Employer:** 2am.tech, Senior Software Engineer, Apr 2022 – present. Toptal: May 2021 –
  Mar 2023 (past, not current)
- **Location and languages:** Santo Domingo, Dominican Republic; remote with US Eastern overlap;
  English (professional), Spanish (native)
- **Selected work** (three cards, text only, no links yet):
  1. **AI Sales Assistant for Car Dealerships** (contract, 2023–2025). Built the RAG pipeline
     (Python, FastAPI, LangChain, OpenAI, Cohere). Parallelized the SQS worker, cutting the
     slowest messages from 3–5+ minutes to about 1 minute.
  2. **Paperless document delivery for a Fortune 500 insurer** (2am.tech). Leading the rebuild
     for 6 tenants. Reverse-engineered the legacy system and proposed a Node.js microservice
     that the architecture board approved. 15+ ADRs.
  3. **Event-driven consent sync on AWS** (Toptal). Lambda, SQS, DynamoDB and Serverless
     Framework integrations syncing users' consent choices to clients' email, user management
     and analytics tools.
- **Credentials:** Claude Certified Developer – Foundations (Anthropic, Nov 2026), Credly badge
  `523d4204-1cad-42fe-8a94-aa6aa6fa9966`. Toptal "Top 3% Talent", "Hire me" →
  `https://www.toptal.com/developers/resume/enmanuel-veras-vargas`.

The phone number on the résumé is not shown on the site.

## Journeys

There is no real session to capture (human, 2026-11-26), so these describe the intended use.
[ASSUMPTION: a recruiter arrives from the résumé or a LinkedIn profile link.]

**UJ-1 Recruiter screens a candidate.** A recruiter filling a senior remote role opens
everas.dev from a LinkedIn profile.
1. Lands on `/`. Without scrolling, sees the name, title, intro and four links.
2. Reads the three Selected work cards to check the fit.
3. Selects Résumé and gets the PDF, or selects Email or LinkedIn to reach out. ★

Realized by: FR-1, FR-2, FR-3, FR-4, FR-8, FR-11

**UJ-2 Hiring manager checks the claims.** A hiring manager has the résumé and wants to verify it
before an interview.
1. Opens `/about` from the header.
2. Reads the bio: the same employer, dates, location and languages as the résumé.
3. Sees the Claude certification and Toptal badges and opens one to verify it. ★
4. Follows GitHub for code.

Realized by: FR-5, FR-6, FR-7, FR-9, FR-10

## Requirements

**Home and About**

- **FR-1** A visitor to `/` sees the name, title, intro and the four links (Content) without
  scrolling. Check: 400×800 and 1280×800, in light and dark themes.
- **FR-2** A visitor can open the résumé from `/`. Check: the link targets `/static/resume.pdf`,
  which returns 200 with `application/pdf`.
- **FR-3** A visitor can reach Email, GitHub and LinkedIn from `/`. Check: the `href`s are
  `mailto:enmaveras07@gmail.com`, `https://github.com/everas7` and
  `https://www.linkedin.com/in/everas7/`.
- **FR-4** A visitor to `/` sees a "Selected work" section with three text cards matching Content
  word for word, with no links. A Projects section exists in the source, commented out, and does
  not render.
- **FR-9** A visitor to `/about` reads a bio that agrees with Content: 2am.tech since Apr 2022, no
  current Toptal freelancing, Santo Domingo and remote with US Eastern overlap, English and
  Spanish. The author name is "Enmanuel Veras". Check: text comparison; one `h1` and no skipped
  heading levels; the photo's alt text names the person.
- **FR-10** Search engines and link previews show the same facts. Check: the default
  `description` is built from the intro; the `<title>` and Open Graph title of `/` are
  "Enmanuel Veras – Senior Software Engineer"; other pages use the template "%s | Enmanuel
  Veras" (for example "About | Enmanuel Veras"); the header logo text stays "everas.dev"; the
  footer shows "Enmanuel Veras" and the current year, with no "Tailwind
  Nextjs Theme" credit.

**Credentials**

- **FR-5** A visitor sees a credentials row on `/` and `/about` with the Credly embed for the
  Claude badge and the Toptal "Top 3% Talent" embed. Check: both render on a production build.
- **FR-6** If a badge script fails or is blocked, the visitor still gets a plain text link to
  that badge. Check: block `www.credly.com`; the text links stay visible and the Credly slot
  keeps its size. The Toptal badge is first-party HTML with no external requests.
- **FR-7** The embeds don't change the rest of the page or break the security policy. Check: no
  CSP violations in the console on `/` and `/about`; the Credly badge is an `https://` iframe
  with no third-party script on the page; the Toptal CSS is scoped, so `body` font, `:root` variables and other elements' computed
  styles are the same with and without the badge.

**Measurement**

- **FR-8** The site owner can count clicks. Check: the Résumé, Email, GitHub, LinkedIn and both
  badge links carry `data-umami-event`, and a click shows up in Umami.

**Frame, hidden blog, removals**

- **FR-11** The header and mobile menu link only to professional pages. Check: the header shows
  About and Résumé, and the mobile menu shows Home, About and Résumé; Résumé opens
  `/static/resume.pdf` and carries its own `data-umami-event`; no Blog or Tags links, and no
  search button or `Cmd/Ctrl+K`.
- **FR-12** A reader with a post URL still gets the post, but search engines skip the blog. Check:
  `/blog/help-apollo-is-changing-my-query-response` and `/blog/taking-ownership` return 200;
  post, `/blog`, `/blog/page/*`, `/tags` and `/tags/*` pages carry `robots: noindex`; no page
  links to them from the header, footer or home; there are no RSS `alternate` links in the
  `<head>`.
- **FR-13** A visitor with a bad post or tag URL gets a real 404. Check: an unknown slug and an
  unknown tag return status 404, not 200.
- **FR-14** The sitemap lists only `/` and `/about`.
- **FR-15** The newsletter is gone. Check: no form on any page; `/api/newsletter` returns 404;
  `newsletter` and `mastodon` are removed from `data/siteMetadata.js`; the Mailchimp variables
  are removed from `.env.example`.
- **FR-16** `/projects` returns 404, and the starter `data/projectsData.ts` is removed.
- **FR-17** The changed screens meet basic accessibility. Check: `primary` link and chip text is
  at least 4.5:1 on white; when the mobile menu is closed, it is out of the tab order and `Esc`
  closes it when open; the 404 button uses palette colors and keeps a visible focus ring.

## Change boundary

**Stays as is**
- The two posts: content, layout (`PostSimple`) and URLs.
- The frame: centred column, header, footer, light/dark following the system, Montserrat, the
  cyan accent family (DESIGN.md).
- Umami loading (`siteMetadata.analytics`), RSS file generation (`scripts/rss.mjs`), `robots.txt`.

**Changes**
- `/`: from post list and newsletter to profile, Selected work and credentials (FR-1–FR-5).
- `/about`: bio, name, heading levels, alt text (FR-9).
- Header, mobile menu and footer links (FR-10, FR-11, FR-17).
- Site metadata, sitemap and `robots` on blog pages (FR-10, FR-12, FR-14).
- The `primary` shade used for text, which changes link color site-wide (FR-17).
- Unknown slug and tag: from 200 to 404 (FR-13).

**Added**
- Credentials row with the two embeds and text fallbacks; scoped Toptal styles (FR-5–FR-7).
- CSP host in `next.config.js`: `https://www.credly.com` (`frame-src`) only. The Credly badge is
  rendered as the iframe `embed.js` would write, and the Toptal badge drops Typekit (E1-S2
  design, 2026-11-26).
- `data-umami-event` attributes (FR-8).

**Removed**
- Search dialog, newsletter form and `/api/newsletter`, `/projects`, the starter projects data,
  the theme credit, RSS `alternate` links.

**Must not change**
- The URLs of the two posts, and `/static/resume.pdf`.
- The email, GitHub and LinkedIn addresses.
- The Umami website ID wiring.

## Non-goals

- New visual identity, new tokens or new components beyond the credentials row. The only token
  change is the `primary` contrast fix.
- Case-study pages, project links or a live Projects section.
- Deleting, rewriting or adding blog posts.
- Dark-mode styling for the vendor badges (accepted in the audit, OQ-2).
- A contact form, or showing the phone number.
- A new logo. The human wants it improved (2026-11-26). That is a visual-identity change, so it
  goes in its own feature or redesign pass. This feature keeps `siteLogo` and the "everas.dev"
  header text.

## Success

Clicks on Résumé, Email and LinkedIn per visit to `/` in Umami (G-2). There is no baseline, so
the first month sets one. Counter-metric: the two post URLs keep returning 200, and there are no
CSP errors on `/` and `/about`.

## Open questions

- ~~**OQ-4** Card 3 is cut off after "syncing users' consent".~~ Resolved 2026-11-26: ends
  "…syncing users' consent choices to clients' email, user management and analytics tools."
  (a shorter version of the résumé's wording).
- ~~**OQ-5** Once Blog and Tags are removed, what does the header show?~~ Resolved
  2026-11-26: About and Résumé (mobile menu: Home, About, Résumé).
- ~~**OQ-6** The exact third-party hosts each embed calls.~~ Resolved 2026-11-26 on a production
  build: the page itself loads only the `www.credly.com` frame (plus the existing Umami hosts).
  Inside the frame, Credly loads `cdn.credly.com`, `images.credly.com` and `stats.credly.com`
  under its own policy. No CSP violations or console errors on `/` and `/about`.
