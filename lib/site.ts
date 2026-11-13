// 사이트 설정 — 연락처·고정 링크·사업자 정보. TODO 표시는 업체 정보를 받으면 채운다.

export const SITE_URL = process.env.SITE_URL || 'https://xn--sm2bt5eo6fpwu.kr'; // 미소렌트.kr (퓨니코드)
export const BRAND = '미소렌트카';
export const BRAND_EN = 'MISO RENT A CAR';

export const CONTACT = {
  phone: '010-8647-6853',
  sms: '010-8647-6853',
  kakao: '', // TODO: 카카오톡 채널 (없으면 버튼 숨김)
  hours: '24시간 접수', // TODO: 실제 접수 시간 확인
};

// 페이지마다 고정으로 넣을 외부 링크 (예: 기존 홈페이지, 블로그). 비어 있으면 띠를 숨긴다.
export const LINKS: { label: string; sub: string; url: string }[] = [ // 없음(사용자 확인)
  // { label: '공식 홈페이지', sub: 'example.com', url: 'https://example.com' },
];

export const BUSINESS = {
  name: '', // 사업자 정보 없음(사용자 확인)
  ceo: '',
  bizNumber: '',
  rentNumber: '', // 자동차대여사업 등록번호
  address: '',
};

// 사용자 요청으로 쓰는 무료·0원 표현 — 항상 조건과 함께 노출한다
export const OFFER = {
  zero: '무과실 사고 고객 부담 0원',
  zeroNote: '상대 차량 보험사(대물배상)로 렌트비를 청구하는 경우',
  free: ['배차·탁송 무료', '보험 접수 대행 무료'], // TODO: 실제 제공 여부 확인
};

export const OPEN_WAVE = Number(process.env.OPEN_WAVE || 4); // 1~4 묶음 누적 공개, 5~7 = 추가 동네 페이지(11/15·11/17·11/19, scripts/add_extra_pages.py) (scripts/deploy.sh <묶음> <URL>)
export const MERGE_VARIANTS = true;

export const tel = `tel:${CONTACT.phone.replace(/[^0-9]/g, '')}`;
export const smsHref = `sms:${CONTACT.sms.replace(/[^0-9]/g, '')}`;
