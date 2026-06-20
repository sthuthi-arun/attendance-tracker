import type { ReactNode } from 'react';

interface AppShellProps {
  children: ReactNode;
}

/**
 * Minimal shell for Phase 1 — just a top bar and content area, sized for
 * mobile with a max-width on larger screens. The bottom tab bar (Calendar,
 * Analytics, Settings) is intentionally deferred until those pages exist in
 * later phases; adding nav items for pages that don't exist yet would be
 * dead UI.
 */
export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b border-border-muted px-4 py-3">
        <span className="text-sm font-medium text-ink-muted">Attendance Tracker</span>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-5">{children}</main>
    </div>
  );
}
