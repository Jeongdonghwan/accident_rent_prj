// 네이버 서치어드바이저 제출용 RSS 2.0 (정적 export 시 out/rss.xml)
import { SITE_URL, BRAND } from '../../lib/site';
import { OPEN_PAGES, pageEncodedPath, inSitemap } from '../../lib/data';
import { compose } from '../../lib/compose';

export const dynamic = 'force-static';
const DESC = '무과실 사고 고객 부담 0원 사고대차·수입차 렌트 지역별 안내';
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function GET() {
  const now = new Date().toUTCString();
  const items = OPEN_PAGES.filter(inSitemap).map((p) => {
    const c = compose(p);
    const link = `${SITE_URL}${pageEncodedPath(p)}`;
    return `<item><title>${esc(c.title)}</title><link>${link}</link><description>${esc(c.description)}</description><pubDate>${now}</pubDate><guid isPermaLink="true">${link}</guid></item>`;
  });
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel><title>${esc(BRAND)}</title><link>${SITE_URL}/</link><description>${esc(DESC)}</description><language>ko</language><lastBuildDate>${now}</lastBuildDate>${items.join('')}</channel></rss>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
