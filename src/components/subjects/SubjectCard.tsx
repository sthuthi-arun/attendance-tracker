import type { Subject } from '@/types';
import { getAttendanceStatus } from '@/lib/attendance';
import { useSubjectStats } from '@/hooks/useSubjectStats';

interface SubjectCardProps {
  subject: Subject;
  onOpen: (subject: Subject) => void;
  onEdit: (subject: Subject) => void;
  onDelete: (subject: Subject) => void;
}

const statusDot = {
  good: 'bg-good',
  warning: 'bg-warning',
  critical: 'bg-critical',
};

export function SubjectCard({ subject, onOpen, onEdit, onDelete }: SubjectCardProps) {
  const stats = useSubjectStats(subject.id);
  const present = stats?.presentCount ?? 0;
  const total = stats?.totalClasses ?? 0;
  const percentage = stats?.percentage ?? 0;
  const status = getAttendanceStatus(percentage, subject.targetPercentage);

  return (
    <div className="group rounded-lg border border-border bg-canvas-subtle p-4 transition-colors hover:border-ink-faint">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className={`h-2 w-2 shrink-0 rounded-full ${statusDot[status]}`}
            aria-hidden="true"
          />
          <h3 className="truncate text-sm font-medium text-ink">{subject.name}</h3>
        </div>

        <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
          <button
            onClick={() => onEdit(subject)}
            className="rounded px-2 py-1 text-xs text-ink-muted hover:bg-canvas-inset hover:text-ink"
            aria-label={`Edit ${subject.name}`}
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(subject)}
            className="rounded px-2 py-1 text-xs text-ink-muted hover:bg-canvas-inset hover:text-critical"
            aria-label={`Delete ${subject.name}`}
          >
            Delete
          </button>
        </div>
      </div>

      <button onClick={() => onOpen(subject)} className="mt-3 block w-full text-left">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold text-ink">{percentage}%</span>
          <span className="text-xs text-ink-faint">target {subject.targetPercentage}%</span>
        </div>

        <p className="mt-1 text-xs text-ink-faint">
          {total === 0 ? 'No attendance recorded yet' : `${present} present / ${total} total`}
        </p>
      </button>
    </div>
  );
}
