// app/layout.tsx
import type { Metadata } from "next";
import "@/app/globals.css";
import "maplibre-gl/dist/maplibre-gl.css";
import { SurfaceShell } from "@/components/surface-shell";
import { OfflineBanner } from "@/components/offline-banner";

export const metadata: Metadata = {
  title: "TransitOS Rider | Find your way through Gaborone",
  description: "Choose a destination and find practical combi routes across Gaborone.",
  applicationName: "TransitOS Rider",
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <OfflineBanner />
        <SurfaceShell>{children}</SurfaceShell>
      </body>
    </html>
  );
}
