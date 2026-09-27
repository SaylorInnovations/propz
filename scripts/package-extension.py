#!/usr/bin/env python3
"""Build allowlisted Chrome, Edge, and Firefox store packages."""
import json
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED

root = Path(__file__).resolve().parents[1]
source = root / 'extension'
manifest = json.loads((source / 'manifest.json').read_text())
firefox_settings = json.loads((source / 'manifest.firefox.json').read_text())
files = ['manifest.json', 'popup.html', 'popup.css', 'popup.js', 'publish.js']
files += sorted(set(manifest['icons'].values()))
for name in files:
    if not (source / name).is_file():
        raise SystemExit(f'Missing required extension file: {name}')
out = root / 'dist' / 'extensions'
out.mkdir(parents=True, exist_ok=True)

targets = {
    'chrome': manifest,
    'edge': manifest,
    'firefox': {
        **manifest,
        'browser_specific_settings': {
            'gecko': firefox_settings['gecko']
        }
    }
}

for target, target_manifest in targets.items():
    archive = out / f'propz-{target}-{manifest["version"]}.zip'
    with ZipFile(archive, 'w', ZIP_DEFLATED) as package:
        for name in files:
            if name == 'manifest.json':
                package.writestr(name, json.dumps(target_manifest, indent=2) + '\n')
            else:
                package.write(source / name, name)
    with ZipFile(archive) as package:
        assert package.testzip() is None
        assert json.loads(package.read('manifest.json')) == target_manifest
    print(f'Built {archive.relative_to(root)}, version {manifest["version"]}, {archive.stat().st_size} bytes')

# Keep the historical Chrome filename for the existing dashboard/update flow.
(root / 'propz-extension.zip').write_bytes((out / f'propz-chrome-{manifest["version"]}.zip').read_bytes())
