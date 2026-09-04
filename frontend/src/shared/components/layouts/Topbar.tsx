import { NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAppSelector } from '@/app/hooks';
import { selectUser } from '@/features/auth/slices/authSlice';
import { Avatar } from '@/shared/components/ui/Avatar';
import { ROUTES } from '@/constants/app.constants';
import './Topbar.css'

interface TopbarProps {
  title: string;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function Topbar({ title, sidebarOpen, onToggleSidebar }: TopbarProps) {
  const user = useAppSelector(selectUser);

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          className="hamburger"
          onClick={onToggleSidebar}
          aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={sidebarOpen}
          id="sidebar-toggle"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <h1 className="topbar-title">{title}</h1>
      </div>

      <div className="topbar-right">
        <NavLink
          to={ROUTES.PROFILE}
          className="topbar-avatar-link"
          aria-label="Go to profile"
        >
          <Avatar user={user} size="sm" />
        </NavLink>
      </div>
    </header>
  );
}
