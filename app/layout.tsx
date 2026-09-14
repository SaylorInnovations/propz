import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://propz.saylorinnovations.com"),
  title: "Propz — Give credit. Send value.",
  description:
    "Add a crypto tip jar to your website or content. Create a floating button, embedded card, or shareable link to receive SOL and USDC directly.",
  openGraph: {
    title: "Propz — Give credit. Send value.",
    description:
      "Your content. Your tip jar. Add a floating button, embed a card, or share a link to receive SOL and USDC.",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Propz — Give credit. Send value." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Propz — Give credit. Send value.",
    description:
      "Your content. Your tip jar. Add a floating button, embed a card, or share a link to receive SOL and USDC.",
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
