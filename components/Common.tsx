// 사고대차 공통 UI — 각진 버튼, 선 아이콘, 섹션 머리, 과실 비율 계산기, 차급 스트립, 고정 링크 띠.
import Link from 'next/link';
import { BRAND, BRAND_EN, CONTACT, BUSINESS, LINKS, OFFER, tel, smsHref } from '../lib/site';
import { CLASSES } from '../lib/compose';
import { CLASS_PHOTO, Photo } from '../lib/photos';
import credits from '../data/photo_credits.json';
import { type Post, postPath } from '../lib/blog';
// 차급 예시 사진(Wikimedia Commons CC BY-SA) 출처 표기 — 라이선스 조건
const CREDITS = (credits.photos as { file: string; kind: string; source: string; author: string; license: string }[]).filter((c) => c.kind === 'class');

export const JsonLd = ({ data }: { data: object | object[] }) => (
  <>{(Array.isArray(data) ? data : [data]).map((d, i) => <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }} />)}</>
);
const Svg = ({ d, size = 18 }: { d: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
);
export const IconPhone = () => <Svg d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />;
export const IconMsg = () => <Svg d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />;
export const IconArrowL = () => <Svg d="M19 12H5M11 6l-6 6 6 6" size={16} />;
export const IconArrow = () => <Svg d="M5 12h14M13 6l6 6-6 6" size={16} />;
export const IconExt = () => <Svg d="M14 4h6v6M20 4l-9 9M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" size={15} />;

export const Actions = ({ dark }: { dark?: boolean }) => (
  <div className={`actions ${dark ? 'on-dark' : ''}`}>
    <a className="btn-primary" href={tel}><IconPhone /><span>{CONTACT.phone}</span></a>
    <a className="btn-text" href={smsHref}><IconMsg /><span>문자 접수 {CONTACT.sms}</span><IconArrow /></a>
    {CONTACT.kakao && <a className="btn-text" href={CONTACT.kakao} target="_blank" rel="noopener"><span>카카오톡</span><IconArrow /></a>}
  </div>
);

export const FixedLinks = ({ compact }: { compact?: boolean }) =>
  LINKS.length ? (
    <div className={`official ${compact ? 'compact' : ''}`}>
      <span className="official-label">바로가기</span>
      {LINKS.map((l) => <a key={l.url} href={l.url} target="_blank" rel="noopener"><b>{l.label}</b><span>{l.sub}</span><IconExt /></a>)}
    </div>
  ) : null;

export const SectionHead = ({ title, sub }: { title: React.ReactNode; sub?: string }) => (
  <header className="sh" data-reveal><h2>{title}</h2>{sub && <p>{sub}</p>}</header>
);

// 0원 배지 — 조건 문구와 항상 같이
export const ZeroBadge = () => (
  <div className="zero" data-reveal>
    <b>0원</b>
    <div><strong>{OFFER.zero}</strong><small>{OFFER.zeroNote}</small></div>
  </div>
);

// 과실 비율 계산기 — 렌트비 중 상대 보험사 / 본인 부담 비율 (금액 아님)
export const FaultCalc = ({ note }: { note?: string }) => (
  <div className="fault" data-reveal style={{ ['--mine' as any]: '0%' }}>
    <div className="fault-bar"><span className="fault-other" /><span className="fault-mine" /></div>
    <div className="fault-legend">
      <p><em>상대 보험사</em><b data-other>100%</b></p>
      <p className="r"><em>본인 부담</em><b data-mine>0%</b></p>
    </div>
    <label className="fault-input">
      <span>내 과실 비율</span>
      <input className="fault-range" type="range" min="0" max="100" step="10" defaultValue="0" aria-label="내 과실 비율" />
      <output data-out>0%</output>
    </label>
    <p className="fault-note">{note || '과실 0%면 렌트비 전액을 상대 보험사로 청구해 고객 부담 0원입니다. 쌍방 과실이면 내 과실만큼 본인 부담이 생길 수 있습니다.'} 실제 처리는 보험사 과실 확정에 따릅니다.</p>
  </div>
);

// 사진 — 참고 이미지(스톡). alt = 장면 설명 + 키워드
export const Img = ({ p, kw, eager }: { p: Photo; kw?: string; eager?: boolean }) => (
  <img src={`/img/${p.file}`} alt={kw ? `${p.alt} — ${kw} 참고 이미지` : p.alt} width={p.w} height={p.h} loading={eager ? 'eager' : 'lazy'} decoding="async" {...(eager ? { fetchPriority: 'high' } : {})} />
);

// 히어로 오른쪽 사진 + 아래에 겹치는 0원 패널. 스톡 사진이라 '참고 이미지' 표기
export const HeroShot = ({ p, kw }: { p: Photo; kw: string }) => (
  <div className="hero-shot">
    <figure className="shot"><Img p={p} kw={kw} eager /><figcaption>참고 이미지</figcaption></figure>
    <ZeroBadge />
  </div>
);

export const ClassTable = ({ on = [] as string[], kw = '사고대차' }) => (
  <dl className="classes reveal-group">
    {CLASSES.map((c) => (
      <div key={c.key} className={on.includes(c.key) ? 'on' : ''}>
        <figure className="cls-img"><Img p={CLASS_PHOTO[c.key]} kw={`${c.cls} ${kw}`} /></figure>
        <dt>{c.cls}</dt><dd>{c.ex}</dd><span>동급 배차</span>
      </div>
    ))}
  </dl>
);

// 가로 사진 레일 (←→ 버튼은 Motion.tsx data-scroll)
export const PhotoRail = ({ id, photos, kw }: { id: string; photos: Photo[]; kw: string }) => (
  <>
    <div className="rail-nav" data-reveal>
      <button type="button" data-scroll="-1" data-target={id} aria-label="이전 사진"><IconArrowL /></button>
      <button type="button" data-scroll="1" data-target={id} aria-label="다음 사진"><IconArrow /></button>
    </div>
    <div className="rail photo-rail" id={id}>
      {photos.map((p, i) => (
        <figure key={p.file} className={i % 3 === 0 ? 'wide' : ''}><Img p={p} kw={kw} /><figcaption>{p.alt}</figcaption></figure>
      ))}
    </div>
  </>
);

// 블로그 글 목록 — 날짜 · 제목 · 한 줄 답 (메인 최근 글, /blog/ 공용)
export const PostList = ({ posts }: { posts: Post[] }) => (
  <ul className="post-list reveal-group">
    {posts.map((p) => (
      <li key={p.slug}>
        <Link href={postPath(p)}>
          <time dateTime={p.publishedAt}>{p.publishedAt.replace(/-/g, '.')}</time>
          <strong>{p.title}</strong>
          <span>{p.description}</span>
          <IconArrow />
        </Link>
      </li>
    ))}
  </ul>
);

export const Header = () => (
  <header className="site-header">
    <div className="wrap header-inner">
      <Link href="/" className="logo"><b>{BRAND}</b><small>{BRAND_EN}</small></Link>
      <nav className="nav">
        <Link href="/#process">이용 절차</Link>
        <Link href="/area/">지역</Link>
        <Link href="/blog/">블로그</Link>
        <a href={tel} className="nav-call"><IconPhone />{CONTACT.phone}</a>
      </nav>
    </div>
  </header>
);

export const Footer = () => (
  <footer className="site-footer">
    <div className="wrap foot-grid">
      <div>
        <strong className="foot-brand">{BRAND}</strong>
        <p>사고 대차·수입차 렌트. {OFFER.zero}({OFFER.zeroNote}).</p>
        <p className="foot-links"><Link href="/blog/">블로그</Link><Link href="/area/">지역별 안내</Link><Link href="/#process">이용 절차</Link></p>
        {LINKS.length > 0 && <p className="foot-links">{LINKS.map((l) => <a key={l.url} href={l.url} target="_blank" rel="noopener">{l.label}</a>)}</p>}
      </div>
      <ul className="foot-info">
        <li><span>대표전화</span>{CONTACT.phone}</li>
        <li><span>문자</span>{CONTACT.sms}</li>
        {BUSINESS.name && <li><span>상호</span>{BUSINESS.name}</li>}
        {BUSINESS.ceo && <li><span>대표</span>{BUSINESS.ceo}</li>}
        {BUSINESS.bizNumber && <li><span>사업자</span>{BUSINESS.bizNumber}</li>}
        {BUSINESS.rentNumber && <li><span>대여사업</span>{BUSINESS.rentNumber}</li>}
        {BUSINESS.address && <li><span>주소</span>{BUSINESS.address}</li>}
      </ul>
    </div>
    <div className="wrap foot-bottom">© {new Date().getFullYear()} {BRAND} · 보험 처리 여부와 본인 부담은 과실 비율과 보험사 판단에 따라 달라질 수 있습니다.
      <p className="foot-credit">차량 사진은 차급 예시(업체 보유 차량 아님) · Unsplash, Wikimedia Commons{' '}
        {CREDITS.map((c, i) => <span key={c.file}>{i ? ' · ' : '('}<a href={c.source} target="_blank" rel="noopener nofollow">{c.author}</a>, {c.license}{i === CREDITS.length - 1 ? ')' : ''}</span>)}
      </p>
    </div>
  </footer>
);

export const StickyBar = () => (
  <div className="sticky-bar">
    <a href={tel} className="sb-call"><IconPhone />전화 접수</a>
    <a href={smsHref} className="sb-sms"><IconMsg />문자</a>
  </div>
);
