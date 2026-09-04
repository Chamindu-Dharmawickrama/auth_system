import { Pencil, Trash2, User, Clock } from "lucide-react";
import { formatDate } from "@/shared/utils/dateUtils";
import type { Note } from "../types/notes.types";
import './NoteCard.css'

interface NoteCardProps {
   note: Note;
   currentUserId?: string;
   isAdmin: boolean;
   onView: (id: string) => void;
   onEdit: (id: string) => void;
   onDelete: (id: string) => void;
}

export function NoteCard({
   note,
   currentUserId,
   isAdmin,
   onView,
   onEdit,
   onDelete,
}: NoteCardProps) {
   const isOwner = note.userId === currentUserId;
   const showAuthor = isAdmin; // Only admins care who wrote it, as normal users only see their own notes

   const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
         e.preventDefault();
         onView(note.id);
      }
   };

   return (
      <div
         className="note-card"
         onClick={() => onView(note.id)}
         role="button"
         tabIndex={0}
         onKeyDown={handleKeyDown}
         aria-label={`View note: ${note.title}`}
      >
         <div className="note-title">{note.title}</div>
         <p className="note-content-preview">{note.content}</p>

         <div className="note-meta">
            <div
               style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-4)",
                  flex: 1,
                  minWidth: 0,
               }}
            >
               {showAuthor && (
                  <span className="note-author">
                     <User size={11} />
                     {note.userId === currentUserId
                        ? "You"
                        : `${note.userId.slice(0, 8)}…`}
                  </span>
               )}
               <span className="note-date">
                  <Clock
                     size={11}
                     style={{ display: "inline", marginRight: 3 }}
                  />
                  {formatDate(note.updatedAt)}
               </span>
            </div>

            <div className="note-actions" onClick={(e) => e.stopPropagation()}>
               {isOwner && (
                  <button
                     className="btn btn-ghost btn-sm btn-icon"
                     onClick={() => onEdit(note.id)}
                     aria-label={`Edit note ${note.title}`}
                     title="Edit"
                  >
                     <Pencil size={14} />
                  </button>
               )}
               {/* only owner or admin can delete notes */}
               {(isOwner || isAdmin) && (
                  <button
                     className="btn btn-ghost btn-sm btn-icon"
                     onClick={() => onDelete(note.id)}
                     aria-label={`Delete note ${note.title}`}
                     title="Delete"
                     style={{ color: "var(--color-danger)" }}
                  >
                     <Trash2 size={14} />
                  </button>
               )}
            </div>
         </div>
      </div>
   );
}
