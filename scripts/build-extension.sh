#!/usr/bin/env bash
# Packages extension/ into the zips each store submission actually needs.
#
# Two variants exist because Firefox's manifest_version 3 support runs the
# background script as a scripts-array event page, not a true service
# worker the way Chrome/Edge do — everything else in the extension (the
# chrome.* namespace, scripting.executeScript with world:"MAIN",
# webNavigation) is identical across all of them, so one source tree with
# two manifests is enough; there's no Firefox-specific *.js anywhere.
#
#   dist-store/propz-extension-store.zip     Chrome Web Store, Edge Add-ons,
#                                             and the Gumroad mirror all use
#                                             this same package — Edge is
#                                             Chromium/MV3-compatible and
#                                             Gumroad users just load it
#                                             unpacked, so neither needs its
#                                             own build.
#   dist-store/propz-extension-firefox.zip   Firefox Add-ons (AMO) only.
#
# Run from the repo root: bash scripts/build-extension.sh
set -euo pipefail

cd "$(dirname "$0")/.."
SRC="extension"
OUT="dist-store"
rm -rf "$OUT"
mkdir -p "$OUT"

# Files that ship inside the extension itself — README.md, manifest.firefox.json,
# and store/ are repo-side docs/source, not runtime files, so they're left out.
RUNTIME_FILES=(
  background.js
  content.js
  manifest.json
  onboarding.html
  onboarding.js
  popup.html
  popup.js
  shared.css
  validators.js
  icons
)

build_zip() {
  local out_name="$1"
  local manifest_src="$2"
  local work
  work="$(mktemp -d)"
  trap 'rm -rf "$work"' RETURN

  for f in "${RUNTIME_FILES[@]}"; do
    cp -r "$SRC/$f" "$work/$f"
  done
  cp "$SRC/$manifest_src" "$work/manifest.json"

  (cd "$work" && zip -qr "$OLDPWD/$OUT/$out_name" .)
  echo "Built $OUT/$out_name"
}

build_zip "propz-extension-store.zip" "manifest.json"
build_zip "propz-extension-firefox.zip" "manifest.firefox.json"
