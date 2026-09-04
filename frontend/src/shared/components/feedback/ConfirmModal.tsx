import type { ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { Modal } from "@/shared/components/ui/Modal";

interface ConfirmModalProps {
   isOpen: boolean;
   onClose: () => void;
   onConfirm: () => void;
   title?: string;
   message?: string;
   confirmLabel?: string;
   danger?: boolean;
   isLoading?: boolean;
   /** Optional additional content, e.g. a confirmation input */
   children?: ReactNode;
}

export function ConfirmModal({
   isOpen,
   onClose,
   onConfirm,
   title = "Are you sure?",
   message,
   confirmLabel = "Confirm",
   danger = false,
   isLoading = false,
   children,
}: ConfirmModalProps) {
   return (
      <Modal
         isOpen={isOpen}
         onClose={onClose}
         title=""
         maxWidth={440}
         footer={
            <>
               <Button
                  variant="secondary"
                  onClick={onClose}
                  disabled={isLoading}
               >
                  Cancel
               </Button>
               <Button
                  variant={danger ? "danger" : "primary"}
                  onClick={onConfirm}
                  isLoading={isLoading}
                  id="confirm-modal-confirm-btn"
               >
                  {confirmLabel}
               </Button>
            </>
         }
      >
         <div
            style={{
               display: "flex",
               alignItems: "flex-start",
               gap: "var(--space-4)",
               marginBottom: message || children ? "var(--space-4)" : 0,
            }}
         >
            {danger && (
               <div
                  style={{
                     width: 40,
                     height: 40,
                     borderRadius: "var(--radius-md)",
                     flexShrink: 0,
                     background: "hsl(0, 70%, 60%, 0.12)",
                     border: "1px solid hsl(0, 70%, 60%, 0.25)",
                     display: "flex",
                     alignItems: "center",
                     justifyContent: "center",
                  }}
               >
                  <AlertTriangle size={20} color="var(--color-danger)" />
               </div>
            )}
            <h3
               style={{
                  fontSize: "var(--text-lg)",
                  fontWeight: "var(--fw-semibold)",
                  color: "var(--color-text-primary)",
                  lineHeight: 1.4,
               }}
            >
               {title}
            </h3>
         </div>
         {message && (
            <p
               style={{
                  fontSize: "var(--text-sm)",
                  color: "var(--color-text-secondary)",
                  lineHeight: 1.7,
               }}
            >
               {message}
            </p>
         )}
         {children}
      </Modal>
   );
}
