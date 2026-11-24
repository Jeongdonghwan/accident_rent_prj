import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { OPEN_PAGES, getPage, pagePath, pageEncodedPath, canonicalPath, related } from '../../lib/data';
import { composeRay } from '../../lib/ray';
import { BRAND } from '../../lib/site';
import { breadcrumbJsonLd, faqJsonLd, itemListJsonLd, ogImages, serviceJsonLd } from '../../lib/jsonld';
import { Actions, FixedLinks, HeroShot, IconArrow, JsonLd, PhotoRail } from '../../components/Common';
import { heroPhoto, railPhotos } from '../../lib/photos';

export const dynamicParams = false;
export function generateStaticParams() { return OPEN_PAGES.map((p) => ({ slug: p.slug })); }

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = getPage(params.slug);
  if (!p) return {};
  const c = composeRay(p);
  const url = canonicalPath(p);
  const images = ogImages(p.variantOf || p.slug, p.kw);
  return { title: c.title, description: c.description, alternates: { canonical: url }, openGraph: { type: 'website', siteName: BRAND, locale: 'ko_KR', title: c.title, description: c.description, url, images }, twitter: { card: 'summary_large_image', title: c.title, description: c.description, images } };
}

export default function KeywordPage({ params }: { params: { slug: string } }) {
  const p = getPage(params.slug);
  if (!p) notFound();
  const c = composeRay(p);
  const rel = related(p, 5);
  const path = pageEncodedPath(p);
  const hero = heroPhoto(p.variantOf || p.slug, p.kw);

  return (
    <main>
      <JsonLd data={[
        breadcrumbJsonLd([{ name: '홈', path: '/' }, { name: '지역', path: '/area/' }, { name: p.kw, path }]),
        serviceJsonLd({ name: p.kw, description: c.description, path, area: `${c.city.name} ${p.region}` }),
        faqJsonLd(c.faq),
        itemListJsonLd([...rel.samePlace, ...rel.sameCity, ...rel.otherCities]),
      ]} />

      <section className="hero">
        <div className="wrap"><div className="hero-grid">
          <div className="hero-copy">
            <nav className="crumbs" aria-label="경로"><Link href="/">홈</Link><span>/</span><Link href="/area/">지역</Link><span>/</span>{p.kw}</nav>
            <p className="ray-cat">{c.cat}</p>
            <h1 className="hero-title"><span>{p.kw}</span>{' '}<span className="hero-sub">{c.h1sub}</span></h1>
            <p className="hero-lead">{c.lead}</p>
            <Actions dark />
          </div>
          <HeroShot p={hero} kw={p.kw} />
        </div></div>
      </section>
      <FixedLinks />

      <div className="wrap content">
        <section className="ray-sum" data-reveal>
          <h2>{p.kw} 핵심 요약</h2>
          <p>{c.summaryText}</p>
          <dl className="info">{c.facts.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
        </section>

        <article className="ray">
          {c.sections.map((x, i) => (
            <section key={i} data-reveal>
              <h2><span>{String(i + 1).padStart(2, '0')}</span>{x.h}</h2>
              <p>{x.p}</p>
            </section>
          ))}
        </article>
      </div>

      <section className="cta-band" data-reveal>
        <div className="wrap cta-band-in">
          <p>상대 보험 <em>접수번호</em>만 있으면 됩니다.</p>
          <Actions dark />
        </div>
      </section>

      <section className="photo-band">
        <div className="wrap">
          <PhotoRail id="rail-kw" photos={railPhotos(p.slug, 8, hero)} kw={p.kw} />
          <p className="ray-note">{c.subs.photo}</p>
        </div>
      </section>

      <div className="wrap content">
        <section className="sec" id="faq">
          <h2 className="ray-h">{p.kw} 자주 묻는 질문</h2>
          <div className="faq">{c.faq.map((f) => <details key={f.q} data-reveal><summary>{f.q}<i /></summary><p>{f.a}</p></details>)}</div>
        </section>

        <section className="sec">
          <h2 className="ray-h">{p.kw} 관련 안내</h2>
          <div className="related">
            {rel.samePlace.length > 0 && <div><h3>{p.region}, 다른 안내도</h3><ul>{rel.samePlace.map((x) => <li key={x.slug}><Link href={pagePath(x)}>{x.kw}<IconArrow /></Link></li>)}</ul></div>}
            {rel.sameCity.length > 0 && <div><h3>같은 {p.word}, {c.city.name} 다른 곳</h3><ul>{rel.sameCity.map((x) => <li key={x.slug}><Link href={pagePath(x)}>{x.kw}<IconArrow /></Link></li>)}</ul></div>}
            {rel.otherCities.length > 0 && <div><h3>가까운 도시 {p.word}</h3><ul>{rel.otherCities.map((x) => <li key={x.slug}><Link href={pagePath(x)}>{x.kw}<IconArrow /></Link></li>)}</ul></div>}
          </div>
        </section>
      </div>

      <section className="closing">
        <div className="wrap" data-reveal>
          <h2>{c.closing.heading}</h2>
          <p>{c.closing.text}</p>
          <Actions dark />
          <FixedLinks compact />
        </div>
      </section>
    </main>
  );
}
