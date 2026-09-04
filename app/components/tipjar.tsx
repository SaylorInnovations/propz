"use client";

import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import {
  BASE_USDC,
  basePayUri,
  coinbaseWalletDeepLink,
  inAppBrowserName,
  metamaskDeepLink,
  phantomBrowseUrl,
  shortAddress,
  solanaPayUrl,
  type TipConfig,
  validEvmAddress,
  validSolanaAddress,
} from "../lib/tip";
import { FEE_PERCENT_LABEL, PROPZ_FEE_BASE, splitUnits } from "../lib/fee";
import { CheckIcon, CopyIcon, ExternalIcon, WalletIcon } from "./icons";

type Asset = "USDC_SOL" | "SOL" | "USDC_BASE";

type EthereumProvider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
};

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

export function TipJar({
  config,
  compact = false,
  previewOnly = false,
}: {
  config: TipConfig;
  compact?: boolean;
  previewOnly?: boolean;
}) {
  const solReady = validSolanaAddress(config.solana);
  const baseReady = validEvmAddress(config.base);
  const [asset, setAsset] = useState<Asset>(solReady ? "USDC_SOL" : "USDC_BASE");
  const [amount, setAmount] = useState("5");
  const [custom, setCustom] = useState("");
  const [qr, setQr] = useState("");
  const [status, setStatus] = useState<"idle" | "paying" | "success" | "error">("idle");
  const [notice, setNotice] = useState("");
  const [transaction, setTransaction] = useState("");

  const effectiveAsset: Asset =
    asset === "USDC_BASE" && !baseReady && solReady
      ? "USDC_SOL"
      : (asset === "USDC_SOL" || asset === "SOL") && !solReady && baseReady
        ? "USDC_BASE"
        : asset;

  const options = useMemo(
    () => effectiveAsset === "SOL" ? ["0.01", "0.05", "0.1", "0.25"] : ["1", "5", "10", "25"],
    [effectiveAsset],
  );

  function selectAsset(next: Asset) {
    setAsset(next);
    setAmount(next === "SOL" ? "0.05" : "5");
    setCustom("");
    setStatus("idle");
    setNotice("");
    setTransaction("");
  }

  const pageUrl = typeof window === "undefined" ? "" : window.location.href;
  const pageOrigin = typeof window === "undefined" ? "" : window.location.origin;
  const appName = typeof navigator === "undefined" ? "" : inAppBrowserName(navigator.userAgent);

  const finalAmount = custom || amount;
  const numericAmount = Number(finalAmount);
  const validAmount = numericAmount > 0 && numericAmount <= 1_000_000 && Number.isFinite(numericAmount);
  const displayName = config.name.trim() || "Your name";
  const paymentUri = useMemo(() => {
    if (!validAmount) return "";
    if (effectiveAsset === "USDC_BASE" && baseReady) return basePayUri(config.base, finalAmount);
    if ((effectiveAsset === "USDC_SOL" || effectiveAsset === "SOL") && solReady) {
      return solanaPayUrl(config.solana, finalAmount, effectiveAsset === "SOL" ? "SOL" : "USDC", displayName, pageOrigin);
    }
    return "";
  }, [baseReady, config.base, config.solana, displayName, effectiveAsset, finalAmount, pageOrigin, solReady, validAmount]);

  useEffect(() => {
    let active = true;
    if (!paymentUri) return;
    QRCode.toDataURL(paymentUri, {
      width: compact ? 190 : 240,
      margin: 2,
      color: { dark: "#071114", light: "#ffffff" },
      errorCorrectionLevel: "M",
    }).then((value) => active && setQr(value));
    return () => { active = false; };
  }, [compact, paymentUri]);

  async function copyRecipient() {
    const value = effectiveAsset === "USDC_BASE" ? config.base : config.solana;
    await navigator.clipboard.writeText(value);
    setNotice("Address copied");
    window.setTimeout(() => setNotice(""), 1800);
  }

  async function payBase() {
    if (previewOnly) return;
    if (!window.ethereum) {
      setStatus("error");
      setNotice("No wallet extension found — use a link below, or scan the QR code.");
      return;
    }
    // Tracked locally (not via the `transaction` state var) because a
    // second `await` sits between setting it and the catch block below —
    // state set during this same call hasn't necessarily flushed yet.
    let creatorHash = "";
    try {
      setStatus("paying");
      setNotice("Confirm the payment in your wallet.");
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x2105" }],
        });
      } catch (switchError) {
        const code = typeof switchError === "object" && switchError !== null && "code" in switchError
          ? Number((switchError as { code: unknown }).code)
          : 0;
        if (code !== 4902) throw switchError;
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [{
            chainId: "0x2105",
            chainName: "Base",
            nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
            rpcUrls: ["https://mainnet.base.org"],
            blockExplorerUrls: ["https://basescan.org"],
          }],
        });
      }
      const accounts = (await window.ethereum.request({ method: "eth_requestAccounts" })) as string[];
      const from = accounts[0];
      if (!from) throw new Error("Wallet connection was not approved.");

      const totalUnits = BigInt(Math.round(Number(finalAmount) * 1_000_000));
      const { creatorUnits, feeUnits } = splitUnits(totalUnits);
      const transferData = (to: string, units: bigint) => {
        const addressWord = to.toLowerCase().replace(/^0x/, "").padStart(64, "0");
        const amountWord = units.toString(16).padStart(64, "0");
        return `0xa9059cbb${addressWord}${amountWord}`;
      };

      // Base has no single-signature way to split a USDC transfer, so this
      // is two sequential wallet approvals. The recipient's cut goes first
      // on purpose: if the supporter declines the second prompt, the
      // creator has still been paid in full and only the platform fee
      // (below) is skipped for that tip.
      setNotice("Confirm your tip to the recipient.");
      creatorHash = (await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [{ from, to: BASE_USDC, value: "0x0", data: transferData(config.base, creatorUnits) }],
      })) as string;
      setTransaction(creatorHash);

      if (feeUnits > BigInt(0)) {
        setNotice(`Tip sent. Confirm the ${FEE_PERCENT_LABEL} Propz platform fee.`);
        await window.ethereum.request({
          method: "eth_sendTransaction",
          params: [{ from, to: BASE_USDC, value: "0x0", data: transferData(PROPZ_FEE_BASE, feeUnits) }],
        });
      }

      setStatus("success");
      setNotice("Payment submitted on Base.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "The wallet rejected the payment.";
      if (creatorHash) {
        setStatus("success");
        setNotice("Your tip went through — the platform fee step was skipped.");
      } else {
        setStatus("error");
        setNotice(message);
      }
    }
  }

  const recipient = effectiveAsset === "USDC_BASE" ? config.base : config.solana;
  const networkName = effectiveAsset === "USDC_BASE" ? "Base" : "Solana";
  const assetName = effectiveAsset === "SOL" ? "SOL" : "USDC";
  const configured = solReady || baseReady;

  return (
    <section className={`tip-card accent-${config.accent} ${compact ? "tip-card-compact" : ""}`}>
      <div className="tip-glow" aria-hidden="true" />
      <div className="tip-head">
        <div className="recipient-avatar">{displayName.slice(0, 1).toUpperCase()}</div>
        <div>
          <p className="eyebrow">PROPZ · DIRECT TO WALLET</p>
          <h1>{displayName}</h1>
        </div>
      </div>
      <p className="tip-message">{config.message}</p>

      {!configured ? (
        <div className="empty-wallet">
          <WalletIcon />
          <div><strong>Add a receiving wallet</strong><span>Your live preview will appear here.</span></div>
        </div>
      ) : (
        <>
          <div className="asset-tabs" role="tablist" aria-label="Payment method">
            {solReady && (
              <>
                <button className={effectiveAsset === "USDC_SOL" ? "active" : ""} onClick={() => selectAsset("USDC_SOL")} type="button">USDC <span>Solana</span></button>
                <button className={effectiveAsset === "SOL" ? "active" : ""} onClick={() => selectAsset("SOL")} type="button">SOL <span>Solana</span></button>
              </>
            )}
            {baseReady && <button className={effectiveAsset === "USDC_BASE" ? "active" : ""} onClick={() => selectAsset("USDC_BASE")} type="button">USDC <span>Base</span></button>}
          </div>

          <div className="amount-grid" aria-label="Choose tip amount">
            {options.map((value) => (
              <button className={!custom && amount === value ? "active" : ""} key={value} onClick={() => { setAmount(value); setCustom(""); }} type="button">
                {effectiveAsset === "SOL" ? value : `$${value}`}
              </button>
            ))}
          </div>

          <label className="custom-amount">
            <span>{effectiveAsset === "SOL" ? "SOL" : "$"}</span>
            <input aria-label="Custom tip amount" inputMode="decimal" min="0" onChange={(event) => setCustom(event.target.value.replace(/[^0-9.]/g, ""))} placeholder="Custom amount" type="text" value={custom} />
            <small>{assetName}</small>
          </label>

          {!compact && paymentUri && qr && (
            <div className="qr-panel">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt={`QR code to tip ${finalAmount} ${assetName} on ${networkName}`} src={qr} />
              <div>
                <strong>Scan with your wallet</strong>
                <span>{finalAmount} {assetName} on {networkName}</span>
                <button onClick={copyRecipient} type="button"><CopyIcon /> {shortAddress(recipient)}</button>
                {effectiveAsset === "USDC_BASE" && (
                  <small className="qr-fee-note">Scanning sends the full amount directly — the {FEE_PERCENT_LABEL} fee only applies through the button below.</small>
                )}
              </div>
            </div>
          )}

          {effectiveAsset === "USDC_BASE" ? (
            <button className="pay-button" disabled={!validAmount || status === "paying" || previewOnly} onClick={payBase} type="button">
              <WalletIcon />{previewOnly ? config.button : status === "paying" ? "Waiting for wallet" : `${config.button} · ${finalAmount || "0"} USDC`}
            </button>
          ) : (
            <a aria-disabled={!validAmount || previewOnly} className={`pay-button ${!validAmount || previewOnly ? "disabled" : ""}`} href={!validAmount || previewOnly ? undefined : paymentUri}>
              <WalletIcon />{previewOnly ? config.button : `${config.button} · ${finalAmount || "0"} ${assetName}`}
            </a>
          )}

          {!previewOnly && pageUrl && (
            <p className="wallet-fallback">
              {effectiveAsset === "USDC_BASE" ? (
                <>
                  <span>{appName ? `${appName} blocks wallet popups —` : "No wallet extension?"}</span>
                  <a href={metamaskDeepLink(pageUrl)}>Open in MetaMask</a>
                  <span className="sep">·</span>
                  <a href={coinbaseWalletDeepLink(pageUrl)}>Coinbase Wallet</a>
                </>
              ) : (
                <>
                  <span>{appName ? `Links may not open inside ${appName} —` : "Button not opening your wallet?"}</span>
                  <a href={phantomBrowseUrl(pageUrl)}>Open in Phantom</a>
                </>
              )}
            </p>
          )}

          {notice && <p className={`payment-notice ${status}`}>{notice}</p>}
          {transaction && <a className="receipt-link" href={`https://basescan.org/tx/${transaction}`} rel="noreferrer" target="_blank"><CheckIcon /> View transaction <ExternalIcon /></a>}

          <div className="tip-foot">
            <span>{FEE_PERCENT_LABEL} platform fee, rest goes straight to {displayName}</span>
            <button onClick={copyRecipient} type="button"><CopyIcon /> Copy address</button>
          </div>
        </>
      )}
    </section>
  );
}
