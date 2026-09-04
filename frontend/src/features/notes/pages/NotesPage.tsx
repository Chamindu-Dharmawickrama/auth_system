import { Alert } from "@/shared/components/ui/Alert";
import { Button } from "@/shared/components/ui/Button";
import { Plus, User } from "lucide-react";
import {
   useCreateNoteMutation,
   useDeleteNoteMutation,
   useGetAllNotesQuery,
   useGetNotesQuery,
   useUpdateNoteMutation,
} from "../api/notesApi";
import { useAppSelector } from "@/app/hooks";
import { selectIsAdmin, selectUser } from "@/features/auth/slices/authSlice";
import { NotesGrid } from "../components/NotesGrid";
import { useNoteModals } from "../hooks/useNoteModals";
import { ConfirmModal } from "@/shared/components/feedback";
import { NoteFormModal } from "../components/NoteFormModal";
import { useToast } from "@/shared/hooks/useToast";
import type { NoteFormData } from "../validation/notes.schemas";
import { NoteViewModal } from "../components/NoteViewModal";
import "./NotesPage.css";

interface NotesPageProps {
   adminView?: boolean;
}

export function NotesPage({ adminView = false }: NotesPageProps) {
   const user = useAppSelector(selectUser);
   const isAdmin = useAppSelector(selectIsAdmin);
   const modals = useNoteModals();
   const toast = useToast();

   // Fetch user's own notes only when NOT in admin view
   const {
      data: allNotes = [],
      isLoading,
      isFetching,
   } = useGetNotesQuery(undefined, { skip: adminView });

   // Fetch all system notes only in admin view
   const { data: systemAllNotes = [], isLoading: systemNotesIsLoading } =
      useGetAllNotesQuery(undefined, {
         skip: !adminView,
         refetchOnMountOrArgChange: true,
      });

   const [createNote, { isLoading: isCreating }] = useCreateNoteMutation();
   const [updateNote, { isLoading: isUpdating }] = useUpdateNoteMutation();
   const [deleteNote, { isLoading: isDeleting }] = useDeleteNoteMutation();

   // In admin view, the selected note may belong to any user — look in the right list
   const activeNotes = adminView ? systemAllNotes : allNotes;
   const selectedNote = activeNotes.find((n) => n.id === modals.selectedNoteId);

   const handleCreate = async (data: NoteFormData) => {
      try {
         await createNote(data).unwrap();
         toast.success("Note created!");
         modals.close();
      } catch {
         toast.error("Failed to create note");
         throw new Error("Create failed"); // keep modal open
      }
   };

   const handleUpdate = async (data: NoteFormData) => {
      if (!selectedNote) return;
      try {
         await updateNote({ id: selectedNote.id, body: data }).unwrap();
         toast.success("Note updated!");
         modals.close();
      } catch {
         toast.error("Failed to update note");
         throw new Error("Update failed"); // keep modal open
      }
   };

   const handleDelete = async () => {
      if (!selectedNote) return;
      try {
         await deleteNote(selectedNote.id).unwrap();
         toast.success("Note deleted");
         modals.close();
      } catch {
         toast.error("Failed to delete note");
      }
   };

   // Admin can only view/delete — block edit for notes they don't own
   const canEdit = !adminView || selectedNote?.userId === user?.id;

   return (
      <>
         <div className="notes-page-header">
            <div className="notes-page-header-left">
               {/* <p className="notes-page-loading-hint">
                  {isLoading || isFetching || systemNotesIsLoading
                     ? "Loading notes…"
                     : ""}
               </p> */}
            </div>

            {!adminView && (
               <Button
                  onClick={modals.openCreate}
                  leftIcon={<Plus size={16} />}
               >
                  New Note
               </Button>
            )}
         </div>

         {adminView && (
            <Alert variant="warning" className="mb-6">
               <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <User size={16} />
                  Admin view — showing notes from all users. You can delete any
                  note but cannot edit others&apos; notes.
               </div>
            </Alert>
         )}

         <NotesGrid
            notes={activeNotes}
            isLoading={adminView ? systemNotesIsLoading : isLoading}
            adminView={adminView}
            currentUserId={user?.id}
            isAdmin={isAdmin}
            onView={modals.openView}
            onEdit={modals.openEdit}
            onDelete={modals.openDelete}
            onCreateClick={modals.openCreate}
         />

         {/* Modals are decoupled from the main UI tree for performance */}
         {modals.isCreateOpen && (
            <NoteFormModal
               isOpen
               onClose={modals.close}
               onSave={handleCreate}
               isSaving={isCreating}
            />
         )}

         {/* Edit modal: only render if the user actually owns the note */}
         {modals.isEditOpen && selectedNote && canEdit && (
            <NoteFormModal
               isOpen
               onClose={modals.close}
               noteToEdit={selectedNote}
               onSave={handleUpdate}
               isSaving={isUpdating}
            />
         )}

         {modals.isViewOpen && selectedNote && (
            <NoteViewModal
               isOpen
               onClose={modals.close}
               note={selectedNote}
               currentUserId={user?.id}
               isAdmin={isAdmin}
               onEdit={
                  canEdit
                     ? () => modals.openEdit(selectedNote.id)
                     : modals.close
               }
               onDelete={() => modals.openDelete(selectedNote.id)}
            />
         )}

         <ConfirmModal
            isOpen={modals.isDeleteOpen}
            onClose={modals.close}
            onConfirm={handleDelete}
            title="Delete Note"
            message={`Are you sure you want to delete "${selectedNote?.title}"? This action cannot be undone.`}
            confirmLabel="Delete Note"
            danger
            isLoading={isDeleting}
         />
      </>
   );
}
