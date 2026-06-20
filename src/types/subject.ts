/**
 * Core domain types. Attendance-related types will be added in Phase 2 —
 * keeping this file scoped to what Phase 1 (subject management) needs.
 */

export interface Subject {
  id?: number;
  name: string;
  createdAt: string; // ISO 8601 timestamp
  archived: boolean; // soft delete — preserves history if attendance is added later
  targetPercentage: number; // per-subject attendance goal, defaults to 75
}

/** Shape used when creating a subject — id/createdAt/archived are system-assigned. */
export type NewSubject = Pick<Subject, 'name' | 'targetPercentage'>;

/** Shape used when editing a subject — only mutable fields. */
export type SubjectUpdate = Partial<Pick<Subject, 'name' | 'targetPercentage'>>;
