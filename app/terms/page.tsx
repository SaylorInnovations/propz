import { Brand } from "../components/brand";
import { FEE_PERCENT_LABEL } from "../lib/fee";

export const metadata = { title: "Propz — Terms of Service" };

export default function TermsPage() {
  return (
    <main className="policy-page">
      <header className="jar-header"><Brand /><span>TERMS OF SERVICE</span></header>
      <article className="policy-body">
        <h1>Terms of Service</h1>
        <p className="policy-updated">Last updated September 15, 2026.</p>
        <p>Propz is operated by Saylor Innovations. By using propz.saylorinnovations.com, the Propz browser extension, or any embedded card, widget, or link that points here, you agree to these terms.</p>

        <h2>What Propz is</h2>
        <p>Propz lets a creator generate a tip jar — a link, an embedded card, or a floating button — that a supporter can use to send SOL or USDC directly to that creator&apos;s own wallet on Solana or Base. Propz is non-custodial: it never holds, controls, or has the ability to move supporter or creator funds. Every transfer is signed by the supporter&apos;s own wallet and settles directly on-chain between the supporter and the creator&apos;s wallet address.</p>

        <h2>The platform fee</h2>
        <p>Propz writes a disclosed <strong>{FEE_PERCENT_LABEL} platform fee</strong> into the same transaction the supporter signs and sees before approving. The fee is never hidden or added after the fact, and it rounds down to zero on very small tips rather than charging more than the amount shown. The fee funds Propz&apos;s continued operation and is not refundable once a transaction confirms on-chain.</p>

        <h2>Your responsibilities</h2>
        <p>You are solely responsible for the accuracy of any wallet address you configure as a creator, and for the security of your own wallet and keys as either a creator or a supporter. Propz never asks for, stores, or has access to private keys or seed phrases. Blockchain transactions are irreversible — Propz cannot cancel, refund, or reverse a transfer once it confirms, including transfers sent to a mistyped or unintended address.</p>
        <p>You must not use Propz to solicit funds through fraud, impersonation, or a misrepresentation of what a payment is for, or in any way that violates applicable law.</p>

        <h2>No warranty, limitation of liability</h2>
        <p>Propz is provided &quot;as is,&quot; without warranty of any kind. Saylor Innovations is not liable for losses arising from blockchain network conditions, wallet or browser issues, user error such as an incorrect address, or the acts of any third party, including a creator&apos;s misuse of funds they receive.</p>

        <h2>Changes</h2>
        <p>These terms may be updated from time to time; the &quot;Last updated&quot; date above reflects the most recent revision. Continued use of Propz after a change constitutes acceptance of the revised terms.</p>

        <h2>Contact</h2>
        <p>Questions about these terms can be sent to <a href="mailto:Dave@saylorinnovations.com">Dave@saylorinnovations.com</a>. See also the <a href="/support">Support</a> page and, for the browser extension specifically, the <a href="/extension-privacy">extension privacy policy</a>.</p>
      </article>
      <footer className="jar-footer">Propz is a Saylor Innovations product</footer>
    </main>
  );
}
