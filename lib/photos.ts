// 차량 참고 이미지(Unsplash, 무료·출처 표기 의무 없음) — 업체 보유 차량·실제 사례가 아니므로 alt·캡션에 그렇게 쓰지 않는다.
// 사진 선택은 슬러그 해시로 고정 → 같은 페이지는 늘 같은 사진, og 썸네일(scripts/make_og.py)과 같은 규칙.
import credits from '../data/photo_credits.json';
import { hash } from './data';

export type Photo = { file: string; kind: string; alt: string; w: number; h: number };
export const PHOTOS: Photo[] = credits.photos;
const byFile = (f: string) => PHOTOS.find((p) => p.file === `${f}.jpg`)!;
const isImport = (kw: string) => /수입|외제/.test(kw);

// 히어로 후보 — make_og.py 의 hero_pool 과 같아야 한다
export const heroPool = (kw: string) => PHOTOS.filter((p) => (isImport(kw) ? ['import', 'sedan', 'suv'] : ['road', 'sedan', 'suv', 'import']).includes(p.kind));
export const heroPhoto = (slug: string, kw: string) => { const pool = heroPool(kw); return pool[hash(`${slug}::hero`) % pool.length]; };

// 차급표 · 진행 단계 · 사고 유형에 붙는 사진
export const CLASS_PHOTO: Record<string, Photo> = {
  // 같은 구도(흰색 차, 앞 3/4, 16:10)로 맞춘 차급 예시 — 2026-10-28 사용자 요청 '정렬'
  small: byFile('cls-small'), mid: byFile('cls-mid'), large: byFile('cls-large'),
  suv: byFile('cls-suv'), imp: byFile('cls-imp'), impL: byFile('cls-impl'),
};
export const STEP_PHOTOS = ['acc-01', 'int-01', 'key-01', 'shop-01', 'park-03'].map(byFile);
export const CASE_PHOTO: Record<string, Photo> = {
  '뒤에서 받힌 추돌': byFile('acc-02'), '신호위반 차량과 충돌': byFile('road-07'), '주차장 접촉 사고': byFile('park-01'),
  '차선 변경 사고': byFile('road-04'), '단독·자차 사고': byFile('acc-01'), '주차된 내 차 피해': byFile('acc-03'),
};

// 사진 레일 — 히어로와 겹치지 않게, 슬러그마다 섞인 순서로 n장
export const railPhotos = (slug: string, n = 8, skip?: Photo) => {
  const pool = PHOTOS.filter((p) => p !== skip && !['interior', 'key', 'class'].includes(p.kind));
  return pool.map((p) => [hash(`${slug}::${p.file}`), p] as const).sort((a, b) => a[0] - b[0]).slice(0, n).map((x) => x[1]);
};
