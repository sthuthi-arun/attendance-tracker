import { useState } from 'react';
import { useAttendance } from '@/hooks/useAttendance';
import { useSubjectStats } from '@/hooks/useSubjectStats';
import { addAttendance, updateAttendance, deleteAttendance } from '@/db';
import { AttendanceForm } from './AttendanceForm';
import { AttendanceHistory } from './AttendanceHistory';
import { Button, Modal } from '@/components/ui';
import type { AttendanceRecord, AttendanceStatusValue, Subject } from '@/types';

interface SubjectDetailProps {
  subject: Subject;
  onClose: () => void;
}

type FormModalState = { mode: 'add' } | { mode: 'edit'; record: AttendanceRecord } | null;

export function SubjectDetail({ subject, onClose }: SubjectDetailProps) {
  const stats = useSubjectStats(subject.id);
  const records = useAttendance(subject.id);
  const [formModal, setFormModal] = useState<FormModalState>(null);
  const [confirmDelete, setConfirmDelete] = useState<AttendanceRecord | null>(null);

  async function handleAdd(values: { date: string; status: AttendanceStatusValue }) {
    await addAttendance({ subjectId: subject.id!, ...values });
    setFormModal(null);
  }

  async function handleEdit(values: { date: string; status: AttendanceStatusValue }) {
    if (formModal?.mode !== 'edit') return;
    await updateAttendance(formModal.record.id!, values);
    setFormModal(null);
  }

  async function handleDelete() {
    if (!confirmDelete) return;
    await deleteAttendance(confirmDelete.id!);
    setConfirmDelete(null);
  }

  return (
    <Modal open onClose={onClose} title={subject.name}>
      <div className="flex flex-col gap-5">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-2 rounded-md bg-canvas-inset p-3">
          <Stat label="Present" value={stats?.presentCount ?? 0} />
          <Stat label="Absent" value={stats?.absentCount ?? 0} />
          <Stat label="Total" value={stats?.totalClasses ?? 0} />
          <Stat label="Attendance" value={`${stats?.percentage ?? 0}%`} />
        </div>

        <Button onClick={() => setFormModal({ mode: 'add' })}>+ Add attendance</Button>

        {/* History */}
        <div>
          <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-faint">
            History
          </h3>
          {records === undefined ? (
            <p className="text-sm text-ink-faint">Loading…</p>
          ) : (
            <AttendanceHistory
              records={records}
              onEdit={(record) => setFormModal({ mode: 'edit', record })}
              onDelete={setConfirmDelete}
            />
          )}
        </div>
      </div>

      {/* Add / edit attendance */}
      <Modal
        open={formModal !== null}
        onClose={() => setFormModal(null)}
        title={formModal?.mode === 'edit' ? 'Edit attendance' : 'Add attendance'}
      >
        <AttendanceForm
          initial={formModal?.mode === 'edit' ? formModal.record : undefined}
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

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col items-center text-center">
      <span className="text-base font-semibold text-ink">{value}</span>
      <span className="text-[11px] text-ink-faint">{label}</span>
    </div>
  );
}
