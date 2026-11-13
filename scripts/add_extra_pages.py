"""오픈 뒤 추가 키워드 페이지(wave 5·6·7) → data/site-pages.json 뒤에 붙이고 keywords/미소렌트_추가키워드.xlsx 작성

  python -I scripts/add_extra_pages.py

다시 돌려도 같은 결과(기존 wave 5 이상 페이지를 지우고 다시 붙인다). wave 1~4 페이지는 건드리지 않는다.

고른 기준 (검색량 데이터 없음, 이미 다니는 40개 도시 안에서만)
  - 행정동(2026-10, region_kw_prj/data/hjd_20261001.geojson)을 동네 이름으로 묶는다: 둔산1동·둔산2동 → 둔산동.
    용담·명암·산성동처럼 묶인 행정동은 동마다 나눈다. 읍은 넣고 면·광역시의 군(달성·군위·울주)은 뺀다(수요가 적다).
  - 키워드: 동네 × 렌트카·사고대차 (사이트에서 가장 넓은 두 단어), 남는 수(1,500까지)는 사고렌트카를 도시마다 돌아가며.
    도시 순서는 기존 시 페이지 순위, 도시 안에서는 구 → 동 이름 순.
  - 같은 동네 이름이 다른 도시에도 있으면 '도시 동네'(예: 창원 중앙동)로 쓴다.
  - 기존 지역 이름과 겹치는 동네(일산동 = 일산동구 표기, 옥천읍 = 옥천)는 뺀다. 두 글자 동(변동·본동)도 도시를 붙인다.
  앞에서부터 1/3씩 wave 5(11/15)·6(11/17)·7(11/19) — data/drip.json extra.
"""
import json, os, re, sys
sys.stdout.reconfigure(encoding='utf-8')
from collections import Counter, defaultdict

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGES = os.path.join(ROOT, 'data', 'site-pages.json')
GEO = os.path.join(ROOT, '..', 'region_kw_prj', 'data', 'hjd_20261001.geojson')
XLSX = os.path.join(ROOT, 'keywords', '미소렌트_추가키워드.xlsx')
DOMAIN = 'https://미소렌트.kr'
DATES = {5: '2026-11-15', 6: '2026-11-17', 7: '2026-11-19'}
WORDS = ['렌트카', '사고대차']
TARGET = 1500

data = json.load(open(PAGES, encoding='utf-8'))
pages = [p for p in data['pages'] if p['wave'] <= 4]
have = {p['slug'] for p in pages}
regions = {p['region'] for p in pages}
city_rank = {}
for p in pages:
    if p['level'] == '시': city_rank.setdefault(p['city'], p['rank'])
sido_of = {p['city']: p['sido'] for p in pages}


def base(dong):
    n = re.sub(r'제?\d+([,·]\d*)*(가)?동$', '동', dong)
    n = re.sub(r'\d+(?=·)', '', n)          # 봉명2·송정동 → 봉명·송정동
    return [x if x.endswith(('동', '읍')) else x + '동' for x in n.split('·')]   # 용담·명암·산성동 → 용담동 명암동 산성동


feats = json.load(open(GEO, encoding='utf-8'))['features']
found = defaultdict(list)   # (city, dongname) -> [gu]
for f in feats:
    pr = f['properties']
    sgg, sido = pr['sggnm'], pr['sidonm']
    for city in city_rank:
        if sido_of[city] != sido: continue
        metro = sido.endswith('광역시') or sido.startswith('세종')
        if metro: ok, gu = True, ('' if sido.startswith('세종') else sgg)
        else:
            ok = sgg.startswith(city + '시') or sgg.startswith(city + '군')
            gu = sgg[len(city) + 1:] if ok else ''
        if not ok: continue
        if metro and sgg.endswith('군'): continue   # 달성군·군위군·울주군: 광역시 군 지역은 뺀다
        last = pr['adm_nm'].split(' ')[-1]
        if not re.search(r'(동|읍)$', last): continue
        for name in base(last):
            found[(city, name)].append(gu)

name_cnt = Counter(n for (_, n) in found)
cands = []
for (city, name), gus in found.items():
    if name[:-1] in regions or name in regions: continue
    gu = Counter(gus).most_common(1)[0][0]
    # 구 이름 표기: 사이트 표기('대전 동구' 같은 동명 구는 도시 붙임)
    gu_disp = gu
    if gu and f'{city} {gu}' in {p['region'] for p in pages if p['city'] == city}: gu_disp = f'{city} {gu}'
    place = name if name_cnt[name] == 1 and len(name) > 2 else f'{city} {name}'   # 본동·변동처럼 짧은 이름도 도시를 붙인다
    cands.append(dict(city=city, name=name, place=place, gu=gu_disp))
cands.sort(key=lambda x: (city_rank[x['city']], x['gu'], x['name']))

# 동네 × 렌트카·사고대차, 남는 수만큼 사고렌트카를 도시마다 돌아가며(큰 도시 동네부터) 붙인다
new = [dict(c, word=w) for c in cands for w in WORDS]
by_city = defaultdict(list)
for c in cands: by_city[c['city']].append(c)
rr = [lst[i] for i in range(max(map(len, by_city.values()))) for lst in sorted(by_city.values(), key=lambda l: city_rank[l[0]['city']]) if i < len(lst)]
new += [dict(c, word='사고렌트카') for c in rr[:TARGET - len(new)]]

out = []
for c in new:
    kw = f"{c['place']} {c['word']}"
    slug = kw.replace(' ', '-')
    if slug in have: continue
    have.add(slug)
    out.append(dict(kw=kw, slug=slug, word=c['word'], region=c['place'], level='동', city=c['city'], sido=sido_of[c['city']], gu=c['gu']))
rank = max(p['rank'] for p in pages)
third = -(-len(out) // 3)
for i, p in enumerate(out):
    p['rank'] = rank + 1 + i
    p['wave'] = 5 + i // third
data['pages'] = pages + [{k: p[k] for k in ('rank', 'kw', 'slug', 'word', 'region', 'level', 'city', 'sido', 'gu', 'wave')} for p in out]
json.dump(data, open(PAGES, 'w', encoding='utf-8'), ensure_ascii=False, indent=0)

from openpyxl import Workbook
from openpyxl.styles import Font
from openpyxl.utils import get_column_letter
wb = Workbook()
ws = wb.active
ws.title = '키워드'
ws.append(['순번', '키워드', 'URL', '우선순위', '오픈 묶음', '오픈일'])
TIER = {5: '높음', 6: '보통', 7: '낮음'}
for i, p in enumerate(out, 1):
    ws.append([i, p['kw'], f"{DOMAIN}/{p['slug']}/", TIER[p['wave']], p['wave'], DATES[p['wave']]])
for c in ws[1]: c.font = Font(bold=True)
for i, w in enumerate([7, 26, 50, 9, 9, 12], 1): ws.column_dimensions[get_column_letter(i)].width = w
ws.freeze_panes = 'A2'
ws.auto_filter.ref = ws.dimensions
os.makedirs(os.path.dirname(XLSX), exist_ok=True)
wb.save(XLSX)
print('동네', len(cands), '추가', len(out), Counter(p['wave'] for p in out), Counter(p['word'] for p in out))
