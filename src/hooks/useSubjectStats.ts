import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db';
import { calculateAttendancePercentage } from '@/lib/attendance';

export interface SubjectStats {
  presentCount: number;
  absentCount: number;
  totalClasses: number;
  percentage: number;
}

/**
 * Derives present/absent/total/percentage for one subject directly from its
 * attendance records — never stored as counters on the Subject itself (see
 * Phase 0 planning notes: stored counters drift when records are edited or
 * deleted, derived values can't). Reactive via useLiveQuery, so any
 * add/edit/delete to attendance recalculates this automatically.
 */
export function useSubjectStats(subjectId: number | undefined): SubjectStats | undefined {
  return useLiveQuery(async () => {
    if (subjectId === undefined) {
      return { presentCount: 0, absentCount: 0, totalClasses: 0, percentage: 0 };
    }

    const records = await db.attendance.where('subjectId').equals(subjectId).toArray();
    const presentCount = records.filter((r) => r.status === 'present').length;
    const absentCount = records.filter((r) => r.status === 'absent').length;
    const totalClasses = records.length;

    return {
      presentCount,
      absentCount,
      totalClasses,
      percentage: calculateAttendancePercentage(presentCount, totalClasses),
    };
  }, [subjectId]);
}
