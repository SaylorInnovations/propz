import { TipJar } from "../components/tipjar";
import { readConfig } from "../lib/tip";

export default async function EmbedPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const config = readConfig(await searchParams);
  return (
    <main className="embed-page">
      <TipJar compact config={config} />
      <a className="embed-credit" href="/" rel="noreferrer" target="_blank">Powered by Propz</a>
    </main>
  );
}
