import { useState, type FormEvent } from 'react';
import { Button, Input } from '@/components/ui';
import { todayISO } from '@/lib/date';
import type { AttendanceRecord, AttendanceStatusValue } from '@/types';

interface AttendanceFormProps {
  initial?: Pick<AttendanceRecord, 'date' | 'status'>;
  onSubmit: (values: { date: string; status: AttendanceStatusValue }) => Promise<void>;
  onCancel: () => void;
  submitLabel: string;
}

export function AttendanceForm({ initial, onSubmit, onCancel, submitLabel }: AttendanceFormProps) {
  const [date, setDate] = useState(initial?.date ?? todayISO());
  const [status, setStatus] = useState<AttendanceStatusValue>(initial?.status ?? 'present');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!date) {
      setError('Date is required.');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({ date, status });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Date"
        name="date"
        type="date"
        value={date}
        max={todayISO()}
        onChange={(e) => setDate(e.target.value)}
        autoFocus
      />

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
