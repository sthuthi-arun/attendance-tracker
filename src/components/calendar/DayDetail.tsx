import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { getAttendanceForDate, addAttendance, updateAttendance, deleteAttendance } from '@/db';
import { useSubjects } from '@/hooks/useSubjects';
import { DayAttendanceForm } from './DayAttendanceForm';
import { Button, Modal } from '@/components/ui';
import { formatDateDisplay } from '@/lib/date';
import type { AttendanceRecord, AttendanceStatusValue } from '@/types';

interface DayDetailProps {
  dateISO: string;
  onClose: () => void;
}

type FormModalState = { mode: 'add' } | { mode: 'edit'; record: AttendanceRecord } | null;

export function DayDetail({ dateISO, onClose }: DayDetailProps) {
  const subjects = useSubjects();
  const records = useLiveQuery(() => getAttendanceForDate(dateISO), [dateISO]);
  const [formModal, setFormModal] = useState<FormModalState>(null);
  const [confirmDelete, setConfirmDelete] = useState<AttendanceRecord | null>(null);

  const subjectName = (subjectId: number) =>
    subjects?.find((s) => s.id === subjectId)?.name ?? 'Unknown subject';

  async function handleAdd(values: { subjectId: number; status: AttendanceStatusValue }) {
    await addAttendance({ ...values, date: dateISO });
    setFormModal(null);
  }

  async function handleEdit(values: { subjectId: number; status: AttendanceStatusValue }) {
    if (formModal?.mode !== 'edit') return;
    await updateAttendance(formModal.record.id!, { status: values.status });
    setFormModal(null);
  }

  async function handleDelete() {
    if (!confirmDelete) return;
    await deleteAttendance(confirmDelete.id!);
    setConfirmDelete(null);
  }

  const hasSubjects = (subjects?.length ?? 0) > 0;

  return (
    <Modal open onClose={onClose} title={formatDateDisplay(dateISO)}>
      <div className="flex flex-col gap-4">
        {records === undefined ? (
          <p className="text-sm text-ink-faint">Loading…</p>
        ) : records.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border py-8 text-center">
            <p className="text-sm text-ink-muted">No attendance recorded for this date.</p>
          </div>
        ) : (
          <ul className="flex flex-col divide-y divide-border-muted">
            {records.map((record) => (
              <li
                key={record.id}
                className="flex items-center justify-between gap-2 py-2.5"
              >
                <button
                  onClick={() => setFormModal({ mode: 'edit', record })}
                  className="flex min-w-0 flex-1 items-center gap-2 text-left"
                >
                  <span className="truncate text-sm text-ink">{subjectName(record.subjectId)}</span>
                  <span
                    className={`shrink-0 text-xs ${
                      record.status === 'present' ? 'text-good' : 'text-critical'
                    }`}
                  >
                    {record.status === 'present' ? 'Present' : 'Absent'}
                  </span>
                </button>
                <button
                  onClick={() => setConfirmDelete(record)}
                  aria-label={`Delete attendance for ${subjectName(record.subjectId)}`}
                  className="shrink-0 rounded px-2 py-1 text-xs text-ink-faint hover:bg-canvas-inset hover:text-critical"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}

        {hasSubjects ? (
          <Button onClick={() => setFormModal({ mode: 'add' })}>+ Add attendance</Button>
        ) : (
          <p className="text-xs text-ink-faint">Add a subject first to record attendance.</p>
        )}
      </div>

      {/* Add / edit attendance */}
      <Modal
        open={formModal !== null}
        onClose={() => setFormModal(null)}
        title={formModal?.mode === 'edit' ? 'Edit attendance' : 'Add attendance'}
      >
        <DayAttendanceForm
          subjects={subjects ?? []}
          initial={
            formModal?.mode === 'edit'
              ? { subjectId: formModal.record.subjectId, status: formModal.record.status }
              : undefined
          }
          onSubmit={formModal?.mode === 'edit' ? handleEdit : handleAdd}
          onCancel={() => setFormModal(null)}
          submitLabel={formModal?.mode === 'edit' ? 'Save changes' : 'Add attendance'}
        />
      </Modal>

      {/* Confirm delete */}
      <Modal
        open={confirmDelete !== null}
        onClose={() => setConfirmDelete(null)}
        title="Delete attendance"
      >
        <p className="text-sm text-ink-muted">
          Delete this attendance record? This cannot be undone.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setConfirmDelete(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </Modal>
    </Modal>
  );
}
