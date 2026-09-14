#!/usr/bin/env python3
"""Build an allowlisted Chrome Web Store ZIP from current runtime files."""
import json
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED

root = Path(__file__).resolve().parents[1]
source = root / 'extension'
manifest = json.loads((source / 'manifest.json').read_text())
files = ['manifest.json', 'popup.html', 'popup.css', 'popup.js', 'publish.js']
files += sorted(set(manifest['icons'].values()))
for name in files:
    if not (source / name).is_file():
        raise SystemExit(f'Missing required extension file: {name}')
archive = root / 'propz-extension.zip'
with ZipFile(archive, 'w', ZIP_DEFLATED) as package:
    for name in files:
        package.write(source / name, name)
with ZipFile(archive) as package:
    assert package.testzip() is None
    assert json.loads(package.read('manifest.json')) == manifest
print(f'Built {archive.name}, version {manifest["version"]}, {archive.stat().st_size} bytes')
