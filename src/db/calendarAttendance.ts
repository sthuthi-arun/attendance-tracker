import { db } from './db';

/**
 * Cross-subject attendance queries, separate from db/attendance.ts because
 * that file is scoped to "all records for one subject" while this one is
 * scoped to "all records for a date range, any subject" — the access
 * pattern the calendar needs.
 */

/**
 * All attendance records (any subject) with `date` between start and end
 * inclusive. 'YYYY-MM-DD' strings compare correctly as a range since they're
 * zero-padded and lexically ordered the same as chronologically.
 *
 * One query per visible month, not per day — keeps the calendar from
 * issuing 30+ queries when navigating months.
 */
export async function getAttendanceInRange(start: string, end: string) {
  return db.attendance.where('date').between(start, end, true, true).toArray();
}

/** All attendance records (any subject) for exactly one date. */
export async function getAttendanceForDate(date: string) {
  return db.attendance.where('date').equals(date).toArray();
}
