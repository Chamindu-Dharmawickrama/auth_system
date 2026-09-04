import type { ReactNode } from "react";
import { FileText } from "lucide-react";
import './EmptyState.css'

interface EmptyStateProps {
   icon?: ReactNode;
   title: string;
   description?: string;
   action?: ReactNode;
}

export function EmptyState({
   icon,
   title,
   description,
   action,
}: EmptyStateProps) {
   return (
      <div className="empty-state">
         <div className="empty-state-icon">
            {icon ?? <FileText size={36} />}
         </div>
         <h2 className="empty-state-title">{title}</h2>
         {description && <p className="empty-state-desc">{description}</p>}
         {action && <div style={{ marginTop: "var(--space-2)" }}>{action}</div>}
      </div>
   );
}
