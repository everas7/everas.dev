import { profile, type ProfileLink } from '@/data/profile'

// Plain <a>, not @/components/Link: that component opens mailto: in a new tab and
// routes /static/resume.pdf through the Next.js router.
const opensNewTab = (link: ProfileLink) => link.event !== 'email'

export default function Home() {
  return (
    <div className="space-y-2 pb-8 pt-6 md:space-y-5">
      <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
        {profile.name}
      </h1>
      <p className="text-2xl font-bold leading-8 tracking-tight text-gray-900 dark:text-gray-100">
        {profile.title}
      </p>
      <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">{profile.intro}</p>
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        {profile.links.map((link) => (
          <a
            key={link.event}
            href={link.href}
            className="text-base font-medium leading-6 text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
            data-umami-event={link.event}
            data-umami-event-where="home"
            {...(opensNewTab(link) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  )
}
