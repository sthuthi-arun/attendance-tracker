import { useState, type FormEvent } from 'react';
import { Button, Input } from '@/components/ui';
import type { Subject } from '@/types';

interface SubjectFormProps {
  initial?: Pick<Subject, 'name' | 'targetPercentage'>;
  onSubmit: (values: { name: string; targetPercentage: number }) => Promise<void>;
  onCancel: () => void;
  submitLabel: string;
}

const DEFAULT_TARGET = 75;

export function SubjectForm({ initial, onSubmit, onCancel, submitLabel }: SubjectFormProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [target, setTarget] = useState(String(initial?.targetPercentage ?? DEFAULT_TARGET));
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Subject name is required.');
      return;
    }

    const targetNum = Number(target);
    if (Number.isNaN(targetNum) || targetNum < 0 || targetNum > 100) {
      setError('Target must be a number between 0 and 100.');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({ name: trimmedName, targetPercentage: targetNum });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Subject name"
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g. Data Structures"
        autoFocus
        maxLength={60}
      />
      <Input
        label="Target attendance (%)"
        name="targetPercentage"
        type="number"
        inputMode="numeric"
        min={0}
        max={100}
        value={target}
        onChange={(e) => setTarget(e.target.value)}
      />

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
