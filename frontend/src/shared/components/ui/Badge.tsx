import type { ReactNode } from 'react';

export type BadgeVariant = 'primary' | 'admin' | 'success' | 'danger' | 'google';

interface BadgeProps {
  variant: BadgeVariant;
  children: ReactNode;
  icon?: ReactNode;
}

export function Badge({ variant, children, icon }: BadgeProps) {
  return (
    <span className={`badge badge-${variant}`}>
      {icon}
      {children}
    </span>
  );
}
