import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Button, Input } from "@/shared/components/ui";
import { ConfirmModal } from "@/shared/components/feedback";

import "./DangerZone.css";

interface DangerZoneProps {
   username: string;
   onDeleteAccount: () => Promise<void>;
   isDeleting: boolean;
}

export function DangerZone({
   username,
   onDeleteAccount,
   isDeleting,
}: DangerZoneProps) {
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [confirmText, setConfirmText] = useState("");

   const canDelete = confirmText === username;

   const handleDelete = async () => {
      // JS-level guard: never proceed if the confirmation text doesn't match
      if (!canDelete) return;
      await onDeleteAccount();
      setIsModalOpen(false);
   };

   return (
      <>
         <section className="profile-section danger-zone">
            <h3 className="profile-section-title danger">Danger Zone</h3>

            <div
               style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: "var(--space-6)",
               }}
            >
               <div>
                  <h4
                     style={{
                        fontSize: "var(--text-md)",
                        fontWeight: "var(--fw-medium)",
                        marginBottom: 4,
                     }}
                  >
                     Delete Account
                  </h4>
                  <p
                     style={{
                        fontSize: "var(--text-sm)",
                        color: "var(--color-text-secondary)",
                        lineHeight: 1.6,
                     }}
                  >
                     Permanently delete your account and all associated notes.
                     This action cannot be undone.
                  </p>
               </div>
               <Button
                  variant="danger"
                  onClick={() => {
                     setConfirmText("");
                     setIsModalOpen(true);
                  }}
               >
                  Delete Account
               </Button>
            </div>
         </section>

         <ConfirmModal
            isOpen={isModalOpen}
            onClose={() => {
               setIsModalOpen(false);
               setConfirmText("");
            }}
            onConfirm={handleDelete}
            title="Delete Account"
            confirmLabel="I understand, delete my account"
            danger
            isLoading={isDeleting}
            confirmDisabled={!canDelete}
         >
            <div style={{ marginTop: "var(--space-4)" }}>
               <p
                  style={{
                     fontSize: "var(--text-sm)",
                     color: "var(--color-text-secondary)",
                     marginBottom: "var(--space-3)",
                  }}
               >
                  This will permanently delete your account, including all your
                  notes and profile data.
               </p>
               <div
                  style={{
                     background: "var(--color-bg-alt)",
                     padding: "var(--space-4)",
                     borderRadius: "var(--radius-md)",
                     marginBottom: "var(--space-4)",
                  }}
               >
                  <div
                     style={{
                        display: "flex",
                        gap: "var(--space-2)",
                        color: "var(--color-danger)",
                        fontSize: "var(--text-sm)",
                        fontWeight: "var(--fw-medium)",
                        marginBottom: "var(--space-2)",
                     }}
                  >
                     <AlertTriangle size={16} /> Warning
                  </div>
                  <p style={{ fontSize: "var(--text-sm)" }}>
                     Please type <strong>{username}</strong> to confirm.
                  </p>
               </div>
               <Input
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder={username}
                  autoComplete="off"
                  disabled={isDeleting}
               />
            </div>
         </ConfirmModal>
      </>
   );
}
