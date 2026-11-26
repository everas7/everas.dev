import { MetadataRoute } from 'next'
import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = siteMetadata.siteUrl

  return headerNavLinks
    .filter((link) => !link.event)
    .map((route) => ({
      url: `${siteUrl}${route.href}`,
      lastModified: new Date().toISOString().split('T')[0],
    }))
}
