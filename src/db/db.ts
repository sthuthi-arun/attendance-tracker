import Dexie, { type EntityTable } from 'dexie';
import type { Subject, AttendanceRecord } from '@/types';

/**
 * Database for the attendance tracker.
 *
 * Schema history:
 * - v1: subjects + attendance tables, attendance keyed by [subjectId+date].
 * - v2: adds `period` to attendance so a subject can have multiple entries
 *   on one date (e.g. two lectures in a day). Index becomes
 *   [subjectId+date+period]; existing records are backfilled to period 1.
 */
class AttendanceDatabase extends Dexie {
  subjects!: EntityTable<Subject, 'id'>;
  attendance!: EntityTable<AttendanceRecord, 'id'>;

  constructor() {
    super('attendance-tracker-db');

    this.version(1).stores({
      subjects: '++id, name',
      attendance: '++id, subjectId, date, status, [subjectId+date]',
    });

    // v2: adds `period` to support multiple attendance entries for the same
    // subject on the same date (e.g. two lectures in a day). The compound
    // index moves from [subjectId+date] to [subjectId+date+period] since a
    // date alone is no longer unique per subject. Existing records — all
    // created before this concept existed — are backfilled to period 1,
    // which is exactly correct: they were each the only entry for their date.
    this.version(2)
      .stores({
        subjects: '++id, name',
        attendance: '++id, subjectId, date, status, [subjectId+date+period]',
      })
      .upgrade(async (tx) => {
        await tx
          .table('attendance')
          .toCollection()
          .modify((record) => {
            if (record.period === undefined) {
              record.period = 1;
            }
          });
      });
  }
}

export const db = new AttendanceDatabase();
