import Link from "next/link";
import { Brand } from "../components/brand";
import { TipJar } from "../components/tipjar";
import { FEE_PERCENT_LABEL } from "../lib/fee";
import { normalizeHandle } from "../lib/handles";
import { getHandleConfig } from "../lib/handle-store";

// propz.saylorinnovations.com/@handle — the short, memorable version of
// /jar?sol=...&name=... meant for pasting into a Linktree, an Instagram/
// TikTok/X bio, or a video description. Accepts the leading "@" or not
// (normalizeHandle strips it), so both /@dave and /dave resolve the same way.

export default async function HandlePage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle: raw } = await params;
  const handle = normalizeHandle(raw);
  const config = handle ? await getHandleConfig(handle) : null;

  if (!config) {
    return (
      <main className="jar-page">
        <header className="jar-header"><Brand /><span>UNCLAIMED</span></header>
        <div className="jar-stage">
          <div className="handle-missing">
            <p>Nobody has claimed <strong>@{raw.replace(/^@+/, "")}</strong> yet.</p>
            <Link href="/#studio">Claim it in the Studio</Link>
          </div>
        </div>
        <footer className="jar-footer">Propz is a Saylor Innovations product</footer>
      </main>
    );
  }

  return (
    <main className="jar-page">
      <header className="jar-header"><Brand /><span>VERIFIED PROPZ REQUEST</span></header>
      <div className="jar-stage">
        <TipJar config={config} />
        <div className="jar-trust">
          <span><i /> Direct settlement</span>
          <span><i /> No platform custody</span>
          <span><i /> Verify in your wallet</span>
          <span><i /> {FEE_PERCENT_LABEL} platform fee</span>
        </div>
      </div>
      <footer className="jar-footer">Propz is a Saylor Innovations product</footer>
    </main>
  );
}
