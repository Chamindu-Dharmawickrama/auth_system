import { Pencil, Trash2, Clock, User } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';
import { Modal } from '@/shared/components/ui/Modal';
import { formatDateLong } from '@/shared/utils/dateUtils';
import type { Note } from '../types/notes.types';
import './NoteViewModal.css'

interface NoteViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: Note | undefined;
  currentUserId?: string;
  isAdmin: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export function NoteViewModal({
  isOpen,
  onClose,
  note,
  currentUserId,
  isAdmin,
  onEdit,
  onDelete,
}: NoteViewModalProps) {
  if (!note) return null;

  const isOwner = note.userId === currentUserId;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={note.title}
      maxWidth={660}
      footer={
        <>
          {isOwner && (
            <Button variant="secondary" onClick={onEdit} leftIcon={<Pencil size={14} />}>
              Edit
            </Button>
          )}
          {(isOwner || isAdmin) && (
            <Button variant="danger" onClick={onDelete} leftIcon={<Trash2 size={14} />}>
              Delete
            </Button>
          )}
          <Button variant="ghost" onClick={onClose} style={{ marginLeft: 'auto' }}>
            Close
          </Button>
        </>
      }
    >
      <div className="note-view-content">
        {note.content}
      </div>

      <div className="note-view-meta">
        <span className="note-date">
          <Clock size={12} />
          Created: {formatDateLong(note.createdAt)}
        </span>
        <span className="note-date">
          <Clock size={12} />
          Updated: {formatDateLong(note.updatedAt)}
        </span>
        {isAdmin && (
          <span className="note-author">
            <User size={12} />
            User: {isOwner ? 'You' : note.userId}
          </span>
        )}
      </div>
    </Modal>
  );
}
