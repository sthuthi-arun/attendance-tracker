import type { AttendanceRecord } from '@/types';
import { formatDateDisplay } from '@/lib/date';

interface AttendanceHistoryProps {
  records: AttendanceRecord[];
  onEdit: (record: AttendanceRecord) => void;
  onDelete: (record: AttendanceRecord) => void;
}

export function AttendanceHistory({ records, onEdit, onDelete }: AttendanceHistoryProps) {
  if (records.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border py-10 text-center">
        <p className="text-sm text-ink-muted">No attendance recorded yet.</p>
      </div>
    );
  }

  // Count entries per date so the "Period N" label only shows up when a date
  // actually has more than one entry — the common single-entry case stays
  // exactly as plain as before.
  const countsByDate = records.reduce<Record<string, number>>((acc, r) => {
    acc[r.date] = (acc[r.date] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <ul className="flex flex-col divide-y divide-border-muted">
      {records.map((record) => {
        const hasMultiple = countsByDate[record.date] > 1;

        return (
          <li key={record.id} className="group flex items-center justify-between gap-2 py-2.5">
            <button
              onClick={() => onEdit(record)}
              className="flex min-w-0 flex-1 items-center gap-2 text-left"
            >
              <span
                className={`shrink-0 text-sm ${
                  record.status === 'present' ? 'text-good' : 'text-critical'
                }`}
                aria-hidden="true"
              >
                {record.status === 'present' ? '✓' : '✗'}
              </span>
              <span className="truncate text-sm text-ink">{formatDateDisplay(record.date)}</span>
              {hasMultiple && (
                <span className="shrink-0 rounded bg-canvas-inset px-1.5 py-0.5 text-[11px] text-ink-faint">
                  Period {record.period}
                </span>
              )}
            </button>

            <button
              onClick={() => onDelete(record)}
              aria-label={`Delete attendance for ${formatDateDisplay(record.date)}${hasMultiple ? `, period ${record.period}` : ''}`}
              className="shrink-0 rounded px-2 py-1 text-xs text-ink-faint hover:bg-canvas-inset hover:text-critical"
            >
              Delete
            </button>
          </li>
        );
      })}
    </ul>
  );
}
