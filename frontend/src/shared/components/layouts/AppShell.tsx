import type { ReactNode } from 'react';
import { useDisclosure } from '@/shared/hooks/useDisclosure';
import { useGetProfileQuery } from '@/features/profile/api/profileApi';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import './AppShell.css'

interface AppShellProps {
  title: string;
  children: ReactNode;
}

/**
 * App shell: fixed sidebar + main content area with sticky topbar.
 * Manages sidebar open/close state internally.
 */
export function AppShell({ title, children }: AppShellProps) {
  const sidebar = useDisclosure(false);

  // Globally fetch the profile so the auth slice receives the avatarUrl immediately.
  // This powers the Avatar component in the Sidebar and Topbar across all protected routes.
  useGetProfileQuery();

  return (
    <div className="app-shell">
      <Sidebar isOpen={sidebar.isOpen} onClose={sidebar.close} />

      <div className="main-content">
        <Topbar
          title={title}
          sidebarOpen={sidebar.isOpen}
          onToggleSidebar={sidebar.toggle}
        />
        <main className="page-content" id="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}
