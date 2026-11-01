"""region_kw_prj/pages/사고대차.json(사용자 파일 위에서부터 1,000개) → data/site-pages.json

  python -I scripts/import_pages.py

- 표기만 다른 쌍(수정/수정구, 청주/청주시 …)은 variantOf 로 대표 페이지 표시
- 오픈 단계(wave): 목록 순서(시 단위 먼저 → 구 단위) 4등분 (post-launch 나눠 열기). 빌드 시 OPEN_WAVE 이하만 공개.
"""
import json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
src = os.path.join(ROOT, '..', 'region_kw_prj', 'pages', '사고대차.json')
pages = json.load(open(src, encoding='utf-8'))['pages']
norm = lambda n: re.sub(r'(구|시|군)$', '', n.split(' ')[-1])
main = {}
pages.sort(key=lambda p: p['level'] != '시')  # 안정 정렬: 시 먼저, 원래 순서 유지
for i, p in enumerate(pages): p['wave'] = 1 + i * 4 // len(pages)
for p in pages:
    key = (p['city'], p['word'], norm(p['region']))
    if key in main:
        p['variantOf'] = main[key]
    else:
        main[key] = p['slug']
assert len({p['slug'] for p in pages}) == len(pages)
json.dump({'pages': pages}, open(os.path.join(ROOT, 'data', 'site-pages.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
sys.stdout.reconfigure(encoding='utf-8')
print('pages', len(pages), 'variants', sum(1 for p in pages if 'variantOf' in p), 'wave1', sum(1 for p in pages if p['wave'] == 1))
