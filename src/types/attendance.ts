export type AttendanceStatusValue = 'present' | 'absent';

export interface AttendanceRecord {
  id?: number;
  subjectId: number;
  date: string; // ISO 'YYYY-MM-DD' — matches the Phase 1 decision to avoid
  // Date-object timezone bugs for date-only values.
  status: AttendanceStatusValue;
  /** 1-indexed period for this subject+date, auto-assigned. Lets the same
   * subject have multiple attendance entries on one date (e.g. two lectures
   * in a day) without colliding. Existing single-entry dates are period 1. */
  period: number;
  createdAt: string; // ISO 8601 timestamp
}

/** Shape used when creating a record — id/createdAt/period are system-assigned. */
export type NewAttendanceRecord = Pick<AttendanceRecord, 'subjectId' | 'date' | 'status'>;

/** Shape used when editing a record — only mutable fields. Period is fixed
 * once created and is recomputed only internally if the date changes. */
export type AttendanceUpdate = Partial<Pick<AttendanceRecord, 'date' | 'status'>>;
