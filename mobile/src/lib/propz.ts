export type JarConfig = { sol: string; base: string; name: string; message: string; accent: string };
export const DEFAULT_JAR: JarConfig = { sol: '', base: '', name: '', message: '', accent: 'cyan' };
export function validationError(c: JarConfig) {
  if (!c.sol && !c.base) return 'Add a public Solana or Base receiving address.';
  if (c.sol && !/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(c.sol)) return 'Check your Solana public address.';
  if (c.base && !/^0x[a-fA-F0-9]{40}$/.test(c.base)) return 'Check your Base public address.';
  return '';
}
export function jarUrl(c: JarConfig) {
  const p = new URLSearchParams();
  Object.entries(c).forEach(([k, v]) => v.trim() && p.set(k, v.trim()));
  return `https://propz.saylorinnovations.com/jar?${p.toString()}`;
}
