/**
 * Pure date helpers only — no React, no Dexie. Dates are handled as
 * 'YYYY-MM-DD' strings throughout the app (not Date objects) to avoid
 * timezone-shift bugs when validating "today" or "future" — see Phase 1
 * notes in src/db/db.ts.
 */

/** Today's date as a local 'YYYY-MM-DD' string (not UTC — avoids off-by-one
 * near midnight in timezones ahead of/behind UTC). */
export function todayISO(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** True if the given 'YYYY-MM-DD' string is after today, local time. */
export function isFutureDate(dateISO: string): boolean {
  return dateISO > todayISO();
}

/** Formats 'YYYY-MM-DD' as e.g. '20 Jun 2026' for display. */
export function formatDateDisplay(dateISO: string): string {
  const [year, month, day] = dateISO.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
