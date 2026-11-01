import type { Metadata } from 'next';
import Link from 'next/link';
import { OPEN_PAGES, pagePath } from '../../lib/data';
import { BRAND } from '../../lib/site';
import { itemListJsonLd, ogImages } from '../../lib/jsonld';
import { JsonLd } from '../../components/Common';

const TITLE = `지역별 사고대차 안내 | ${BRAND}`;
const DESC = '충청·전북·대구경북·경남·울산·경기 40개 도시의 사고대차·수입차 렌트 지역 안내 모음입니다. 무과실 사고는 고객 부담 0원, 사고 차량과 같은 급으로 공업사·자택까지 배차합니다.';
export const metadata: Metadata = {
  title: TITLE, description: DESC, alternates: { canonical: '/area/' },
  openGraph: { type: 'website', siteName: BRAND, locale: 'ko_KR', title: TITLE, description: DESC, url: '/area/', images: ogImages('area', '지역별 사고대차 안내') },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC, images: ogImages('area', '지역별 사고대차 안내') },
};

export default function AreaIndex() {
  const pages = OPEN_PAGES.filter((p) => !p.variantOf);
  const cities = Array.from(new Set(pages.map((p) => p.city)));
  return (
    <main>
      <JsonLd data={itemListJsonLd(pages)} />
      <section className="page-head"><div className="wrap">
        <nav className="crumbs" aria-label="경로"><Link href="/">홈</Link><span>/</span>지역</nav>
        <h1 className="page-title">지역별 사고대차 안내</h1>
        <p>도시를 고르면 시·구 단위 사고대차·수입차 렌트 안내로 이어집니다. 무과실 사고는 상대 보험사로 렌트비를 청구합니다.</p>
      </div></section>
      <div className="wrap content">
        {cities.map((c) => (
          <section key={c} className="area-block" data-reveal>
            <h2 className="area-h">{c}</h2>
            <ul className="area-list">{pages.filter((p) => p.city === c).map((p) => <li key={p.slug}><Link href={pagePath(p)}>{p.kw}</Link></li>)}</ul>
          </section>
        ))}
      </div>
    </main>
  );
}
