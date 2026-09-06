import { Brand } from "../components/brand";
import { TipJar } from "../components/tipjar";
import { FEE_PERCENT_LABEL } from "../lib/fee";
import { resolveConfig } from "../lib/handle-store";

export default async function JarPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const config = await resolveConfig(await searchParams);
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
