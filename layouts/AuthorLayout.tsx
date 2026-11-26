import { ReactNode } from 'react'
import type { Authors } from 'contentlayer/generated'
import SocialIcon from '@/components/social-icons'
import Image from '@/components/Image'
import Credentials from '@/components/Credentials'
import { profile } from '@/data/profile'

const resume = profile.links.find((link) => link.event === 'resume')

interface Props {
  children: ReactNode
  content: Omit<Authors, '_id' | '_raw' | 'body'>
}

export default function AuthorLayout({ children, content }: Props) {
  const { name, avatar, occupation, company, email, linkedin, github } = content

  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pb-8 pt-6 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            About
          </h1>
        </div>
        <div className="items-start space-y-2 xl:grid xl:grid-cols-3 xl:gap-x-8 xl:space-y-0">
          <div
            data-testid="profile-column"
            className="flex flex-col items-center space-x-2 pt-8 xl:pb-8"
          >
            {avatar && (
              <Image
                src={avatar}
                alt={name}
                width={192}
                height={192}
                className="h-48 w-48 rounded-full"
              />
            )}
            <h2 className="pb-2 pt-4 text-2xl font-bold leading-8 tracking-tight">{name}</h2>
            <div className="text-gray-500 dark:text-gray-400">{occupation}</div>
            <div className="text-gray-500 dark:text-gray-400">{company}</div>
            <div className="flex space-x-3 pt-6">
              <SocialIcon
                kind="mail"
                href={`mailto:${email}`}
                track={{ event: 'email', where: 'about' }}
              />
              <SocialIcon kind="github" href={github} track={{ event: 'github', where: 'about' }} />
              <SocialIcon
                kind="linkedin"
                href={linkedin}
                track={{ event: 'linkedin', where: 'about' }}
              />
            </div>
            {resume && (
              <div className="pt-3">
                <a
                  href={resume.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base font-medium leading-6 text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                  data-umami-event={resume.event}
                  data-umami-event-where="about"
                >
                  {resume.label}
                </a>
              </div>
            )}
          </div>
          <div
            data-testid="bio"
            className="prose max-w-none pb-8 pt-8 dark:prose-invert xl:col-span-2"
          >
            {children}
          </div>
        </div>
        <section className="space-y-6 pb-8 pt-8">
          <h2 className="text-2xl font-bold leading-8 tracking-tight text-gray-900 dark:text-gray-100">
            Credentials
          </h2>
          <Credentials where="about" />
        </section>
      </div>
    </>
  )
}
