/** Metadata and shared Fumadocs client provider for public access and protected pages. */

import type { Metadata } from "next";
import { RootProvider } from "fumadocs-ui/provider/next";
import TselaSearchDialog from "../components/fumadocs-search";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tsela Developers",
  description: "Sign in to browse the Tsela API reference and manage developer access.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><body><RootProvider search={{ SearchDialog: TselaSearchDialog, links: [["API reference", "/reference/routes/list"], ["Dashboard", "/console"]] }}>{children}</RootProvider></body></html>;
}
