/**
 * Indicator status for a single calendar date, derived from that date's
 * attendance records across all subjects.
 */
export type DateAttendanceStatus = 'all-present' | 'all-absent' | 'mixed' | 'none';
