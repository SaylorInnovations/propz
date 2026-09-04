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
      <a className="embed-credit" href="/" rel="noreferrer" target="_blank">
        {/* The same mark every link back to Propz carries — on saylorinnovations.com's
            footer and here on every embedded jar — so "Propz" reads as one recognizable
            thing wherever a tip jar shows up, not just a text credit. */}
        <svg className="embed-credit-mark" viewBox="0 0 48 48" aria-hidden="true">
          <path d="M9 40V9h16c9.1 0 15 5.3 15 13.5S34.1 36 25 36H18" />
          <path d="M15 31V16h10c4.5 0 7.5 2.5 7.5 6.5S29.5 29 25 29h-4" />
          <circle cx="40" cy="9" r="2.8" />
          <circle cx="9" cy="40" r="2.8" />
          <circle cx="21" cy="29" r="2.3" />
        </svg>
        Powered by Propz
      </a>
    </main>
  );
}
