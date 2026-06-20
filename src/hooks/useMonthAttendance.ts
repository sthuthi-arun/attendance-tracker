import { useLiveQuery } from 'dexie-react-hooks';
import { getAttendanceInRange } from '@/db';
import { monthDateRange } from '@/lib/calendar';

/**
 * Reactive attendance for one visible calendar month (all subjects). Single
 * indexed range query, re-fetched whenever year/month changes or any
 * attendance record is added/edited/deleted — same useLiveQuery pattern as
 * useSubjects/useAttendance.
 */
export function useMonthAttendance(year: number, month: number) {
  return useLiveQuery(() => {
    const { start, end } = monthDateRange(year, month);
    return getAttendanceInRange(start, end);
  }, [year, month]);
}
