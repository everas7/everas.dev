import { profile } from '@/data/profile'
import ToptalBadge from './ToptalBadge'

type Where = 'home' | 'about'

const [claude, toptal] = profile.credentials

// The same <iframe> Credly's embed.js would write, rendered directly: the script only runs
// once per full page load (so it breaks on client-side navigation) and replaces a
// React-owned node. See docs/superpowers/specs/2026-11-26-e1-s2-credentials-design.md.
const CREDLY_SRC = `https://www.credly.com/embedded_badge/${claude.badgeId}`

const linkClass =
  'text-base font-medium leading-6 text-primary-500 hover:text-primary-600 dark:hover:text-primary-400'

function BadgeLink({
  href,
  label,
  event,
  where,
}: {
  href: string
  label: string
  event: string
  where: Where
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={linkClass}
      data-umami-event={event}
      data-umami-event-where={where}
    >
      {label}
    </a>
  )
}

export default function Credentials({ where }: { where: Where }) {
  return (
    <div data-testid="credentials" className="flex flex-wrap items-start gap-6">
      <div className="flex flex-col items-start gap-2">
        <div
          data-testid="credly-slot"
          className="relative h-[270px] w-[150px] overflow-hidden rounded-md"
        >
          <p className="absolute inset-0 flex items-center p-3 text-center text-sm text-gray-500 dark:text-gray-400">
            {claude.name} · {claude.issuer}
          </p>
          <iframe
            name="acclaim-badge"
            src={CREDLY_SRC}
            title="View my verified achievement on Credly."
            width={150}
            height={270}
            scrolling="no"
            loading="lazy"
            className="absolute inset-0 border-0"
          />
        </div>
        <BadgeLink href={claude.url} label={claude.linkLabel} event={claude.event} where={where} />
      </div>
      <div className="flex flex-col items-start gap-2">
        <ToptalBadge where={where} />
        <BadgeLink href={toptal.url} label={toptal.linkLabel} event={toptal.event} where={where} />
      </div>
    </div>
  )
}
