import { FileText, Plus } from 'lucide-react';
import { NoteCard } from './NoteCard';
import { SkeletonGrid, EmptyState } from '@/shared/components/feedback';
import { Button } from '@/shared/components/ui/Button';
import type { Note } from '../types/notes.types';
import './NotesGrid.css'

interface NotesGridProps {
  notes: Note[];
  isLoading: boolean;
  adminView: boolean;
  currentUserId?: string;
  isAdmin: boolean;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onCreateClick: () => void;
}

export function NotesGrid({
  notes,
  isLoading,
  adminView,
  currentUserId,
  isAdmin,
  onView,
  onEdit,
  onDelete,
  onCreateClick,
}: NotesGridProps) {
  if (isLoading) {
    return <SkeletonGrid />;
  }

  if (notes.length === 0) {
    return (
      <EmptyState
        icon={<FileText size={36} />}
        title={adminView ? 'No notes found' : 'No notes yet'}
        description={
          adminView
            ? 'No users have created any notes yet.'
            : "You haven't created any notes yet. Click \"New Note\" to get started!"
        }
        action={
          !adminView && (
            <Button onClick={onCreateClick} leftIcon={<Plus size={16} />}>
              Create your first note
            </Button>
          )
        }
      />
    );
  }

  return (
    <div className="notes-grid">
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          currentUserId={currentUserId}
          isAdmin={isAdmin}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
