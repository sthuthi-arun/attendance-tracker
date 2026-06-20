import { useState } from 'react';
import { useSubjects } from '@/hooks/useSubjects';
import { createSubject, updateSubject, deleteSubject } from '@/db';
import { SubjectCard } from './SubjectCard';
import { SubjectForm } from './SubjectForm';
import { SubjectDetail } from '@/components/attendance';
import { Button, Modal } from '@/components/ui';
import type { Subject } from '@/types';

type ModalState = { mode: 'add' } | { mode: 'edit'; subject: Subject } | null;

export function SubjectList() {
  const subjects = useSubjects();
  const [modal, setModal] = useState<ModalState>(null);
  const [confirmDelete, setConfirmDelete] = useState<Subject | null>(null);
  const [openSubject, setOpenSubject] = useState<Subject | null>(null);

  async function handleCreate(values: { name: string; targetPercentage: number }) {
    await createSubject(values);
    setModal(null);
  }

  async function handleEdit(values: { name: string; targetPercentage: number }) {
    if (modal?.mode !== 'edit') return;
    await updateSubject(modal.subject.id!, values);
    setModal(null);
  }

  async function handleDelete() {
    if (!confirmDelete) return;
    await deleteSubject(confirmDelete.id!);
    setConfirmDelete(null);
  }

  // undefined = still loading from IndexedDB
  if (subjects === undefined) {
    return <p className="text-sm text-ink-faint">Loading subjects…</p>;
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-ink">Subjects</h1>
        <Button onClick={() => setModal({ mode: 'add' })}>+ Add subject</Button>
      </div>

      {subjects.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border py-12 text-center">
          <p className="text-sm text-ink-muted">No subjects yet.</p>
          <p className="mt-1 text-xs text-ink-faint">
            Add your first subject to start tracking attendance.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              onOpen={setOpenSubject}
              onEdit={(s) => setModal({ mode: 'edit', subject: s })}
              onDelete={setConfirmDelete}
            />
          ))}
        </div>
      )}

      <Modal
        open={modal !== null}
        onClose={() => setModal(null)}
        title={modal?.mode === 'edit' ? 'Edit subject' : 'Add subject'}
      >
        <SubjectForm
          initial={modal?.mode === 'edit' ? modal.subject : undefined}
          onSubmit={modal?.mode === 'edit' ? handleEdit : handleCreate}
          onCancel={() => setModal(null)}
          submitLabel={modal?.mode === 'edit' ? 'Save changes' : 'Add subject'}
        />
      </Modal>

      <Modal
        open={confirmDelete !== null}
        onClose={() => setConfirmDelete(null)}
        title="Delete subject"
      >
        <p className="text-sm text-ink-muted">
          Delete <span className="text-ink">{confirmDelete?.name}</span>? This removes it from
          your subject list.
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

      {openSubject && (
        <SubjectDetail
          subject={subjects.find((s) => s.id === openSubject.id) ?? openSubject}
          onClose={() => setOpenSubject(null)}
        />
      )}
    </div>
  );
}
