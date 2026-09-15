import type { Metadata } from "next";
import { Brand } from "../components/brand";
import { TipJar } from "../components/tipjar";
import { FEE_PERCENT_LABEL } from "../lib/fee";
import { readConfig } from "../lib/tip";

// Each /jar URL is a one-off card for a single creator's wallet, not
// canonical content of its own — keep these out of search results so they
// don't dilute the site with near-duplicate pages. Still fully reachable by
// anyone with the link, and by agents fetching /api/manifest directly.
export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default async function JarPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const config = readConfig(await searchParams);
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
