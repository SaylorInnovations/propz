import assert from 'node:assert/strict';
import test from 'node:test';
import { DEFAULTS, publishOutputs, validationError } from '../extension/publish.js';

const cfg = { ...DEFAULTS, base: '0x1111111111111111111111111111111111111111', name: 'Creator' };
test('requires a receiving wallet and rejects invalid optional wallets', () => {
  assert.ok(validationError(DEFAULTS));
  assert.equal(publishOutputs(DEFAULTS), null);
  assert.equal(validationError(cfg), '');
  assert.equal(publishOutputs({ ...cfg, sol: 'invalid' }), null);
  assert.equal(publishOutputs({ ...cfg, base: '0x123' }), null);
  assert.ok(publishOutputs({ ...DEFAULTS, sol: '11111111111111111111111111111111' }));
});
test('all formats preserve the creator recipient and card settings', () => {
  const card = { ...cfg, message: 'Thanks & welcome!', accent: 'violet' };
  const outputs = publishOutputs(card);
  const url = new URL(outputs.link);
  assert.equal(url.origin, 'https://propz.saylorinnovations.com');
  assert.equal(url.pathname, '/jar');
  assert.equal(url.searchParams.get('base'), cfg.base);
  assert.equal(url.searchParams.get('message'), card.message);
  assert.equal(url.searchParams.get('accent'), 'violet');
  assert.match(outputs.widget, /data-base="0x1111111111111111111111111111111111111111"/);
  assert.match(outputs.embed, /\/embed\?/);
});
test('untrusted text cannot escape HTML attributes or script tags', () => {
  const attack = '\"><script>alert(1)</script>&quot;';
  const outputs = publishOutputs({ ...cfg, name: attack, button: attack });
  assert.equal((outputs.widget.match(/<script/g) || []).length, 1);
  assert.equal((outputs.widget.match(/<\/script>/g) || []).length, 1);
  assert.ok(!outputs.embed.includes('<script>'));
  assert.match(outputs.widget, /&quot;&gt;&lt;script&gt;/);
  assert.match(outputs.embed, /&amp;quot;/);
  assert.equal(new URL(outputs.link).searchParams.get('name'), attack);
});
