"use client";

import { useMemo, useState } from "react";
import { Brand } from "./components/brand";
import { BoltIcon, CheckIcon, CodeIcon, CopyIcon, ExternalIcon, QrIcon, WalletIcon } from "./components/icons";
import { TipJar } from "./components/tipjar";
import { FEE_PERCENT_LABEL } from "./lib/fee";
import {
  configParams,
  defaultConfig,
  type Accent,
  type TipConfig,
  validEvmAddress,
  validSolanaAddress,
} from "./lib/tip";

type OutputTab = "embed" | "link" | "qr" | "agent";

export default function Studio() {
  const [config, setConfig] = useState<TipConfig>(defaultConfig);
  const [tab, setTab] = useState<OutputTab>("embed");
  const [copied, setCopied] = useState("");

  const origin = typeof window === "undefined" ? "" : window.location.origin;

  const params = useMemo(() => configParams(config).toString(), [config]);
  const jarUrl = `${origin}/jar?${params}`;
  const embedUrl = `${origin}/embed?${params}`;
  const manifestUrl = `${origin}/api/manifest?${params}`;
  const qrUrl = `${origin}/api/qr?${params}`;
  const embedCode = `<iframe src="${embedUrl}" title="Send Propz to ${config.name}" width="100%" height="430" style="border:0;max-width:440px" loading="lazy"></iframe>`;
  const solValid = !config.solana || validSolanaAddress(config.solana);
  const baseValid = !config.base || validEvmAddress(config.base);
  const ready = Boolean(origin && (validSolanaAddress(config.solana) || validEvmAddress(config.base)));

  function update<K extends keyof TipConfig>(key: K, value: TipConfig[K]) {
    setConfig((current) => ({ ...current, [key]: value }));
  }

  async function copy(value: string, label: string) {
    await navigator.clipboard.writeText(value);
    setCopied(label);
    window.setTimeout(() => setCopied(""), 1800);
  }

  return (
    <main>
      <header className="site-header">
        <Brand />
        <nav aria-label="Main navigation">
          <a href="#studio">Studio</a>
          <a href="#how">How it works</a>
          <a href="#developers">Developers</a>
        </nav>
        <a className="header-cta" href="#studio">Build your Propz</a>
      </header>

      <section className="studio-shell" id="studio">
        <div className="studio-intro">
          <div>
            <p className="kicker"><span /> TIP PEOPLE, NOT PLATFORMS</p>
            <h1>Give credit.<br /><em>Send value.</em></h1>
          </div>
          <div className="intro-copy">
            <p><strong>Propz is a simple way to tip your favorite creators, gamers, builders, streamers, artists—or anyone doing work you value.</strong> Send SOL or USDC directly to their wallet with no payout delay. Propz keeps a flat {FEE_PERCENT_LABEL} to keep the platform running — the rest goes straight to them.</p>
            <div className="audience-list" aria-label="Who Propz is for">
              <span>CREATORS</span><span>GAMERS</span><span>BUILDERS</span><span>STREAMERS</span><span>ANYONE</span>
            </div>
          </div>
        </div>

        <div className="studio-grid">
          <section className="builder-panel" aria-labelledby="builder-title">
            <div className="panel-heading">
              <span>01</span>
              <div><p className="eyebrow">PROPZ STUDIO</p><h2 id="builder-title">Build your support card</h2></div>
              <span className="live-pill"><i /> LIVE PREVIEW</span>
            </div>

            <div className="form-section">
              <div className="section-label"><span>PROFILE</span><i /></div>
              <div className="field-row">
                <label>Display name
                  <input maxLength={48} onChange={(event) => update("name", event.target.value)} placeholder="Your name or project" value={config.name === defaultConfig.name ? "" : config.name} />
                </label>
                <label>Button text
                  <input maxLength={28} onChange={(event) => update("button", event.target.value)} placeholder="Send Propz" value={config.button} />
                </label>
              </div>
              <label>Support message
                <textarea maxLength={180} onChange={(event) => update("message", event.target.value)} rows={3} value={config.message} />
                <small>{config.message.length}/180</small>
              </label>
            </div>

            <div className="form-section">
              <div className="section-label"><span>RECEIVING WALLETS</span><i /></div>
              <label className={!solValid ? "has-error" : ""}>
                <span className="field-title"><b className="chain-mark sol">S</b> Solana address</span>
                <input autoCapitalize="off" autoCorrect="off" onChange={(event) => update("solana", event.target.value.trim())} placeholder="Accept SOL and USDC" spellCheck={false} value={config.solana} />
                {!solValid && <small>Enter a valid Solana public address.</small>}
              </label>
              <label className={!baseValid ? "has-error" : ""}>
                <span className="field-title"><b className="chain-mark base">B</b> Base address</span>
                <input autoCapitalize="off" autoCorrect="off" onChange={(event) => update("base", event.target.value.trim())} placeholder="0x... — accept USDC on Base" spellCheck={false} value={config.base} />
                {!baseValid && <small>Enter a valid 0x public address.</small>}
              </label>
              <p className="safety-note"><WalletIcon /> Public receiving addresses only. Never enter a seed phrase or private key.</p>
            </div>

            <div className="form-section style-row">
              <div>
                <div className="section-label"><span>ACCENT</span><i /></div>
                <div className="swatches" aria-label="Accent color">
                  {(["cyan", "green", "amber", "violet"] as Accent[]).map((accent) => (
                    <button aria-label={`${accent} accent`} aria-pressed={config.accent === accent} className={`swatch ${accent} ${config.accent === accent ? "active" : ""}`} key={accent} onClick={() => update("accent", accent)} type="button" />
                  ))}
                </div>
              </div>
              <div className="network-status">
                <span><i className={validSolanaAddress(config.solana) ? "on" : ""} /> Solana</span>
                <span><i className={validEvmAddress(config.base) ? "on" : ""} /> Base</span>
              </div>
            </div>
          </section>

          <aside className="preview-panel">
            <div className="preview-label"><span>LIVE PREVIEW</span><i /></div>
            <TipJar config={config} previewOnly />
            <p className="preview-note">Supporters choose an amount, approve it in their wallet, and send it directly to you.</p>
          </aside>
        </div>

        <section className={`output-panel ${ready ? "ready" : ""}`}>
          <div className="output-copy">
            <p className="eyebrow">02 · PUBLISH</p>
            <h2>Your Propz link, ready to ship.</h2>
            <p>Add at least one valid public wallet address, then copy the embed or hosted link.</p>
          </div>
          <div className="output-box">
            <div className="output-tabs" role="tablist" aria-label="Publish options">
              <button className={tab === "embed" ? "active" : ""} onClick={() => setTab("embed")} type="button"><CodeIcon /> Embed</button>
              <button className={tab === "link" ? "active" : ""} onClick={() => setTab("link")} type="button"><ExternalIcon /> Hosted link</button>
              <button className={tab === "qr" ? "active" : ""} onClick={() => setTab("qr")} type="button"><QrIcon /> QR image</button>
              <button className={tab === "agent" ? "active" : ""} onClick={() => setTab("agent")} type="button"><BoltIcon /> Agent JSON</button>
            </div>
            {ready && tab === "qr" && (
              <div className="qr-output-preview">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt={`Propz QR code for ${config.name}`} src={qrUrl} />
                <p>A static image — drop it into a video overlay, thumbnail, or printed material. The link inside never expires.</p>
              </div>
            )}
            <div className="code-output">
              <code>{!ready ? "Add a valid Solana or Base wallet above to generate your publish code." : tab === "embed" ? embedCode : tab === "link" ? jarUrl : tab === "qr" ? qrUrl : manifestUrl}</code>
              <button disabled={!ready} onClick={() => copy(tab === "embed" ? embedCode : tab === "link" ? jarUrl : tab === "qr" ? qrUrl : manifestUrl, tab)} type="button">
                {copied === tab ? <CheckIcon /> : <CopyIcon />}{copied === tab ? "Copied" : "Copy"}
              </button>
            </div>
            {ready && tab === "qr" && (
              <a className="qr-download" href={qrUrl} download={`propz-${config.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase() || "qr"}.png`}>
                <ExternalIcon /> Download PNG
              </a>
            )}
            <div className="output-actions">
              <span><CheckIcon /> No signup required</span>
              <span>{FEE_PERCENT_LABEL} platform fee — keeps Propz running</span>
              <a className={!ready ? "disabled" : ""} href={ready ? jarUrl : undefined} rel="noreferrer" target="_blank">Open full page <ExternalIcon /></a>
            </div>
          </div>
        </section>
      </section>

      <section className="how-section" id="how">
        <div className="section-heading">
          <p className="kicker"><span /> BUILT FOR TRUST</p>
          <h2>Tip the people making<br />the internet worth using.</h2>
          <p>Whether they create, play, teach, stream, design, code, or build, Propz gives you a direct way to support their work.</p>
        </div>
        <div className="steps">
          <article><span>01</span><WalletIcon /><h3>Creators add a wallet</h3><p>They publish a Solana, Base, or multi-chain Propz link. Private keys never enter the product.</p></article>
          <article><span>02</span><CodeIcon /><h3>Supporters choose a tip</h3><p>Pick SOL or USDC, choose an amount, and review the request in your own wallet.</p></article>
          <article><span>03</span><BoltIcon /><h3>Value moves directly</h3><p>The tip settles straight to the recipient, minus Propz&apos;s disclosed {FEE_PERCENT_LABEL} fee. Propz never holds the funds — every wallet touched is written into the transaction the supporter signs.</p></article>
        </div>
      </section>

      <section className="developer-section" id="developers">
        <div className="developer-copy">
          <p className="kicker"><span /> AGENT-READY PAYMENTS</p>
          <h2>Humans see appreciation.<br />Agents see an interface.</h2>
          <p>Every Propz card exposes a machine-readable manifest describing its supported networks, assets, recipients, and payment links. No screen scraping required.</p>
          <ul>
            <li><CheckIcon /> Deterministic JSON manifest</li>
            <li><CheckIcon /> Explicit chain and token identifiers</li>
            <li><CheckIcon /> Wallet-policy friendly amounts</li>
          </ul>
        </div>
        <div className="manifest-card">
          <div className="manifest-top"><span>payment-manifest.json</span><i>LIVE</i></div>
          <pre>{`{
  "protocol": "propz/1",
  "recipient": "Your name",
  "noncustodial": true,
  "platformFeeBps": 8,
  "payments": [
    {
      "network": "solana:mainnet",
      "asset": "USDC",
      "decimals": 6
    },
    {
      "network": "eip155:8453",
      "asset": "USDC",
      "decimals": 6
    }
  ]
}`}</pre>
          <div className="manifest-foot"><span>GET</span> /api/manifest</div>
        </div>
      </section>

      <section className="final-cta">
        <div><p className="eyebrow">CREATORS · GAMERS · BUILDERS · EVERYONE</p><h2>Give your community a direct way to show support.</h2></div>
        <a href="#studio">Build your Propz <ExternalIcon /></a>
      </section>

      <footer>
        <Brand />
        <p>A Saylor Innovations product.</p>
        <span>Never share your private keys.</span>
      </footer>
    </main>
  );
}
