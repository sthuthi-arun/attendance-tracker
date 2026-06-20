/**
 * Pure functions only — no React, no Dexie. Phase 1 has no attendance
 * records yet, so every subject is correctly at 0/0, but this function
 * is written for Phase 2 onward and unit-testable in isolation today.
 */
export function calculateAttendancePercentage(present: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((present / total) * 1000) / 10; // one decimal place
}

export type AttendanceStatus = 'good' | 'warning' | 'critical';

/**
 * Good: at/above target. Warning: within 10 points below target.
 * Critical: more than 10 points below target. Thresholds are a starting
 * point — revisit once real usage data exists in later phases.
 */
export function getAttendanceStatus(percentage: number, target: number): AttendanceStatus {
  if (percentage >= target) return 'good';
  if (percentage >= target - 10) return 'warning';
  return 'critical';
}
