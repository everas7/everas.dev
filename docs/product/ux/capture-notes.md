---
stage: capture-notes
updated: "2026-11-26T16:33"
---

# Capture notes: everas.dev

Recorded at commit `7bfa77c`. **[run]** means observed on a local production build in Chrome
(desktop width, dark theme, `America/Santo_Domingo` time zone) or by HTTP request. Everything
else is read from code. Paths starting `pliny/` are in `node_modules/pliny` 0.1.2.

## Design drift

- `app/Main.tsx:14` vs `components/PageTitle.tsx:9`: page headings reach 3.75rem, post titles 3rem.
- `app/not-found.tsx:7`: the 404 heading uses its own sizes (3.75rem to 6rem).
- `app/projects/page.tsx:12`, `app/tags/page.tsx:17`, `layouts/AuthorLayout.tsx:18`, `layouts/ListLayoutWithTags.tsx:82`: the long heading class string from `app/Main.tsx:14` is repeated, not shared.
- `app/not-found.tsx:18`: button is `blue-600`, while other actions use `primary`.
- `components/Comments.tsx:11`: "Load Comments" button has no styling.
- `data/logo.svg:33`: logo cyan `#06b6d4` differs from `primary` `#0db1ea` (`tailwind.config.js:37`).
- `app/layout.tsx:70`: a third cyan, `#5bbad5`, on the Safari mask icon.
- `app/layout.tsx:73`: dark browser theme color is `#000`, page background is `gray-950` (`app/layout.tsx:75`).
- `pliny/ui/NewsletterForm.js:63`: dark field and focus offset are black on a `gray-950` page.
- `tailwind.config.js:64`: inline code is indigo; code inside links is `primary-400` (`tailwind.config.js:54`).
- `tailwind.config.js:19`: `font-extrabold` is 700, the same as `font-bold`.
- `layouts/PostLayout.tsx:17`: post date includes the weekday; `layouts/PostSimple.tsx:33` and lists do not.
- `app/Main.tsx:26`: home rows (grid, `py-12`, `h2`, "Read more") differ from `layouts/ListLayoutWithTags.tsx:127` (stacked, `py-5`, no "Read more") and `layouts/ListLayout.tsx:118` (`py-4`, `h3`).
- `layouts/ListLayoutWithTags.tsx:108`: sidebar tags are gray uppercase; `components/Tag.tsx:11` tags are primary; `app/tags/page.tsx:29` adds a third style for counts.
- `components/SearchButton.tsx:19` and `layouts/ListLayout.tsx:97`: two different search icons.
- `layouts/PostSimple.tsx:23`, `layouts/PostLayout.tsx:37`, `layouts/PostBanner.tsx:26`: a second `SectionContainer` inside the one at `app/layout.tsx:78`, which doubles side padding below `xl` (from code; not measured).

## Hard-coded values

- `app/Main.tsx:15`: home greeting is literal text.
- `app/Main.tsx:7`: home post limit `5`.
- `app/blog/page.tsx:6`, `app/blog/page/[page]/page.tsx:5`: page size `5` defined twice.
- `app/projects/page.tsx:16`: starter text "Showcase your projects with a hero image (16 x 9)".
- `app/tags/page.tsx:7`: tags description is literal.
- `app/layout.tsx:32`, `app/seo.tsx:21`, `app/blog/[...slug]/page.tsx:59`: locale `en_US` repeated outside `siteMetadata`.
- `app/layout.tsx:70`: icon, tile and theme colors are literals through line 73.
- `app/head.tsx:8`: the same color literals again.
- `data/logo.svg:33`: logo fill is literal, with no theme variant.
- `css/prism.css:54`: syntax colors are `rgb()` literals through line 126.
- `layouts/ListLayoutWithTags.tsx:87`: sidebar width `280px`.
- `layouts/PostBanner.tsx:23`: fallback banner is a `picsum.photos` URL.
- `layouts/PostLayout.tsx:15`: Twitter search URL is literal.
- `components/Footer.tsx:25`: theme credit text and URL.

## Missing states

- `app/layout.tsx:82`: no `loading.tsx` or `error.tsx` exists for any route under this frame.
- `layouts/ListLayoutWithTags.tsx:123`: no empty state on the blog or tag lists.
- `app/tags/[tag]/page.tsx:33`: **[run]** an unknown tag returns 200 with a title and a blank list.
- `app/blog/page/[page]/page.tsx:16`: **[run]** `/blog/page/99` and `/blog/page/abc` return 200; `/blog/page/99` lists all posts.
- `app/blog/[...slug]/page.tsx:87`: **[run]** an unknown slug returns 200 "Under Construction", with no link in the content area.
- `app/projects/page.tsx:21`: no empty state.
- `pliny/chunk-WO2FOAH6.js:30`: a failed search index fetch is not caught; the dialog would stay on "Loading...".
- `pliny/ui/NewsletterForm.js:31`: no submitting state; the button stays enabled during the request.
- `pliny/ui/NewsletterForm.js:35`: a network failure or non-JSON response is not caught.
- `pliny/ui/NewsletterForm.js:47`: every error response shows the "invalid or already subscribed" message.
- `components/ThemeSwitch.tsx:13`: nothing renders before mount, so the button appears late.
- `pliny/ui/Pre.js:18`: success shows before the clipboard write, whose failure is not handled.

## Accessibility gaps

