import { AppNavigation } from "@/components/app-navigation";

export function SurfaceShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell ops-surface">
      <AppNavigation />
      <main className="main-content">{children}</main>
    </div>
  );
}
