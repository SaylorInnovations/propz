import assert from 'node:assert/strict';
import { readFileSync, statSync } from 'node:fs';
import test from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const sourceManifest = require('../extension/manifest.json');
const firefoxSettings = require('../extension/manifest.firefox.json');

test('store package sources and generated archives are complete', () => {
  assert.equal(sourceManifest.manifest_version, 3);
  assert.deepEqual(sourceManifest.permissions, ['storage']);
  assert.equal(firefoxSettings.gecko.id, 'propz@saylorinnovations.com');
  assert.equal(firefoxSettings.gecko.strict_min_version, '140.0');
  assert.deepEqual(
    firefoxSettings.gecko.data_collection_permissions.required,
    ['financialAndPaymentInfo', 'personallyIdentifyingInfo'],
  );
  for (const target of ['chrome', 'edge', 'firefox']) {
    const archive = new URL(`../dist/extensions/propz-${target}-${sourceManifest.version}.zip`, import.meta.url);
    assert.equal(statSync(archive).size > 10000, true, `${target} package should not be empty`);
  }
  assert.equal(readFileSync(new URL('../propz-extension.zip', import.meta.url)).length > 10000, true);
});
