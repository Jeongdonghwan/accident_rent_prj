"""OG 카드 생성: public/og/<slug>.jpg + home.jpg + area.jpg (1200x630, JPEG 80).
배경 = 차량 참고 사진(public/img, data/photo_credits.json)을 어둡게. 사진은 슬러그 해시로 고르며
lib/photos.ts 의 heroPhoto() 와 같은 규칙 → 페이지 히어로와 og 썸네일이 같은 사진.
글자는 가운데 630x630 안전영역(x 285~915) 안에 — 네이버가 정사각형으로 잘라 보여 준다.
사용: python -I scripts/make_og.py [--force]   (브랜드·전화는 lib/site.ts에서 읽음)"""
import json, re, sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageEnhance

ROOT = Path(__file__).resolve().parent.parent
W, H = 1200, 630
SAFE_L, SAFE_W = 300, 600  # 안전영역 안쪽 여백 15px
ACCENT, SOFT, INK = '#f2a516', '#f7d48a', (14, 22, 33)  # globals.css --amber / 옅은 앰버 / --ink
LABEL = 'ACCIDENT REPLACEMENT CAR'
FORCE = '--force' in sys.argv

site = (ROOT / 'lib/site.ts').read_text(encoding='utf-8')
BRAND = re.search(r"BRAND = '([^']+)'", site).group(1)
PHONE = re.search(r"phone: '([^']+)'", site).group(1)
PHOTOS = json.loads((ROOT / 'data/photo_credits.json').read_text(encoding='utf-8'))['photos']
_fonts = {}
def font(bold, size):
    k = (bold, size)
    if k not in _fonts:
        _fonts[k] = ImageFont.truetype('C:/Windows/Fonts/' + ('malgunbd.ttf' if bold else 'malgun.ttf'), size)
    return _fonts[k]

def fnv(s):  # lib/data.ts hash() 와 같음 (FNV-1a 32bit, UTF-16 코드 단위)
    b, h = s.encode('utf-16-le'), 2166136261
    for i in range(0, len(b), 2):
        h ^= b[i] | b[i + 1] << 8; h = (h * 16777619) & 0xFFFFFFFF
    return h

def hero_photo(slug, kw):  # lib/photos.ts heroPool/heroPhoto 와 같음
    kinds = ['import', 'sedan', 'suv'] if re.search('수입|외제', kw) else ['road', 'sedan', 'suv', 'import']
    pool = [p for p in PHOTOS if p['kind'] in kinds]
    return pool[fnv(f'{slug}::hero') % len(pool)]['file']

def fit(title):
    """| 로 줄 지정. 한 줄 → 안 되면 두 줄(마지막 공백 또는 가운데 글자에서). (줄들, 크기)"""
    if '|' in title:
        a, b = title.split('|')
        for size in range(84, 43, -4):
            if all(font(True, size).getlength(l) <= SAFE_W for l in (a, b)): return [a, b], size
    for size in range(92, 59, -4):
        if font(True, size).getlength(title) <= SAFE_W: return [title], size
    if ' ' in title: a, b = title.rsplit(' ', 1)
    else: a, b = title[:(len(title) + 1) // 2], title[(len(title) + 1) // 2:]
    for size in range(84, 43, -4):
        if all(font(True, size).getlength(l) <= SAFE_W for l in (a, b)): return [a, b], size
    return [a, b], 44

def card(title, photo, out):
    if out.exists() and not FORCE: return 0
    im = Image.open(ROOT / 'public/img' / photo).convert('RGB')
    s = max(W / im.width, H / im.height); im = im.resize((int(im.width * s) + 1, int(im.height * s) + 1), Image.LANCZOS)
    l, t = (im.width - W) // 2, (im.height - H) // 2
    im = ImageEnhance.Brightness(im.crop((l, t, l + W, t + H))).enhance(0.55)
    im = Image.blend(im, Image.new('RGB', (W, H), INK), 0.45)  # 남색 덮개
    d = ImageDraw.Draw(im)
    d.rectangle((SAFE_L - 15, 130, SAFE_L - 5, 520), fill=ACCENT)  # 안전영역 왼쪽 경계 막대
    d.text((SAFE_L + 4, 136), LABEL, font=font(False, 22), fill=SOFT)
    lines, size = fit(title)
    y = 292 - len(lines) * size * 0.62
    for ln in lines:
        d.text((SAFE_L, y), ln, font=font(True, size), fill='#ffffff'); y += size * 1.2
    d.text((SAFE_L + 2, 444), BRAND, font=font(True, 32), fill='#ffffff')
    d.text((SAFE_L + 2, 484), PHONE, font=font(True, 30), fill=SOFT)
    im.save(out, 'JPEG', quality=80, optimize=True, progressive=True)
    return 1

if __name__ == '__main__':
    assert fnv('abc') == 440920331 and fnv('청주 사고대차::hero') == 2691031612  # JS hash() 값과 대조
    od = ROOT / 'public/og'
    od.mkdir(parents=True, exist_ok=True)
    pages = json.loads((ROOT / 'data/site-pages.json').read_text(encoding='utf-8'))['pages']
    n = card('사고 난 날,|같은 급 차로 바로', 'road-04.jpg', od / 'home.jpg') + card('지역별 사고대차 안내', 'road-05.jpg', od / 'area.jpg')
    for p in pages:
        if not p.get('variantOf'):  # 변형 페이지는 대표 페이지 이미지를 쓴다
            n += card(p['kw'], hero_photo(p['slug'], p['kw']), od / f"{p['slug']}.jpg")
    print(n, 'cards ->', od)
