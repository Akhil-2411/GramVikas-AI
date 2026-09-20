import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "GramVikas AI | AI-Driven MSME Business Advisory & Financial Structuring",
  description: "Smart India Hackathon 2026 platform empowering rural and semi-urban entrepreneurs with AI-backed business discovery, GIS radius reach, SWOT analysis, and 90% concessional government loan structuring under MoSJE.",
  keywords: ["MSME", "Smart India Hackathon", "MoSJE", "GramVikas", "Rural Entrepreneurship", "Telangana MSME", "Business Advisory", "Concessional Finance", "PMEGP", "Mudra"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="antialiased bg-slate-50 text-slate-900 min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
