import { SITE_URL, BRAND, CONTACT, BUSINESS, LINKS } from './site';

export const businessJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'AutoRental',
  '@id': `${SITE_URL}/#business`,
  name: BUSINESS.name || BRAND,
  url: `${SITE_URL}/`,
  telephone: CONTACT.phone,
  ...(BUSINESS.address ? { address: { '@type': 'PostalAddress', addressCountry: 'KR', streetAddress: BUSINESS.address } } : {}),
  ...(LINKS.length ? { sameAs: LINKS.map((l) => l.url) } : {}),
});
export const breadcrumbJsonLd = (items: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: `${SITE_URL}${it.path}` })),
});
export const faqJsonLd = (faqs: { q: string; a: string }[]) => ({
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
});
export const serviceJsonLd = (o: { name: string; description: string; path: string; area: string }) => ({
  '@context': 'https://schema.org', '@type': 'Service', serviceType: o.name, description: o.description, url: `${SITE_URL}${o.path}`,
  areaServed: { '@type': 'Place', name: o.area }, provider: { '@id': `${SITE_URL}/#business` },
});

// og 카드 (scripts/make_og.py 가 public/og/<name>.jpg 생성)
export const ogImages = (name: string, alt: string) => [{ url: `${SITE_URL}/og/${encodeURIComponent(name)}.jpg`, width: 1200, height: 630, alt }];
// 캐러셀용 목록 (path 를 주면 그 경로, 없으면 /<slug>/)
export const itemListJsonLd = (items: { kw: string; slug: string; path?: string }[]) => ({
  '@context': 'https://schema.org', '@type': 'ItemList',
  itemListElement: items.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE_URL}${p.path ?? `/${encodeURIComponent(p.slug)}/`}`, name: p.kw })),
});
export const articleJsonLd = (o: { title: string; description: string; path: string; image: string; date: string }) => ({
  '@context': 'https://schema.org', '@type': 'Article',
  headline: o.title, description: o.description, image: o.image, datePublished: o.date, dateModified: o.date, inLanguage: 'ko',
  mainEntityOfPage: `${SITE_URL}${o.path}`, author: { '@id': `${SITE_URL}/#business` }, publisher: { '@id': `${SITE_URL}/#business` },
});
