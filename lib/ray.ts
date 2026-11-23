// 키워드 페이지 본문 — 레이 모범 구조(2026-11-24, programmatic-seo composer-patterns §5-1·5-2·5-3)
// 분류 줄 → h1(키워드 + 수식어) → 설명 → 핵심 요약(결론 + 정보 4칸) → 번호 절 6개(한 문단) → FAQ → 관련 링크.
// 문장 재료는 lib/compose.ts 가 만든 것(일반 보험 처리 원칙·city-facts.json)만 다시 엮는다. 새 사실·차종·혜택 없음.
// 0원 표현은 OFFER.zero(무과실 조건이 든 문구)로만 쓴다. OFFER.free(확인 전)는 쓰지 않는다.
import { Page, hash, related } from './data';
import { compose, CLASSES } from './compose';
import { CONTACT, OFFER } from './site';
import { j } from './ko';

// FNV 아랫비트는 슬러그 끝 글자에 따라 같이 움직여 윗비트로 고른다
const hi = (k: string) => hash(k) >>> 15;
const pick = <T,>(arr: T[], seed: string, salt: string): T => arr[hi(`${seed}::${salt}`) % arr.length];
const shuffle = <T,>(arr: T[], seed: string, salt: string) => arr.map((x, i) => [hi(`${i}::${salt}::${seed}`), x] as [number, T]).sort((a, b) => a[0] - b[0]).map((x) => x[1]);
const sents = (t: string) => t.split(/(?<=[.?!])\s+/).filter(Boolean);
const paraAll = (list: string[], max = 268) => {
  let out = '';
  for (const t of list) { if (!t) continue; const n = out ? `${out} ${t}` : t; if (n.length <= max) out = n; }
  return out.replace(/\s+/g, ' ');
};
const TOPIC_CAT: Record<string, string> = { accident: '사고 대차', import: '수입차 사고 대차', importRent: '수입차 렌트', rent: '렌트카' };

