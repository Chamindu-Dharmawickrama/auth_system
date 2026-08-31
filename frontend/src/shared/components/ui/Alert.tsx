import type { ReactNode } from 'react';
import { AlertCircle, CheckCircle2, AlertTriangle } from 'lucide-react';
import './Alert.css'

export type AlertVariant = 'error' | 'success' | 'warning';

interface AlertProps {
  variant: AlertVariant;
  children: ReactNode;
  className?: string;
}

const ICONS: Record<AlertVariant, ReactNode> = {
  error: <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} />,
  success: <CheckCircle2 size={16} style={{ flexShrink: 0, marginTop: 2 }} />,
  warning: <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 2 }} />,
};

export function Alert({ variant, children, className = '' }: AlertProps) {
  return (
    <div className={`alert alert-${variant} ${className}`.trim()} role="alert">
      {ICONS[variant]}
      <span>{children}</span>
    </div>
  );
}
