import type { MetadataRoute } from 'next';
import { SITE_URL } from '../lib/site';
import { OPEN_PAGES, pageEncodedPath, inSitemap } from '../lib/data';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/area/`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    ...OPEN_PAGES.filter(inSitemap).map((p) => ({ url: `${SITE_URL}${pageEncodedPath(p)}`, lastModified: now, changeFrequency: 'monthly' as const, priority: p.level === '시' ? 0.8 : 0.6 })),
  ];
}
