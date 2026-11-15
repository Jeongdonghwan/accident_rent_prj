// 소개 — 사실만 평서문으로 (무엇을·어디서·어떻게 연락). site.ts 와 페이지 데이터에 있는 것만 쓴다. 없는 정보는 줄을 내지 않는다.
import type { Metadata } from 'next';
import Link from 'next/link';
import { OPEN_PAGES } from '../../lib/data';
import { BRAND, BUSINESS, CONTACT, LINKS, UPDATED, tel, smsHref } from '../../lib/site';
import { breadcrumbJsonLd, ogImages } from '../../lib/jsonld';
import { JsonLd } from '../../components/Common';

const TITLE = `소개 | ${BRAND}`;
const DESC = '사고 대차와 수입차 렌트를 하는 곳입니다. 하는 일, 배차하는 지역, 접수 방법을 사실대로 정리했습니다.';
export const metadata: Metadata = {
  title: TITLE, description: DESC, alternates: { canonical: '/about/' },
  openGraph: { type: 'website', siteName: BRAND, locale: 'ko_KR', title: TITLE, description: DESC, url: '/about/', images: ogImages('home', BRAND) },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC, images: ogImages('home', BRAND) },
};

// 업체 구조화 데이터(AutoRental)는 layout 에서 전 페이지에 들어간다
export default function About() {
  const cities = Array.from(new Set(OPEN_PAGES.filter((p) => !p.variantOf).map((p) => p.city)));
  return (
    <main>
      <JsonLd data={breadcrumbJsonLd([{ name: '홈', path: '/' }, { name: '소개', path: '/about/' }])} />
      <section className="page-head"><div className="wrap">
        <nav className="crumbs" aria-label="경로"><Link href="/">홈</Link><span>/</span>소개</nav>
        <h1 className="page-title">{BUSINESS.name || BRAND} 소개</h1>
        <p>{BUSINESS.name || BRAND}는 사고 대차와 수입차 렌트를 합니다.</p>
      </div></section>
      <div className="wrap content">
        <section className="area-block">
          <h2 className="area-h">하는 일</h2>
          <div>
            <p className="prose-p">사고로 차를 수리하는 동안 탈 차를 사고 현장, 공업사, 자택, 직장으로 배차합니다.</p>
            <p className="prose-p">무과실 사고는 상대 차량 보험사(대물배상)로 렌트비를 청구합니다. 보험 처리 여부와 본인 부담은 과실 비율과 보험사 판단에 따라 달라질 수 있습니다.</p>
          </div>
        </section>
        <section className="area-block">
          <h2 className="area-h">배차하는 지역</h2>
          <p className="prose-p">{cities.join(', ')} 지역을 안내합니다. 도시별 안내는 <Link href="/area/">지역별 안내</Link>에, 사고 처리 관련 글은 <Link href="/blog/">블로그</Link>에 있습니다.</p>
        </section>
        <section className="area-block">
          <h2 className="area-h">접수 방법</h2>
          <div>
            <p className="prose-p">전화 <a href={tel}>{CONTACT.phone}</a>, 문자 <a href={smsHref}>{CONTACT.sms}</a>{CONTACT.hours && ` (${CONTACT.hours})`}로 받습니다.</p>
            {BUSINESS.address && <p className="prose-p">주소는 {BUSINESS.address}입니다.</p>}
            {BUSINESS.ceo && <p className="prose-p">대표는 {BUSINESS.ceo}입니다.</p>}
            {BUSINESS.bizNumber && <p className="prose-p">사업자등록번호는 {BUSINESS.bizNumber}입니다.</p>}
            {BUSINESS.rentNumber && <p className="prose-p">자동차대여사업 등록번호는 {BUSINESS.rentNumber}입니다.</p>}
            {LINKS.length > 0 && <p className="prose-p">{LINKS.map((l) => <a key={l.url} href={l.url} target="_blank" rel="noopener">{l.label}</a>)}</p>}
            <p className="prose-p">이 페이지의 최종 수정일은 <time dateTime={UPDATED}>{UPDATED}</time>입니다.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
