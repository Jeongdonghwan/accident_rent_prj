import type { Metadata } from 'next';
import Link from 'next/link';
import { cityHubs, pagePath } from '../lib/data';
import { BRAND, CONTACT, OFFER, SITE_URL } from '../lib/site';
import { faqJsonLd, itemListJsonLd, ogImages } from '../lib/jsonld';
import { Actions, ClassTable, FaultCalc, FixedLinks, HeroShot, IconArrow, Img, JsonLd, PhotoRail, SectionHead } from '../components/Common';
import { PHOTOS, STEP_PHOTOS, railPhotos } from '../lib/photos';

// 메인 canonical·RSS (layout 의 alternates 를 덮으므로 types 도 같이)
export const metadata: Metadata = { alternates: { canonical: '/', types: { 'application/rss+xml': `${SITE_URL}/rss.xml` } }, openGraph: { type: 'website', siteName: BRAND, locale: 'ko_KR', url: '/', images: ogImages('home', BRAND) } };

const STEPS = [
  { t: '사고 접수', d: '상대 보험사에 사고를 접수하고 접수번호를 받아 둡니다.' },
  { t: '대차 신청', d: `${CONTACT.phone}로 차급·공업사 위치·필요한 날을 알려주세요.` },
  { t: '배차', d: '공업사·자택·직장으로 같은 급 차를 가져다 드립니다.' },
  { t: '수리 기간 이용', d: '수리가 끝날 때까지 씁니다.' },
  { t: '반납·정산', d: '무과실이면 렌트비는 보험사로 청구되어 고객 부담이 없습니다.' },
];
const FAQ = [
  { q: '정말 0원인가요?', a: '상대 과실 100% 사고면 렌트비를 상대 보험사 대물배상으로 청구해 고객 부담이 없습니다. 쌍방 과실이면 본인 과실 비율만큼 부담이 생길 수 있어 접수 때 먼저 안내합니다.' },
  { q: '어떤 차가 나오나요?', a: '사고 차량과 같은 급(배기량·연식이 비슷한 차)이 기준입니다. 수입차는 동급 수입차로 배차합니다.' },
  { q: '어디로 가져다 주나요?', a: '사고 현장, 공업사, 자택, 직장 등 원하는 곳으로 배차합니다.' },
  { q: '접수 시간은요?', a: `${CONTACT.hours}입니다. 전화 ${CONTACT.phone}, 문자 ${CONTACT.sms}.` },
];

export default function Home() {
  const hubs = cityHubs();
  return (
    <main>
      <JsonLd data={[faqJsonLd(FAQ), itemListJsonLd(hubs.flatMap((h) => h.pages).slice(0, 30))]} />
      <section className="hero hero-home">
        <div className="wrap"><div className="hero-grid">
          <div className="hero-copy">
            <h1 className="hero-title"><span>사고 난 날,</span><span>같은 급 차로 바로</span></h1>
            <p className="hero-lead">내 차가 공업사에 있는 동안 쓸 차를 공업사·집·직장으로 가져다 드립니다. 상대 과실 사고면 렌트비는 상대 보험사가 냅니다.</p>
            <Actions dark />
          </div>
          <HeroShot p={PHOTOS.find((x) => x.file === 'road-04.jpg')!} kw="사고대차" />
        </div>
        <dl className="hero-specs">
          <div><dt>고객 부담</dt><dd>무과실 0원</dd></div>
          <div><dt>배차 기준</dt><dd>사고 차량 동급</dd></div>
          <div><dt>접수</dt><dd>{CONTACT.hours}</dd></div>
        </dl></div>
      </section>
      <FixedLinks />

      <div className="wrap content">
        <section className="sec">
          <SectionHead title="렌트비는 누가 내나요" sub="막대를 움직여 보세요. 금액이 아니라 렌트비를 나누는 비율입니다." />
          <FaultCalc />
        </section>

        <section className="sec alt">
          <SectionHead title="같은 급으로 나갑니다" sub="차급 예시입니다. 실제 배차 차종은 접수 때 안내합니다." />
          <ClassTable on={['imp', 'impL']} kw="사고대차" />
        </section>

        <section className="sec" id="process">
          <SectionHead title="접수부터 반납까지" />
          <ol className="timeline reveal-group">{STEPS.map((st, i) => <li key={st.t}><strong>{st.t}</strong><p>{st.d}</p><figure className="tl-img"><Img p={STEP_PHOTOS[i]} kw={`${st.t} 사고대차`} /></figure></li>)}</ol>
        </section>
      </div>

      <section className="photo-band">
        <div className="wrap">
          <SectionHead title="도로 위에서, 공업사 앞에서" sub="세단·SUV·수입차 대차가 오가는 장면을 모았습니다. 참고 이미지이며 실제 배차 차량과 다를 수 있습니다." />
          <PhotoRail id="rail-home" photos={railPhotos('home', 9)} kw="사고대차" />
        </div>
      </section>

      <section className="cta-band" data-reveal>
        <div className="wrap cta-band-in"><p>{OFFER.free.join(' · ')}</p><Actions dark /></div>
      </section>

      <div className="wrap content">
        <section className="sec">
          <SectionHead title="지역별 안내" sub="충청·전북·대구경북·경남·울산·경기 도시별 안내입니다. 도시를 고르면 구 단위 안내로 이어집니다." />
          <div className="regions">
            {hubs.map((h) => (
              <div key={h.sido} className="region-col" data-reveal>
                <h3>{h.sido}</h3>
                <ul>{h.pages.map((p) => <li key={p.slug}><Link href={pagePath(p)}><span>{p.region}</span><IconArrow /></Link></li>)}</ul>
              </div>
            ))}
          </div>
          <p data-reveal><Link href="/area/" className="more">전체 지역 페이지 <IconArrow /></Link></p>
        </section>

        <section className="sec alt">
          <SectionHead title="자주 묻는 질문" />
          <div className="faq">{FAQ.map((f) => <details key={f.q} data-reveal><summary>{f.q}<i /></summary><p>{f.a}</p></details>)}</div>
        </section>
      </div>

      <section className="closing">
        <div className="wrap" data-reveal>
          <h2>사고 접수번호가 있다면</h2>
          <p>공업사 위치와 필요한 날만 알려주세요. 같은 급 차로 배차합니다.</p>
          <Actions dark />
          <FixedLinks compact />
        </div>
      </section>
    </main>
  );
}
