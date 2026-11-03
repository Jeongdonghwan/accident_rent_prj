import type { Metadata } from 'next';
import Link from 'next/link';
import { getPosts, postEncodedPath } from '../../lib/blog';
import { breadcrumbJsonLd, itemListJsonLd, ogImages } from '../../lib/jsonld';
import { Actions, IconArrow, JsonLd, PostList, SectionHead } from '../../components/Common';
import { BRAND } from '../../lib/site';

const NAME = '사고대차 안내 글';
const TITLE = `${NAME} | ${BRAND}`;
const DESC = '무과실 사고 대차 기간, 대물배상 렌트비 청구, 과실 비율별 부담, 동급 차량 기준처럼 사고 뒤 렌트에서 자주 묻는 것을 하나씩 정리합니다.';
export const metadata: Metadata = {
  title: TITLE, description: DESC,
  alternates: { canonical: '/blog/', types: { 'application/rss+xml': '/rss.xml' } },
  openGraph: { type: 'website', siteName: BRAND, locale: 'ko_KR', title: TITLE, description: DESC, url: '/blog/', images: ogImages('blog', NAME) },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC, images: ogImages('blog', NAME) },
};

export default function BlogIndex() {
  const posts = getPosts();
  return (
    <main>
      <JsonLd data={[
        breadcrumbJsonLd([{ name: '홈', path: '/' }, { name: '블로그', path: '/blog/' }]),
        itemListJsonLd(posts.map((p) => ({ kw: p.title, slug: p.slug, path: postEncodedPath(p) }))),
      ]} />
      <section className="page-head"><div className="wrap">
        <nav className="crumbs" aria-label="경로"><Link href="/">홈</Link><span>/</span>블로그</nav>
        <h1 className="page-title">{NAME}</h1>
        <p>사고가 난 뒤 대차를 받기 전에 알아 두면 덜 헤매는 것들입니다. 보험 처리는 약관과 보험사 판단에 따라 달라질 수 있으니, 내 사고에 맞는 답은 접수 때 함께 확인하세요.</p>
      </div></section>
      <div className="wrap content">
        <section className="sec">
          <SectionHead title="최근 글" sub="새 글이 위로 올라옵니다." />
          {posts.length ? <PostList posts={posts} /> : (
            <p className="prose-p">첫 글을 준비하고 있습니다. 궁금한 점은 전화나 문자로 물어보세요. <Link href="/" className="more">메인으로 <IconArrow /></Link></p>
          )}
        </section>
        <section className="sec">
          <SectionHead title="내 사고는 어떻게 되나요" sub="차종, 공업사 위치, 상대 보험 접수번호를 알려주시면 과실 비율에 따른 부담부터 안내합니다." />
          <Actions />
          <p data-reveal><Link href="/area/" className="more">지역별 사고대차 안내 <IconArrow /></Link></p>
        </section>
      </div>
    </main>
  );
}
