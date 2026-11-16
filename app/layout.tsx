import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Header, Footer, StickyBar, JsonLd } from '../components/Common';
import Motion from '../components/Motion';
import { businessJsonLd, ogImages } from '../lib/jsonld';
import { SITE_URL, BRAND, OFFER } from '../lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${BRAND} | ${OFFER.zero} · 수입차 동급 대차`, template: '%s' },
  description: `사고 대차·수입차 렌트. ${OFFER.zero}, 사고 차량과 같은 급으로 공업사·자택까지 배차.`,
  robots: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  verification: { google: 'FiVXRKvk8LWevLnJkYQlQQYCvBfCzvQyg851vCeVeQw', other: { 'naver-site-verification': '17a285745074f1d9c6dc51c7511746dba000e967' } },
  alternates: { types: { 'application/rss+xml': `${SITE_URL}/rss.xml` } },
  openGraph: { type: 'website', siteName: BRAND, locale: 'ko_KR', images: ogImages('home', BRAND) },
  twitter: { card: 'summary_large_image', images: ogImages('home', BRAND) },
};
export const viewport: Viewport = { themeColor: '#0e1621', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head><link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css" /></head>
      <body>
        <JsonLd data={businessJsonLd()} />
        <Header />
        {children}
        <Footer />
        <StickyBar />
        <Motion />
        <script dangerouslySetInnerHTML={{ __html: "document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href]');if(!a)return;var h=a.getAttribute('href')||'',k=h.indexOf('tel:')===0?'tel':h.indexOf('sms:')===0?'sms':/kakao/.test(h)?'kakao':'';if(k&&navigator.sendBeacon)navigator.sendBeacon('/_t?e='+k+'&p='+encodeURIComponent(location.pathname))},true)" }} />
      </body>
    </html>
  );
}
