# E1-S9 design: remove the newsletter, projects and starter leftovers

Approved by the human on 2026-11-26 ("go with 1": the short design, built before E1-S6 lands).
Story: `docs/product/roadmap.md` E1-S9 (FR-15, FR-16).

## Intent
The site no longer offers a newsletter or a starter-template projects page, and keeps no code or
configuration for either. The story ships straight to `main`.

## Goals / non-goals / anti-goals
- Goals: `/api/newsletter` and `/projects` return 404; the newsletter and Mastodon placeholders
  are gone from configuration; `e2e/removals.spec.ts`.
- Non-goals: the README, the unused `Mastodon` icon in `components/social-icons/` and other unused
  code (E1-S11), EXPERIENCE.md and DESIGN.md (E1-S12), `data/authors/sparrowhawk.mdx`.
- Anti-goals: any visible change to `/`, `/about`, the blog or the frame; a new dependency.

## Constraints
- E1-S9 is `after: E1-S6`, and E1-S6 is being built in another worktree. Build and verify here,
  then merge `main` once E1-S6 is in it and verify again. E1-S9 is not `done` and is not pushed
  before that.
- E1-S6 also edits `data/siteMetadata.js`, in other keys (title and description).

## Approaches
- **A. Build now, ship after E1-S6 (picked):** no waiting; risks a small merge conflict.
- B. Wait for E1-S6: no conflict risk, but nothing happens until it lands.

The change itself has one sensible way: delete, with the checks written first.

## Design
- Delete `app/api/newsletter/route.ts`, `app/projects/page.tsx` and `data/projectsData.ts`.
- `data/siteMetadata.js`: remove `newsletter` and `mastodon`.
- `components/MDXComponents.tsx`: remove `BlogNewsletterForm`. No post uses it, and it would post
  to a deleted route (added beyond the roadmap, approved).
- `.env.example`: remove the variables of every newsletter provider, not only Mailchimp: Mailchimp,
  Buttondown, ConvertKit, Klaviyo, Revue and EmailOctopus (added beyond the roadmap, approved).
- `AGENTS.md`: drop `data/projectsData.ts` from the starter-content note.

### `e2e/removals.spec.ts`
- **FR-15:** `GET` and `POST` `/api/newsletter` return 404. No `<form>` on `/`, `/about`, the two
  posts, `/blog`, `/blog/page/1`, `/tags`, a tag page or the 404 page.
- **FR-16:** `/projects` returns 404.
- **FR-15, FR-16 in source** (my call): `.env.example` names no newsletter provider variable,
  `siteMetadata` has no `newsletter` or `mastodon` key, and `data/projectsData.ts` is gone.

## Left to the builder
The test file's structure.
