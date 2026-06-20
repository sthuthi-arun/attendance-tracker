import { db } from './db';
import type { NewAttendanceRecord, AttendanceUpdate } from '@/types';
import { isFutureDate } from '@/lib/date';

/**
 * All Dexie calls for attendance records live here, isolated from
 * components and hooks — same pattern as db/subjects.ts.
 */

export async function addAttendance(input: NewAttendanceRecord): Promise<number> {
  if (isFutureDate(input.date)) {
    throw new Error('Attendance cannot be recorded for a future date.');
  }

  const sameDateRecords = await db.attendance
    .where('subjectId')
    .equals(input.subjectId)
    .and((record) => record.date === input.date)
    .toArray();

  const nextPeriod =
    sameDateRecords.length === 0 ? 1 : Math.max(...sameDateRecords.map((r) => r.period)) + 1;

  return db.attendance.add({
    subjectId: input.subjectId,
    date: input.date,
    status: input.status,
    period: nextPeriod,
    createdAt: new Date().toISOString(),
  });
}

export async function updateAttendance(id: number, changes: AttendanceUpdate): Promise<void> {
  const record = await db.attendance.get(id);
  if (!record) {
    throw new Error('Attendance record not found.');
  }

  const nextDate = changes.date ?? record.date;

  if (isFutureDate(nextDate)) {
    throw new Error('Attendance cannot be recorded for a future date.');
  }

  // If the date is changing, this record needs a period scoped to the new
  // date — its old period number may already be taken there. Editing just
  // the status on the same date leaves the period untouched.
  const patch: AttendanceUpdate & { period?: number } = { ...changes };

  if (changes.date !== undefined && changes.date !== record.date) {
    const sameDateRecords = await db.attendance
      .where('subjectId')
      .equals(record.subjectId)
      .and((r) => r.date === changes.date && r.id !== id)
      .toArray();

    patch.period =
      sameDateRecords.length === 0 ? 1 : Math.max(...sameDateRecords.map((r) => r.period)) + 1;
  }

  await db.attendance.update(id, patch);
}

export async function deleteAttendance(id: number): Promise<void> {
  await db.attendance.delete(id);
}

/** Newest-first attendance history for one subject. Within a date, periods
 * are ordered ascending (Period 1 before Period 2). */
export async function getAttendanceForSubject(subjectId: number) {
  const records = await db.attendance.where('subjectId').equals(subjectId).toArray();
  return records.sort((a, b) => b.date.localeCompare(a.date) || a.period - b.period);
}
