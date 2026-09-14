import { Brand } from "../components/brand";

export const metadata = { title: "Propz Tip Button — Privacy Policy" };

export default function ExtensionPrivacyPage() {
  return (
    <main className="policy-page">
      <header className="jar-header"><Brand /><span>EXTENSION PRIVACY POLICY</span></header>
      <article className="policy-body">
        <h1>Propz Tip Button — Privacy Policy</h1>
        <p className="policy-updated">Last updated September 14, 2026. Applies to extension version 1.1.0.</p>
        <p>Propz Tip Button helps creators generate a floating website button, an embedded tip card, or a shareable tip-jar link. It does not run on the websites you browse or automatically change your website.</p>
        <h2>Settings you provide</h2>
        <p>Your public Solana and Base receiving addresses, display name, message, button label, and accent color are saved only when you select Save settings. The extension uses Chrome storage sync; Chrome may sync these settings through your Google account when sync is enabled. Never enter private keys or seed phrases.</p>
        <h2>Generating and copying code</h2>
        <p>Code and links are generated locally in the extension. Generating or saving them does not send them to Propz. Selecting Copy writes your code or link to the clipboard; the extension does not read your clipboard. The extension has no analytics, browsing-history access, or content scripts.</p>
        <h2>Opening and publishing your jar</h2>
        <p>Selecting Preview opens the hosted Propz website in a new tab and sends your card details, including public wallet addresses and display text, in the URL. Pasting the generated code or link into your website or content makes those details public. An embedded card loads the Propz website for visitors; the floating widget loads a Propz script and loads the card when clicked.</p>
        <p>Requests to the hosted website expose ordinary request metadata, such as IP address and browser information, to the hosting provider. Website logs and any website analytics are separate from the extension. Payments take place on the hosted website through a compatible wallet and blockchain services. Blockchain transactions are public; Propz does not hold private keys or take custody of funds.</p>
        <h2>Removing your information</h2>
        <p>Clear the fields and select Save settings to replace your saved details, or uninstall the extension to remove its local storage. Chrome manages synced data through your account settings. Remove published snippets or links from your website separately. Changing extension settings does not update code you already published, delete hosting logs, or erase blockchain transactions.</p>
        <h2>Contact</h2>
        <p>Propz is operated by Saylor Innovations. Contact us through <a href="https://saylorinnovations.com" rel="noreferrer">saylorinnovations.com</a> with questions about this policy.</p>
      </article>
      <footer className="jar-footer">Propz is a Saylor Innovations product</footer>
    </main>
  );
}
