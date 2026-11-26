import type { NavLink } from '@/data/headerNavLinks'
import Link from './Link'

type Props = {
  link: NavLink
  where: 'header' | 'menu'
  className: string
  onClick?: () => void
}

export default function NavItem({ link, where, className, onClick }: Props) {
  // Plain <a> for files: @/components/Link would route the PDF through the Next.js router.
  if (link.event) {
    return (
      <a
        href={link.href}
        className={className}
        onClick={onClick}
        target="_blank"
        rel="noopener noreferrer"
        data-umami-event={link.event}
        data-umami-event-where={where}
      >
        {link.title}
      </a>
    )
  }

  return (
    <Link href={link.href} className={className} onClick={onClick}>
      {link.title}
    </Link>
  )
}