- `components/Tag.tsx:11`: `primary` text on white is 2.47:1 (also `app/Main.tsx:59`).
- `pliny/ui/NewsletterForm.js:77`: white on `primary` is 2.47:1.
- `tailwind.config.js:54`: code inside links is 1.96:1 on white.
- `tailwind.config.js:64`: inline code is 4.47:1 on white.
- `pliny/chunk-R2UQHQLC.js:33`: search "Loading..." and no-result text is 2.43:1 light (on `gray-50`) and 2.35:1 dark.
- `pliny/chunk-R2UQHQLC.js:48`: active search result is 3.35:1; its date is 2.97:1 (line 51).
- `pliny/chunk-R2UQHQLC.js:51`: inactive result dates are 2.43:1 on `gray-50`.
- `pliny/chunk-R2UQHQLC.js:45`: the search section label is 3.52:1 on `gray-50`.
- `layouts/ListLayoutWithTags.tsx:90`: `primary` on the light sidebar is 2.37:1 (also line 104).
- `app/not-found.tsx:18`: the button removes the focus outline, and its replacement class `shadow-outline-blue` is not in the built CSS.
- `css/prism.css:54`: code comments are 3.10:1 on the light-theme code background.
- `pliny/ui/NewsletterForm.js:84`: error text is 3.76:1 on white.
- `app/layout.tsx:78`: no skip link.
- `components/Header.tsx:28`: header links are not inside a `nav` element.
- `components/Header.tsx:32`: no current-page indication or `aria-current`.
- `components/MobileNav.tsx:39`: **[run]** the closed menu is only moved off screen; its links stay in the tab order at desktop width.
- `components/MobileNav.tsx:39`: **[run]** `Esc` does not close the open menu.
- `components/MobileNav.tsx:24`: no `aria-expanded`; open and close share the label "Toggle Menu"; no focus move or focus trap.
- `layouts/ListLayoutWithTags.tsx:82`: **[run]** from `sm` the page `h1` is `display:none`, leaving no visible or exposed page heading.
- `layouts/ListLayoutWithTags.tsx:104`: the current tag is shown by color and an `h3`, without `aria-current`; "All Posts" likewise (line 90).
- `layouts/AuthorLayout.tsx:33`: **[run]** heading level jumps from `h1` to `h3`.
- `layouts/AuthorLayout.tsx:27`, `layouts/PostLayout.tsx:70`: image alt text is "avatar".
- `components/Card.tsx:13`: image, title and "Learn more" are three links with one label; the label replaces the visible "Learn more" (line 46).
- `app/tags/page.tsx:26`: two adjacent links per tag go to the same page.
- `pliny/ui/Pre.js:24`: the copy button exists only during mouse hover.
- `contentlayer.config.ts:146`: **[run]** heading anchor links are empty, zero width, `aria-hidden` and out of the tab order.
- `pliny/ui/NewsletterForm.js:84`: errors are not announced (no live region).
- `components/Header.tsx:35`: **[run]** header links are 20px tall; search and theme buttons are 24×24px.
- `components/Footer.tsx:10`: **[run]** footer social links are 24×24px; the theme credit is 17px tall.
- `app/layout.tsx:63`: smooth scroll and menu transition (`components/MobileNav.tsx:39`) ignore reduced motion.

## Other observations

- `layouts/PostSimple.tsx:33`: **[run]** dates show one day early: a post dated `2023-09-27` reads "September 26, 2023" on home, list, post and search. The date-only value is formatted in local time (`pliny/chunk-T2LUFWMO.js`).
- `layouts/ListLayoutWithTags.tsx:132`: from code, a UTC build would prerender the correct day and this client component would reformat it in the visitor's time zone. Not checked on the deployed site.
- `components/ThemeSwitch.tsx:20`: **[run]** with a dark system setting and no stored theme, the first click changes the icon but not the colors.
- `app/projects/page.tsx:7`: `/projects` is not linked from the header and is absent from the sitemap (`app/sitemap.ts:13`).
- `data/projectsData.ts:16`: **[run]** links to `/blog/the-time-machine`, which shows "Under Construction".
- `layouts/ListLayout.tsx:63`: not imported by any route, including its article search field.
- `components/LayoutWrapper.tsx:15`: unused; it would load Inter instead of Montserrat.
- `app/head.tsx:1`: **[run]** its tags do not appear in the rendered page; `app/layout.tsx:66` carries them.
- `app/layout.tsx:66`: `link` and `meta` elements sit directly under `html`.
- `layouts/PostLayout.tsx:32`: the default layout is used by no current post; `layouts/PostBanner.tsx:20` is also unused.
- `data/siteMetadata.js:2`: no `comments` key, so comment blocks and the scroll-to-comment button never render.
- `components/Footer.tsx:12`: Facebook, YouTube and Twitter icons are passed unset URLs and render nothing.
- `app/layout.tsx:2`: Algolia styles are imported while search uses KBar.
- `data/authors/sparrowhawk.mdx:1`: starter template author.
- `app/api/newsletter/route.ts:9`: **[run]** `GET` is exported and returned 500 locally, with no Mailchimp variables set.
- `app/blog/page/[page]/page.tsx:8`: drafts count toward page totals; they also reach the sitemap (`app/sitemap.ts:8`) and tag feeds (`scripts/rss.mjs:50`).
- `app/tags/[tag]/page.tsx:36`: tag titles capitalise only the first letter ("Graphql").
