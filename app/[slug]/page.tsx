import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { OPEN_PAGES, getPage, pagePath, pageEncodedPath, canonicalPath, related } from '../../lib/data';
import { compose } from '../../lib/compose';
import { breadcrumbJsonLd, faqJsonLd, itemListJsonLd, ogImages, serviceJsonLd } from '../../lib/jsonld';
import { Actions, ClassTable, FaultCalc, FixedLinks, HeroShot, IconArrow, Img, JsonLd, PhotoRail, SectionHead } from '../../components/Common';
import { CASE_PHOTO, STEP_PHOTOS, heroPhoto, railPhotos } from '../../lib/photos';

export const dynamicParams = false;
export function generateStaticParams() { return OPEN_PAGES.map((p) => ({ slug: p.slug })); }

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = getPage(params.slug);
  if (!p) return {};
  const c = compose(p);
  const url = canonicalPath(p);
  const images = ogImages(p.variantOf || p.slug, p.kw);
  return { title: c.title, description: c.description, alternates: { canonical: url }, openGraph: { title: c.title, description: c.description, url, images }, twitter: { card: 'summary_large_image', title: c.title, description: c.description, images } };
}

export default function KeywordPage({ params }: { params: { slug: string } }) {
  const p = getPage(params.slug);
  if (!p) notFound();
  const c = compose(p);
  const rel = related(p);
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
            <h1 className="hero-title"><span>{p.kw}</span></h1>
            <p className="hero-lead">{c.lead}</p>
            <Actions dark />
          </div>
          <HeroShot p={hero} kw={p.kw} />
        </div>
        <dl className="hero-specs">{c.specs.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl></div>
      </section>
      <FixedLinks />

      <div className="wrap content">
        <section className="sec">
          <div className="prose" data-reveal>{c.intro.map((t, i) => <p key={i} className={i === 0 ? 'first' : ''}>{t}</p>)}</div>
        </section>

        <section className="sec alt">
          <SectionHead title={c.faultHeading} sub={c.subs.fault} />
          <FaultCalc note={c.faultNote} />
        </section>

        <section className="sec">
          <SectionHead title={c.region.heading} />
          <div className="cols">
            <div data-reveal><p className="region-body">{c.region.body}</p><p className="region-near">{c.region.extra}</p></div>
            <dl className="info" data-reveal>{c.region.dl.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
          </div>
        </section>

        {c.blocks.includes('class') && (
        <section className="sec alt">
          <SectionHead title={c.classHeading} sub={c.subs.cls} />
          <ClassTable on={c.classOn} rows={c.classRows} kw={p.kw} />
        </section>
        )}
      </div>

      <section className="cta-band" data-reveal>
        <div className="wrap cta-band-in">
          <p>상대 보험 <em>접수번호</em>만 있으면 됩니다.</p>
          <Actions dark />
        </div>
      </section>

      <div className="wrap content">
        {c.blocks.includes('steps') && <section className="sec" id="process">
          <SectionHead title="접수부터 반납까지" />
          <ol className="timeline reveal-group">{c.steps.map((st, i) => <li key={st.t}><strong>{st.t}</strong><p>{st.d}</p><figure className="tl-img"><Img p={STEP_PHOTOS[i % STEP_PHOTOS.length]} kw={`${p.region} ${st.t}`} /></figure></li>)}</ol>
        </section>}

        {c.blocks.includes('cases') && <section className="sec">
          <SectionHead title={c.casesHeading} />
          <ol className="cases reveal-group">{c.cases.map((x) => <li key={x.t}>{CASE_PHOTO[x.t] && <figure className="case-img"><Img p={CASE_PHOTO[x.t]} kw={`${p.region} ${x.t}`} /></figure>}<h3>{x.t}</h3><p>{x.d}</p></li>)}</ol>
        </section>}

      </div>

      <section className="photo-band">
        <div className="wrap">
          <SectionHead title={`${p.region} ${p.word} 차량 이미지`} sub={c.subs.photo} />
          <PhotoRail id="rail-kw" photos={railPhotos(p.slug, 8, hero)} kw={p.kw} />
        </div>
      </section>

      <div className="wrap content">
        {c.buyer.length > 0 && (
          <section className="sec alt">
            <SectionHead title={`${p.region} 사고대차업체 고르는 기준`} />
            <ol className="buyer reveal-group">{c.buyer.map((x) => <li key={x}>{x}</li>)}</ol>
          </section>
        )}

        {c.blocks.includes('checks') && <section className="sec">
          <SectionHead title="접수 전에 확인할 것" />
          <div className="lists" data-reveal>
            <div><h3>준비할 것</h3><ul className="check">{c.checks.map((x) => <li key={x}>{x}</li>)}</ul></div>
            <div><h3>자주 놓치는 점</h3><ul className="warn">{c.pitfalls.map((x) => <li key={x}>{x}</li>)}</ul></div>
          </div>
        </section>}

        <section className="sec alt" id="faq">
          <SectionHead title="자주 묻는 질문" />
          <div className="faq">{c.faq.map((f) => <details key={f.q} data-reveal><summary>{f.q}<i /></summary><p>{f.a}</p></details>)}</div>
        </section>

        <section className="sec related">
          {rel.samePlace.length > 0 && <div><h3>{p.region} 다른 안내</h3><ul>{rel.samePlace.map((x) => <li key={x.slug}><Link href={pagePath(x)}>{x.kw}<IconArrow /></Link></li>)}</ul></div>}
          {rel.sameCity.length > 0 && <div><h3>{c.city.name} {p.word}</h3><ul>{rel.sameCity.map((x) => <li key={x.slug}><Link href={pagePath(x)}>{x.kw}<IconArrow /></Link></li>)}</ul></div>}
          {rel.otherCities.length > 0 && <div><h3>가까운 도시 {p.word}</h3><ul>{rel.otherCities.map((x) => <li key={x.slug}><Link href={pagePath(x)}>{x.kw}<IconArrow /></Link></li>)}</ul></div>}
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
