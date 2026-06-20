import { useLiveQuery } from 'dexie-react-hooks';
import { getAttendanceForSubject } from '@/db';

/**
 * Reactive, newest-first attendance history for one subject. Re-renders
 * automatically on add/edit/delete — same `useLiveQuery` pattern as
 * useSubjects. Returns `undefined` while the initial query is in flight.
 */
export function useAttendance(subjectId: number | undefined) {
  return useLiveQuery(
    () => (subjectId === undefined ? Promise.resolve([]) : getAttendanceForSubject(subjectId)),
    [subjectId],
  );
}
