import type { Metadata } from "next";
import { Brand } from "../../components/brand";

// A real, hosted privacy policy is a hard requirement for the Chrome Web
// Store whenever an extension asks for broad host permissions (this one
// needs http://*/* and https://*/* so the tip button can appear on pages a
// creator doesn't control, like a GoFundMe campaign) — Chrome's review
// rejects a submission outright without a working link here. Content below
// describes what the code in extension/ and app/api/extension/*/route.ts
// actually does, not boilerplate — keep it in sync with those if either
// changes what data moves where.

export const metadata: Metadata = {
  title: "Privacy Policy — Propz browser extension",
  description: "What the Propz browser extension does and doesn't collect, and where a registered page's data lives.",
};

export default function ExtensionPrivacyPage() {
  return (
    <main className="jar-page">
      <header className="jar-header"><Brand /><span>PRIVACY POLICY</span></header>
      <div className="policy-shell">
        <h1>Propz browser extension — Privacy Policy</h1>
        <p className="policy-updated">Last updated: September 5, 2026</p>

        <p>
          Propz (built and operated by Saylor Innovations) has no user accounts anywhere —
          not on the website, not in this extension. That shapes everything below: there is
          no login to tie data to, and nothing here is sold, shared, or used for advertising.
        </p>

        <h2>What stays on your device</h2>
        <p>
          When you set up the extension, the name and public wallet address(es) you enter are
          saved with <code>chrome.storage.local</code> — inside your own browser profile,
          never transmitted anywhere until you actively choose to register a page (below).
          Uninstalling the extension, or clearing its storage, deletes it completely; Propz
          keeps no copy anywhere else.
        </p>

        <h2>What the extension checks as you browse</h2>
        <p>
          To decide whether to show a tip button, the extension sends the URL of the page&apos;s
          top-level tab — not its content, not cookies, not form data, nothing else on the
          page — to <code>propz.saylorinnovations.com/api/extension/lookup</code>, asking
          only &quot;has anyone registered this exact page?&quot; That check runs once per page
          load, and again if a site changes pages without a full reload (most social platforms
          work this way). The endpoint answers from a lookup table and does not log, store,
          or otherwise retain the URLs it&apos;s asked about. No cookies are set, and no
          identifier ties one lookup to the next or to you personally.
        </p>
        <p>
          The extension never reads the content of any page you visit, and never runs on
          browser-internal pages (<code>chrome://</code> and similar).
        </p>

        <h2>What &quot;registering a page&quot; publishes</h2>
        <p>
          Choosing &quot;Show my tip button on this page&quot; sends that page&apos;s URL
          together with your display name, accent color, and the public receiving address(es)
          you set up, to Propz&apos;s backend, where it&apos;s stored (in a Cloudflare KV
          namespace) against that URL. From that point on, <strong>anyone who visits that page
          with the extension installed can see that it&apos;s registered</strong> — that&apos;s
          the whole point, so the button shows for real visitors, not just you. A
          random-looking edit token is returned and saved locally in your browser; it&apos;s
          the only thing that lets you update or remove (&quot;revert&quot;) that registration
          later, and it&apos;s never asked for or sent anywhere except back to that same
          endpoint. There&apos;s no account recovery for it — if it&apos;s lost (e.g. by
          clearing browser storage), the registration can&apos;t be edited or removed by that
          browser anymore.
        </p>
        <p>
          A wallet address is already public information by nature — anyone can look up its
          balance or history on a Solana or Base block explorer — so publishing it alongside
          a page registration doesn&apos;t expose anything the chain itself doesn&apos;t
          already show.
        </p>

        <h2>What happens when someone taps the button</h2>
        <p>
          Sending a tip happens entirely in the supporter&apos;s own wallet app — Propz never
          holds funds, never sees a seed phrase or private key, and the transaction is built,
          shown, and approved (or rejected) by the supporter before anything moves. See the
          main site&apos;s README for the payment mechanics.
        </p>

        <h2>Third parties involved</h2>
        <ul>
          <li><strong>Cloudflare</strong> hosts propz.saylorinnovations.com and the KV store
            page registrations live in; its standard infrastructure-level request handling
            is outside Propz&apos;s control, same as for any site on the internet.</li>
          <li><strong>Solana and Base</strong> are public blockchains — once a tip is sent,
            the transaction (amount, sender, recipient addresses) is permanently on a public
            ledger, as with any transaction on either network.</li>
          <li><strong>Wallet apps</strong> (Phantom, MetaMask, Coinbase Wallet, etc.) that a
            supporter already has installed handle the actual payment approval; their own
            privacy practices apply to that step, not Propz&apos;s.</li>
        </ul>
        <p>No analytics, tracking pixels, or advertising SDKs run anywhere in this extension
          or on propz.saylorinnovations.com.</p>

        <h2>Children&apos;s privacy</h2>
        <p>Propz is not directed at children and does not knowingly collect information from
          anyone under 13.</p>

        <h2>Changes to this policy</h2>
        <p>If what the extension collects or does ever changes, this page will be updated
          before that change ships, with the date above kept current.</p>

        <h2>Contact</h2>
        <p>Saylor Innovations — <a href="https://saylorinnovations.com/">saylorinnovations.com</a></p>
      </div>
      <footer className="jar-footer">Propz is a Saylor Innovations product</footer>
    </main>
  );
}
