import assert from "node:assert/strict";
import test from "node:test";

async function loadWorker() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${Math.random()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker;
}

const env = {
  ASSETS: {
    fetch: async () => new Response("Not found", { status: 404 }),
  },
};

const ctx = {
  waitUntil() {},
  passThroughOnException() {},
};

test("renders the Propz creator studio and social metadata", async () => {
  const worker = await loadWorker();
  const response = await worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    env,
    ctx,
  );
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  assert.match(html, /<title>Propz — Give credit\. Send value\.<\/title>/);
  assert.match(html, /Give credit\./);
  assert.match(html, /https:\/\/propz\.saylorinnovations\.chatgpt\.site\/og\.png/);
  assert.doesNotMatch(html, /codex-preview/);
});

test("returns a machine-readable multi-chain payment manifest", async () => {
  const worker = await loadWorker();
  const query = new URLSearchParams({
    name: "Saylor Innovations",
    sol: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    base: "0x1111111111111111111111111111111111111111",
  });
  const response = await worker.fetch(
    new Request(`http://localhost/api/manifest?${query}`),
    env,
    ctx,
  );
  const manifest = await response.json();

  assert.equal(response.status, 200);
  assert.equal(manifest.protocol, "propz/1");
  assert.equal(manifest.recipient, "Saylor Innovations");
  assert.equal(manifest.noncustodial, true);
  assert.equal(manifest.platformFeeBps, 8);
  assert.equal(manifest.payments.length, 3);
  assert.deepEqual(
    manifest.payments.map((payment) => payment.network),
    ["solana:mainnet", "solana:mainnet", "eip155:8453"],
  );
});
