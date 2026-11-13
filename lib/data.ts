// 데이터 로더 — 키워드 페이지, 도시 사실. 빌드 전용.
import pagesData from '../data/site-pages.json';
import cityData from '../data/city-facts.json';
import { OPEN_WAVE, MERGE_VARIANTS } from './site';

export interface Page { rank: number; kw: string; slug: string; word: string; region: string; level: string; city: string; sido: string; wave: number; variantOf?: string; gu?: string } // gu: 동 페이지의 소속 구 (wave 5~ 추가분)
export interface City { kw: string; name: string; traits: string; homes: string; roads: string; spots: string[] }

export const ALL_PAGES = pagesData.pages as Page[];
export const OPEN_PAGES = ALL_PAGES.filter((p) => p.wave <= OPEN_WAVE);
const openSet = new Set(OPEN_PAGES.map((p) => p.slug));
const CITIES = cityData.cities as City[];
export const cityOf = (p: Page) => CITIES.find((c) => c.kw === p.city)!;

export const pagePath = (p: Page) => `/${p.slug}/`;
export const pageEncodedPath = (p: Page) => `/${encodeURIComponent(p.slug)}/`;
export const canonicalPath = (p: Page) =>
  MERGE_VARIANTS && p.variantOf && openSet.has(p.variantOf) ? `/${encodeURIComponent(p.variantOf)}/` : pageEncodedPath(p);
export const inSitemap = (p: Page) => canonicalPath(p) === pageEncodedPath(p);
export function getPage(slug: string) {
  let k = slug;
  try { k = decodeURIComponent(slug); } catch {}
  return OPEN_PAGES.find((p) => p.slug === k);
}
export const hash = (s: string) => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return h; };

// 같은 시의 구 이름 (페이지마다 다른 고유 문장 재료)
export const districtsOf = (city: string) => Array.from(new Set(ALL_PAGES.filter((p) => p.city === city && p.level === '구' && !p.variantOf).map((p) => p.region)));

// 같은 구(구가 없으면 같은 시)의 다른 동네 이름 — 동 페이지 배차 문단 재료
export const dongsNear = (p: Page) => Array.from(new Set(ALL_PAGES.filter((x) => x.level === '동' && x.city === p.city && x.gu === p.gu && x.region !== p.region).map((x) => x.region)));

export function cityHubs() {
  const order = ['대전광역시', '세종특별자치시', '충청남도', '충청북도', '전북특별자치도', '대구광역시', '경상북도', '경상남도', '울산광역시', '경기도'];
  const hubs = OPEN_PAGES.filter((p) => p.level === '시' && p.word === '사고대차' && !p.variantOf);
  return order.map((sido) => ({ sido, pages: hubs.filter((p) => p.sido === sido) })).filter((g) => g.pages.length);
}

export function related(p: Page) {
  const pool = OPEN_PAGES.filter((x) => x.slug !== p.slug && !x.variantOf);
  const rot = <T,>(arr: T[], n: number) => { if (!arr.length) return arr; const k = hash(p.slug) % arr.length; return [...arr.slice(k), ...arr.slice(0, k)].slice(0, n); };
  return {
    samePlace: pool.filter((x) => x.region === p.region || (!!p.gu && x.region === p.gu)).slice(0, 12),
    sameCity: rot(pool.filter((x) => x.city === p.city && x.region !== p.region && x.word === p.word), 12),
    otherCities: rot(pool.filter((x) => x.city !== p.city && x.word === p.word && x.level === '시' && x.sido === p.sido), 8),
  };
}
