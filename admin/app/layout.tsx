// app/layout.tsx
import type { Metadata } from "next";
import "@/app/globals.css";
import "maplibre-gl/dist/maplibre-gl.css";
import { SurfaceShell } from "@/components/surface-shell";

export const metadata: Metadata = {
  title: "Tsela Operations",
  description: "Create, maintain, and monitor the Gaborone route network.",
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
