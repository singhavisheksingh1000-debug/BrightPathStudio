import json
import re
import subprocess
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path('blog')
OUT = ROOT / 'posts.json'


def clean(value):
    value = re.sub(r'<[^>]+>', ' ', value or '')
    return (value.replace('&amp;', '&').replace('&#39;', "'").replace('&quot;', '"')
            .replace('&nbsp;', ' ').strip())


def first(patterns, text):
    for pattern in patterns:
        match = re.search(pattern, text, re.I | re.S)
        if match:
            return clean(match.group(1))
    return ''

posts = []
for path in ROOT.rglob('*.html'):
    if path.name.lower() == 'index.html':
        continue
    text = path.read_text(encoding='utf-8', errors='ignore')
    title = first([r'<title[^>]*>(.*?)</title>'], text) or path.stem.replace('-', ' ').title()
    description = first([
        r'<meta[^>]+name=["\']description["\'][^>]+content=["\'](.*?)["\']',
        r'<meta[^>]+content=["\'](.*?)["\'][^>]+name=["\']description["\']'
    ], text) or 'Practical ideas and guides from BrightPathStudio.'
    image = first([
        r'<meta[^>]+(?:property|name)=["\'](?:og:image|twitter:image)["\'][^>]+content=["\'](.*?)["\']',
        r'<img[^>]+src=["\'](.*?)["\']'
    ], text)
    eyebrow = first([r'<(?:span|div)[^>]*class=["\'][^"\']*eyebrow[^"\']*["\'][^>]*>(.*?)</(?:span|div)>'], text)
    category = eyebrow.split('•')[0].strip() if eyebrow else 'BrightPathStudio Journal'
    try:
        iso = subprocess.check_output(['git', 'log', '-1', '--format=%cI', '--', path.as_posix()], text=True).strip()
        dt = datetime.fromisoformat(iso.replace('Z', '+00:00'))
    except Exception:
        dt = datetime.now(timezone.utc)
    words = len(re.findall(r"\b[\w’'-]+\b", re.sub(r'<[^>]+>', ' ', text)))
    posts.append({
        'title': title,
        'description': description,
        'category': category,
        'image': image,
        'url': '/' + path.as_posix(),
        'date': dt.astimezone(timezone.utc).isoformat(),
        'readTime': max(3, round(words / 220))
    })

posts.sort(key=lambda item: item['date'], reverse=True)
OUT.write_text(json.dumps({
    'updatedAt': datetime.now(timezone.utc).isoformat(),
    'posts': posts
}, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f'Generated {len(posts)} blog posts.')
