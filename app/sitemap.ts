import { MetadataRoute } from 'next'
import { allBlogs } from 'contentlayer/generated'
import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = siteMetadata.siteUrl
  const blogRoutes = allBlogs.map((post) => ({
    url: `${siteUrl}/${post.path}`,
    lastModified: post.lastmod || post.date,
  }))

  const routes = headerNavLinks
    .filter((link) => !link.event)
    .map((route) => ({
      url: `${siteUrl}${route.href}`,
      lastModified: new Date().toISOString().split('T')[0],
    }))

  return [...routes, ...blogRoutes]
}
