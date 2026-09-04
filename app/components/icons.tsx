import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function WalletIcon(props: IconProps) {
  return <svg {...base} {...props}><path d="M4 6.75A2.75 2.75 0 0 1 6.75 4h10.5A2.75 2.75 0 0 1 20 6.75v10.5A2.75 2.75 0 0 1 17.25 20H6.75A2.75 2.75 0 0 1 4 17.25Z" /><path d="M4 8h12.5A3.5 3.5 0 0 1 20 11.5V15h-5.5a3.5 3.5 0 0 1 0-7H20" /><path d="M14.5 11.5h.01" /></svg>;
}

export function CopyIcon(props: IconProps) {
  return <svg {...base} {...props}><rect x="8" y="8" width="11" height="11" rx="2" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" /></svg>;
}

export function ExternalIcon(props: IconProps) {
  return <svg {...base} {...props}><path d="M14 5h5v5" /><path d="m19 5-9 9" /><path d="M19 13v4a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4" /></svg>;
}

export function CheckIcon(props: IconProps) {
  return <svg {...base} {...props}><path d="m5 12 4 4L19 6" /></svg>;
}

export function CodeIcon(props: IconProps) {
  return <svg {...base} {...props}><path d="m8 9-3 3 3 3" /><path d="m16 9 3 3-3 3" /><path d="m14 5-4 14" /></svg>;
}

export function BoltIcon(props: IconProps) {
  return <svg {...base} {...props}><path d="m13 2-8 12h7l-1 8 8-12h-7Z" /></svg>;
}

export function QrIcon(props: IconProps) {
  return <svg {...base} {...props}><rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" /><rect x="4" y="14" width="6" height="6" rx="1" /><path d="M14 14h3v3" /><path d="M20 14v.01" /><path d="M14 20v.01" /><path d="M20 20v.01" /><path d="M17 17v.01" /></svg>;
}

export function WidgetIcon(props: IconProps) {
  return <svg {...base} {...props}><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /></svg>;
}
