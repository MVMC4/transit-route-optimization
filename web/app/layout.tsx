// app/layout.tsx
import type { Metadata } from "next";
import "@/app/globals.css";
import "maplibre-gl/dist/maplibre-gl.css";
import { SurfaceShell } from "@/components/surface-shell";

export const metadata: Metadata = {
  title: "TransitOS | Move through Gaborone",
  description: "Find Gaborone combi routes near you and plan a journey.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SurfaceShell>{children}</SurfaceShell>
      </body>
    </html>
  );
}
