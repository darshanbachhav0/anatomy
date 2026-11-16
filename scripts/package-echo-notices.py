"""Attach required notices to the existing local Echo source excerpt.

Python standard library only. Never publishes or grants distribution permission.
All original archive entries are preserved byte-for-byte; this is not a full app export.
"""
from pathlib import Path
import hashlib
import json
import os
import zipfile

ROOT = Path(__file__).resolve().parents[1]
ARCHIVE = ROOT / 'outputs/ecocardiografia-codigo-completo.zip'
if not ARCHIVE.is_file():
    raise SystemExit('Original local Echo archive is absent; no new app export was created.')

with zipfile.ZipFile(ARCHIVE) as original:
    entries = {info.filename: original.read(info) for info in original.infolist()}
    if original.testzip() is not None:
        raise SystemExit('Original ZIP failed integrity verification.')

files = [
    'COPYRIGHT.md', 'compliance/rights-register.json',
    'public/echo/ADAPTACION-UMA.md', 'public/echo/assets/ATTRIBUTION.txt',
    'public/echo/assets/credits.json', 'public/echo/assets/media/catalog.json',
    'public/echo/assets/THREE-LICENSE.txt', 'public/echo/assets/Michroma-OFL.txt',
    'public/echo/credits.html', 'public/echo/credits.js', 'public/echo/credits.css',
    'public/atlas/ATRIBUCION.md', 'public/atlas/LICENSE.txt',
    'public/third-party-notices/THIRD_PARTY_NOTICES.txt',
    'public/third-party-notices/manifest.json',
    'public/licenses/third-party-sources.json',
]
additions = {file: (ROOT / file).read_bytes() for file in files}
for folder in ['public/licenses', 'public/third-party-notices/licenses']:
    for file in (ROOT / folder).glob('*.txt'):
        additions[file.relative_to(ROOT).as_posix()] = file.read_bytes()
additions['COPYRIGHT-EXPORT-STATUS.txt'] = (
    'LOCAL SOURCE EXCERPT WITH RIGHTS NOTICES — NOT A CLEARED DISTRIBUTION\n\n'
    'The original eight source entries are an older partial snapshot, preserved unchanged.\n'
    'This archive does not contain the complete simulator, model/media dependencies or original author source.\n'
    'Added notices describe component rights; they do not license proprietary EchoSuite code.\n'
    'The actual author permission and exact native-anatomy provenance remain unverified.\n'
    'Do not treat possession of this archive as authorization to publish, sell or redistribute it.\n'
    'See COPYRIGHT.md, the credits and compliance/rights-register.json before any external transfer.\n'
).encode('utf-8')
baseline = {name: hashlib.sha256(data).hexdigest() for name, data in entries.items() if name not in additions and name != 'COPYRIGHT-EXPORT-PRESERVED.json'}
additions['COPYRIGHT-EXPORT-PRESERVED.json'] = (json.dumps(baseline, indent=2, sort_keys=True) + '\n').encode()
merged = entries | additions
temporary = ARCHIVE.with_suffix('.notices.tmp')
with zipfile.ZipFile(temporary, 'w', zipfile.ZIP_DEFLATED) as output:
    for name, data in sorted(merged.items()):
        output.writestr(name, data)
with zipfile.ZipFile(temporary) as output:
    assert output.testzip() is None
    for name, expected in baseline.items():
        assert hashlib.sha256(output.read(name)).hexdigest() == expected, name
os.replace(temporary, ARCHIVE)
print(f'Added rights notices to local Echo excerpt; preserved {len(baseline)} pre-existing entries unchanged. No release permission inferred.')