export function composeRay(p: Page) {
  const c = compose(p, true);
  const used = new Set<string>(); // 한 페이지 안에서 같은 문장 두 번 쓰지 않기
  const para = (list: string[], max = 268) => paraAll(list.filter((t) => t && !used.has(t)).filter((t) => (used.add(t), true)), max);
  const s = p.slug;
  const kw = p.kw;
  const t = c.topic;
  const C = c.city;
  const place = p.region;
  const short = place.startsWith(`${p.city} `) ? place.slice(p.city.length + 1) : place;
  const sp0 = C.spots.filter((x) => !kw.includes(x) && !x.includes(short));
  const sp = sp0.length ? sp0 : C.spots;
  const imp = t === 'import' || t === 'importRent';

  const h1sub = pick({
    accident: [`${sp[0]} 공업사·집 앞 동급 배차`, '상대 보험 접수번호로 시작하는 대차', '과실 비율부터 보는 수리 기간 대차', '접수부터 반납까지 다섯 단계'],
    import: [`${sp[0]} 공업사까지 수입차 동급 배차`, '부품 대기까지 보는 수리 기간 대차', '차급·배기량으로 맞추는 동급 기준'],
    importRent: ['사고 대차와 단기 렌트 나눠 보기', `${sp[0]} 쪽 배차와 보험 조건`, '면책금·운전자 조건부터 확인'],
    rent: ['사고 대차인지 일반 렌트인지부터', `${sp[0]} 쪽 공업사·집 앞 배차`, '과실 비율과 차급으로 정하는 대차'],
  }[t], s, 'h1sub');

  const cat = `${c.eyebrow} · ${TOPIC_CAT[t]}`;

  // ---- 핵심 요약 ----
  const def = {
    accident: '내 차가 사고로 공업사에 들어가 있는 동안 같은 급 차를 받아 쓰는 대체 차량',
    import: '사고 난 수입차가 수리받는 동안 같은 급 수입차를 받아 쓰는 대체 차량',
    importRent: '사고 대차와 일반 단기 렌트로 나뉘는 수입차 렌트',
    rent: '사고 대차와 일반 단기 렌트로 나뉘는 렌트',
  }[t];
  const summary = paraAll([
    `${kw}${j(kw, '은').slice(kw.length)} ${def}입니다.`,
    `${short} 사고도 ${OFFER.zero}이며, ${OFFER.zeroNote}에 해당합니다.`,
    sents(c.region.body)[0],
    `${short} 접수는 ${CONTACT.hours}이고 상담 전화는 ${CONTACT.phone}입니다.`,
  ], 330);
  const facts: [string, string][] = [...c.specs, ['배차 장소', '사고 현장 · 공업사 · 자택 · 직장']];

  // ---- 번호 절 6개 ----
  const steps = c.steps;
  const secs: { sub: string[]; p: string }[] = [
    { sub: [`${TOPIC_CAT[t]}란`, '먼저 알아 둘 것', imp ? '수입차 동급 기준' : '동급 차량 기준'],
      p: para([...shuffle(c.intro.filter((x) => !x.includes(C.name) && !x.includes(short)), s, 'i1').flatMap(sents).slice(0, 3),
        `${short} ${j(p.word, '은')} ${c.classOn.map((k) => CLASSES.find((x) => x.key === k)!).map((x) => `${x.cls}(${x.ex})`).join('·')}처럼 사고 차량과 같은 급을 기준으로 배차합니다(차종은 예시).`,
        pick([`${short} 접수는 상대 보험 접수번호와 사고 차량 차종만 있으면 시작됩니다.`, `${short}에서 사고가 났다면 공업사 입고 날짜부터 정하고 그날에 맞춰 대차를 받는 것이 순서입니다.`], s, 'i9')]) },
    { sub: [`${short} 배차 안내`, `${C.name} 어디로 가져다 주나`, '받는 곳과 반납하는 곳'],
      p: para([...sents(c.region.body), ...shuffle([...c.intro.filter((x) => x.includes(C.name) || x.includes(short)).flatMap(sents), ...sents(c.region.extra)], s, 'p2')]) },
    { sub: ['과실 비율과 본인 부담', '렌트비는 누가 내나', `${short} 사고도 같은 계산`],
      p: para([
        ...sents(c.faultNote).filter((x) => !x.includes('막대')),
        `${short} 사고라면 상대 보험 접수번호와 예상 과실을 먼저 듣고 차급을 정합니다.`,
        ...shuffle(c.pitfalls.filter((x) => /과실|차액|부담/.test(x)), s, 'pf'),
        `${C.name} 안 다른 동네 사고도 계산 방식은 같습니다.`,
        `내 과실이 있으면 렌트비 중 그 비율만큼 본인 부담이 생길 수 있어 ${short} 접수 때 먼저 안내합니다.`,
        `과실 비율은 보험사가 정하고, ${p.word} 차급은 그 예상 비율을 들은 뒤 정하는 편이 안전합니다.`,
      ]) },
    { sub: ['접수부터 반납까지', `${short} 대차 진행 순서`, '사고 접수에서 반납·정산까지'],
      p: para([
        `${short} ${j(p.word, '은')} ${steps.map((x) => x.t).join(' → ')} 순서로 진행합니다.`,
        ...steps.filter((_, i) => i !== hi(`${s}::sx1`) % 5 && i !== (hi(`${s}::sx1`) + 2) % 5).flatMap((x) => sents(OFFER.free.reduce((d, f) => d.replace(f, ''), x.d))),
        `${sp[0]} 쪽 공업사에 맡기더라도 차는 ${short} 집 앞이나 직장으로 받을 수 있습니다.`,
        `수리 완료 연락을 받으면 ${short}에서 반납 날짜를 정합니다.`,
      ], 300) },
    { sub: [c.casesHeading.replace(`${place}에서 `, ''), '사고 유형별로 다릅니다', '내 사고는 어디에 해당하나'],
      p: para([
        pick([`${short} 사고도 유형에 따라 대차 처리 방식이 달라집니다.`, `같은 ${short} 사고라도 과실이 어떻게 나뉘는지에 따라 대차 비용 처리가 달라집니다.`], s, 'c0'),
        ...c.cases.map((x) => `${x.t} — ${x.d}`),
      ], 300) },
    { sub: ['접수 전에 준비할 것', `${short} 접수 때 알려 주실 것`, '자주 놓치는 점'],
      p: para([
        `${c.checks.join(', ')}${j(c.checks[2], '을').slice(c.checks[2].length)} 접수 때 알려 주시면 배차가 빨라집니다.`,
        ...(c.buyer.length ? [`${short} ${p.word}를 고를 때는 ${c.buyer.slice(0, 3).join(', ')}를 물어보세요.`] : []),
        ...shuffle(c.pitfalls.filter((x) => !/과실|차액|부담/.test(x)), s, 'pf2'),
        `받는 곳은 ${short} 공업사·집·직장 가운데 고르면 되고, 반납 장소는 따로 정해도 됩니다.`,
        pick([`${short} 공업사 이름과 입고 날짜를 알려 주시면 그날에 맞춰 차를 둡니다.`, `사고 차량 차종을 알려 주시면 ${short} 배차 차급부터 정리해 드립니다.`], s, 'c6'),
      ]) },
  ];
  const KW_AT = new Set([0, 1, 2, 5]); // 6개 중 4개 h2 에 키워드 전체
  const sections = secs.map((x, i) => {
    const sub = pick(x.sub, s, `h${i}`);
    return { h: KW_AT.has(i) ? `${kw}${i % 2 ? ' — ' : ': '}${sub}` : sub, p: x.p };
  });

  // description 45~80자: 키워드 — 조건 붙은 0원 + 같은 동네 관련 키워드(관련 링크에 있는 것) + 전화
  const others = [...new Set(related(p, 5).samePlace.map((x) => x.word).filter((w) => w !== p.word))];
  const where = pick([`${sp[0]} 쪽 공업사·집 앞 배차`, '공업사·집 앞 동급 배차'], s, 'df');
  const description = [
    `${kw} — ${OFFER.zero}. ${others.slice(0, 2).join('·')}도 ${where} ${CONTACT.phone}`,
    `${kw} — ${OFFER.zero}. ${others.slice(0, 1).join('·')}도 ${where} ${CONTACT.phone}`,
    `${kw} — ${OFFER.zero}. ${where} ${CONTACT.phone}`,
    `${kw} — ${OFFER.zero}. 동급 배차 ${CONTACT.phone}`,
  ].filter((x) => !x.includes('. 도 ')).find((x) => x.length <= 80)!;

  // FAQ: 지역 이름이 든 답 + 주제 질문 2개 (같은 문장 비율↓)
  const faq = [...c.faq.filter((f) => f.a.includes(C.name) || f.a.includes(short)), ...c.faq.filter((f) => !f.a.includes(C.name) && !f.a.includes(short)).slice(0, 2)];

  // title 은 기존 그대로(compose 기본 모드 — alt 모드는 spot 고르는 해시가 달라 title 이 바뀐다)
  return { ...c, title: compose(p).title, h1sub, cat, summaryText: summary, facts, sections, description, faq };
}
