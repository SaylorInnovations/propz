import { Brand } from "../components/brand";

export const metadata = { title: "Propz Tip Jar — Privacy Policy" };

export default function MobilePrivacyPage() {
  return (
    <main className="policy-page">
      <header className="jar-header"><Brand /><span>MOBILE PRIVACY POLICY</span></header>
      <article className="policy-body">
        <h1>Propz Tip Jar — Privacy Policy</h1>
        <p className="policy-updated">Last updated September 26, 2026. Applies to mobile app version 1.0.0.</p>
        <p>Propz Tip Jar helps you create and share a non-custodial cryptocurrency tip-jar link. Propz does not create or hold a wallet, request private keys or seed phrases, take custody of funds, or require an account.</p>
        <h2>Information saved on your device</h2>
        <p>Your public Solana and Base receiving addresses, display name, message, and accent choice are saved locally on your device when you select Save jar. This information is not uploaded to a Propz account. You can replace it in the app or remove it by clearing the app&apos;s data or uninstalling the app.</p>
        <h2>Links, sharing, and payments</h2>
        <p>The app creates a Propz link containing the public wallet addresses and display text you provide. Copying or sharing that link makes those details available to anyone who receives it. Opening the payment page sends those details to the hosted Propz website in the URL.</p>
        <p>Requests to the hosted website expose ordinary request metadata, such as IP address and browser information, to the hosting provider. A supporter approves any payment in their own compatible wallet. Blockchain addresses and transactions are public and generally cannot be erased.</p>
        <h2>Device access and tracking</h2>
        <p>The app uses the clipboard only when you select Copy link. It does not read your clipboard, contacts, photos, precise location, advertising identifier, or browsing history. The app contains no advertising or cross-app tracking SDK.</p>
        <h2>Children</h2>
        <p>Propz is not directed to children under 13. Do not use the app where cryptocurrency transfers are prohibited or without the authority required in your jurisdiction.</p>
        <h2>Contact</h2>
        <p>Propz is operated by Saylor Innovations. Contact us through <a href="https://saylorinnovations.com/#contact" rel="noreferrer">saylorinnovations.com</a> with privacy questions.</p>
      </article>
      <footer className="jar-footer">Propz is a Saylor Innovations product</footer>
    </main>
  );
}
