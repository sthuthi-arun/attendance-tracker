import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui';
import type { AttendanceStatusValue, Subject } from '@/types';

interface DayAttendanceFormProps {
  subjects: Subject[];
  /** Present when editing — locks the subject choice, since changing the
   * subject on an existing record isn't a supported edit (it would mean
   * moving the record to a different subject's history). */
  initial?: { subjectId: number; status: AttendanceStatusValue };
  onSubmit: (values: { subjectId: number; status: AttendanceStatusValue }) => Promise<void>;
  onCancel: () => void;
  submitLabel: string;
}

export function DayAttendanceForm({
  subjects,
  initial,
  onSubmit,
  onCancel,
  submitLabel,
}: DayAttendanceFormProps) {
  const [subjectId, setSubjectId] = useState<number | ''>(initial?.subjectId ?? '');
  const [status, setStatus] = useState<AttendanceStatusValue>(initial?.status ?? 'present');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const isEditing = initial !== undefined;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (subjectId === '') {
      setError('Choose a subject.');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({ subjectId, status });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="day-subject" className="text-sm text-ink-muted">
          Subject
        </label>
        <select
          id="day-subject"
          value={subjectId}
          disabled={isEditing}
          onChange={(e) => setSubjectId(Number(e.target.value))}
          className="rounded-md border border-border bg-canvas-inset px-3 py-2 text-sm text-ink disabled:opacity-60 focus-visible:border-accent"
        >
          <option value="" disabled>
            Select a subject
          </option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-sm text-ink-muted">Status</span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setStatus('present')}
            className={`flex-1 rounded-md border px-3 py-2 text-sm transition-colors ${
              status === 'present'
                ? 'border-good bg-good/10 text-good'
                : 'border-border bg-canvas-inset text-ink-muted hover:border-ink-faint'
            }`}
          >
            Present
          </button>
          <button
            type="button"
            onClick={() => setStatus('absent')}
            className={`flex-1 rounded-md border px-3 py-2 text-sm transition-colors ${
              status === 'absent'
                ? 'border-critical bg-critical/10 text-critical'
                : 'border-border bg-canvas-inset text-ink-muted hover:border-ink-faint'
            }`}
          >
            Absent
          </button>
        </div>
      </div>

      {error && <p className="text-sm text-critical">{error}</p>}

      <div className="mt-2 flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Saving…' : submitLabel}
        </Button>
      </div>
    </form>
  );
}
