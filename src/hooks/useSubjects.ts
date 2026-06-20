import { useLiveQuery } from 'dexie-react-hooks';
import { getActiveSubjects } from '@/db';

/**
 * Reactive subscription to active subjects. `useLiveQuery` re-runs and
 * re-renders automatically whenever the underlying IndexedDB data changes —
 * no manual refetch after create/update/delete calls elsewhere in the app.
 *
 * Returns `undefined` while the initial query is in flight.
 */
export function useSubjects() {
  return useLiveQuery(() => getActiveSubjects(), []);
}
