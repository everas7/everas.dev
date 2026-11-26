import { resumeHref } from './profile'

// A link with an `event` is a file, not a page: it opens in a new tab, is counted in
// Umami and stays out of the sitemap.
export type NavLink = { href: string; title: string; event?: 'resume' }

const headerNavLinks: NavLink[] = [
  { href: '/', title: 'Home' },
  { href: '/about', title: 'About' },
  { href: resumeHref, title: 'Résumé', event: 'resume' },
]

export default headerNavLinks
