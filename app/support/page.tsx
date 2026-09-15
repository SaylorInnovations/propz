import { Brand } from "../components/brand";

export const metadata = { title: "Propz — Support" };

export default function SupportPage() {
  return (
    <main className="policy-page">
      <header className="jar-header"><Brand /><span>SUPPORT</span></header>
      <article className="policy-body">
        <h1>Support</h1>
        <p>Propz is a small, non-custodial tool — there&apos;s no account or dashboard to look you up, so the fastest way to get help is email with as much detail as you can include.</p>
        <p>Email <a href="mailto:Dave@saylorinnovations.com">Dave@saylorinnovations.com</a> and, where relevant, include your jar&apos;s creator name or wallet address, the network (Solana or Base), and the transaction signature or hash.</p>

        <h2>A tip isn&apos;t showing up</h2>
        <p>Propz never holds funds, so a completed transaction settles directly between the supporter&apos;s wallet and the creator&apos;s wallet — there is nothing on the Propz side that can delay or withhold it. Check the transaction on a block explorer (Solscan for Solana, Basescan for Base) using the signature or hash from your wallet. If it confirmed on-chain, the funds have arrived at the address the card was configured with. If the address was mistyped, the transfer is not reversible — Propz cannot recover or redirect it.</p>

        <h2>Wrong or outdated wallet address on a jar</h2>
        <p>A creator&apos;s tip jar is generated from the wallet address they configured; open Propz, update the address, and republish or re-copy the embed code, widget, or link — existing copies elsewhere won&apos;t update automatically.</p>

        <h2>Extension issues</h2>
        <p>For problems specific to the Propz Tip Button browser extension, see its <a href="/extension-privacy">privacy policy</a> for what it does and doesn&apos;t access, or email the address above.</p>

        <h2>Everything else</h2>
        <p>Read the <a href="/terms">Terms of Service</a> for how the platform fee and non-custodial model work, or just email us — we read every message.</p>
      </article>
      <footer className="jar-footer">Propz is a Saylor Innovations product</footer>
    </main>
  );
}
