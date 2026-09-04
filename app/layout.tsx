import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://propz.saylorinnovations.chatgpt.site"),
  title: "Propz — Give credit. Send value.",
  description:
    "Tip your favorite creators, gamers, builders, streamers, artists, and communities with SOL or USDC sent directly to their wallet.",
  openGraph: {
    title: "Propz — Give credit. Send value.",
    description:
      "Tip creators, gamers, builders, streamers, and anyone you value—directly with SOL or USDC.",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Propz — Give credit. Send value." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Propz — Give credit. Send value.",
    description:
      "Tip creators, gamers, builders, streamers, and anyone you value—directly with SOL or USDC.",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
