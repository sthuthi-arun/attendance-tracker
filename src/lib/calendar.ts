import type { AttendanceRecord, DateAttendanceStatus } from '@/types';

/**
 * Pure functions only — no React, no Dexie. Mirrors the lib/attendance.ts
 * and lib/date.ts pattern: calendar math is unit-testable in isolation.
 */

export interface CalendarCell {
  dateISO: string; // 'YYYY-MM-DD'
  day: number;
  inCurrentMonth: boolean;
  isToday: boolean;
}

/**
 * Builds a 6-row (42-cell) month grid including leading days from the
 * previous month and trailing days from the next, so the grid is always a
 * stable rectangle regardless of which weekday the month starts on. Weeks
 * start on Monday — Sunday-start is equally valid; this is a deliberate
 * choice, not a default left unconsidered.
 */
export function buildMonthGrid(year: number, month: number, todayISO: string): CalendarCell[] {
  const firstOfMonth = new Date(year, month, 1);
  // getDay(): 0=Sun..6=Sat. Convert to Monday-start offset (0=Mon..6=Sun).
  const firstWeekday = (firstOfMonth.getDay() + 6) % 7;

  const gridStart = new Date(year, month, 1 - firstWeekday);

  const cells: CalendarCell[] = [];
  for (let i = 0; i < 42; i++) {
    const cellDate = new Date(gridStart);
    cellDate.setDate(gridStart.getDate() + i);

    const dateISO = toISODate(cellDate);
    cells.push({
      dateISO,
      day: cellDate.getDate(),
      inCurrentMonth: cellDate.getMonth() === month,
      isToday: dateISO === todayISO,
    });
  }

  return cells;
}

function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** First and last 'YYYY-MM-DD' of a given month — used to scope the Dexie
 * range query to exactly the data the visible grid needs. */
export function monthDateRange(year: number, month: number): { start: string; end: string } {
  const start = toISODate(new Date(year, month, 1));
  const end = toISODate(new Date(year, month + 1, 0)); // day 0 of next month = last day of this one
  return { start, end };
}

/**
 * Derives the indicator status for one date from its attendance records
 * (across all subjects). Empty array → 'none'.
 */
export function getDateStatus(records: AttendanceRecord[]): DateAttendanceStatus {
  if (records.length === 0) return 'none';
  const allPresent = records.every((r) => r.status === 'present');
  if (allPresent) return 'all-present';
  const allAbsent = records.every((r) => r.status === 'absent');
  if (allAbsent) return 'all-absent';
  return 'mixed';
}
