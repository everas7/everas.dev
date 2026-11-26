// Single source for the professional profile shown across the site.
// Copy is word for word from docs/product/features/portfolio-home/spec.md "Content"
// and the ux.md "Microcopy" table. Change it there first.

export type ProfileLink = {
  label: string
  href: string
  event: 'resume' | 'email' | 'github' | 'linkedin'
}

export type WorkItem = { title: string; meta: string; description: string }

export type Credential = {
  name: string
  issuer: string
  date?: string
  url: string
  badgeId?: string
  linkLabel: string
  event: 'badge-claude' | 'badge-toptal'
}

export type Profile = {
  name: string
  title: string
  intro: string
  email: string
  links: ProfileLink[]
  employer: { name: '2am.tech'; role: string; since: 'Apr 2022' }
  pastRoles: { name: 'Toptal'; from: 'May 2021'; to: 'Mar 2023' }[]
  location: string
  workStyle: string
  languages: string[]
  work: WorkItem[]
  credentials: Credential[]
}

const email = 'enmaveras07@gmail.com'
export const resumeHref = '/static/resume.pdf'

export const profile: Profile = {
  name: 'Enmanuel Veras',
  title: 'Senior Software Engineer',
  intro:
    'I build full-stack products in TypeScript and LLM systems in Python. 8 years shipping React, Node.js and AWS; most recently, the RAG pipeline behind an AI sales assistant used by ~150 car dealerships.',
  email,
  links: [
    { label: 'Résumé (PDF) →', href: resumeHref, event: 'resume' },
    { label: 'Email', href: `mailto:${email}`, event: 'email' },
    { label: 'GitHub', href: 'https://github.com/everas7', event: 'github' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/everas7/', event: 'linkedin' },
  ],
  employer: { name: '2am.tech', role: 'Senior Software Engineer', since: 'Apr 2022' },
  pastRoles: [{ name: 'Toptal', from: 'May 2021', to: 'Mar 2023' }],
  location: 'Santo Domingo, Dominican Republic',
  workStyle: 'Remote with US Eastern overlap',
  languages: ['English (professional)', 'Spanish (native)'],
  work: [
    {
      title: 'AI Sales Assistant for Car Dealerships',
      meta: 'Contract · 2023–2025',
      description:
        'Built the RAG pipeline (Python, FastAPI, LangChain, OpenAI, Cohere). Parallelized the SQS worker, cutting the slowest messages from 3–5+ minutes to about 1 minute.',
    },
    {
      title: 'Paperless document delivery for a Fortune 500 insurer',
      meta: '2am.tech',
      description:
        'Leading the rebuild for 6 tenants. Reverse-engineered the legacy system and proposed a Node.js microservice that the architecture board approved. 15+ ADRs.',
    },
    {
      title: 'Event-driven consent sync on AWS',
      meta: 'Toptal',
      description:
        "Lambda, SQS, DynamoDB and Serverless Framework integrations syncing users' consent choices to clients' email, user management and analytics tools.",
    },
  ],
  credentials: [
    {
      name: 'Claude Certified Developer – Foundations',
      issuer: 'Anthropic',
      date: 'Nov 2026',
      url: 'https://www.credly.com/badges/523d4204-1cad-42fe-8a94-aa6aa6fa9966',
      badgeId: '523d4204-1cad-42fe-8a94-aa6aa6fa9966',
      linkLabel: 'Verify on Credly →',
      event: 'badge-claude',
    },
    {
      name: 'Top 3% Talent',
      issuer: 'Toptal',
      url: 'https://www.toptal.com/developers/resume/enmanuel-veras-vargas',
      linkLabel: 'Toptal profile →',
      event: 'badge-toptal',
    },
  ],
}
