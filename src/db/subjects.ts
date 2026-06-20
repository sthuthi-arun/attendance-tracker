import { db } from './db';
import type { NewSubject, SubjectUpdate } from '@/types';

/**
 * All Dexie calls for subjects live here, isolated from components and hooks.
 * Keeping this layer thin means swapping persistence later (or unit-testing
 * the logic with a mock) doesn't touch UI code.
 */

export async function createSubject(input: NewSubject): Promise<number> {
  const name = input.name.trim();
  if (!name) {
    throw new Error('Subject name cannot be empty.');
  }

  const newId = await db.subjects.add({
    name,
    targetPercentage: input.targetPercentage,
    archived: false,
    createdAt: new Date().toISOString(),
  });

  return newId as number;
}

export async function updateSubject(id: number, changes: SubjectUpdate): Promise<void> {
  const patch: SubjectUpdate = { ...changes };
  if (patch.name !== undefined) {
    const trimmed = patch.name.trim();
    if (!trimmed) {
      throw new Error('Subject name cannot be empty.');
    }
    patch.name = trimmed;
  }
  await db.subjects.update(id, patch);
}

/**
 * Soft delete. Subjects are archived rather than removed so that any
 * attendance history attached to them (Phase 2+) is never orphaned.
 */
export async function deleteSubject(id: number): Promise<void> {
  await db.subjects.update(id, { archived: true });
}

export async function getActiveSubjects() {
  return db.subjects.filter((subject) => !subject.archived).sortBy('createdAt');
}
