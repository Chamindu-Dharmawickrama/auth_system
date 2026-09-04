import { NavLink, useNavigate } from 'react-router-dom';
import { FileText, User, LogOut, Shield, Notebook } from 'lucide-react';
import { useAppSelector } from '@/app/hooks';
import { selectUser, selectIsAdmin } from '@/features/auth/slices/authSlice';
import { useLogoutMutation } from '@/features/auth/api/authApi';
import { Avatar } from '@/shared/components/ui/Avatar';
import { ROUTES } from '@/constants/app.constants';
import { useToast } from '@/shared/hooks/useToast';
import './Sidebar.css'

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const user = useAppSelector(selectUser);
  const isAdmin = useAppSelector(selectIsAdmin);
  const navigate = useNavigate();
  const toast = useToast();

  const [logoutMutation, { isLoading: isLoggingOut }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap();
      navigate(ROUTES.LOGIN, { replace: true });
      toast.success('Logged out successfully');
    } catch {
      // logoutMutation always clears client state even on network failure
      navigate(ROUTES.LOGIN, { replace: true });
    }
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `nav-item${isActive ? ' active' : ''}`;

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`sidebar-overlay${isOpen ? ' visible' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className={`sidebar${isOpen ? ' open' : ''}`} aria-label="Main navigation">
        {/* Logo */}
        <div className="sidebar-header">
          <div className="sidebar-logo" aria-hidden="true">
            <Notebook size={18} color="#fff" />
          </div>
          <span className="sidebar-logo-text">NoteVault</span>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <div className="nav-section-label">Menu</div>

          <NavLink to={ROUTES.DASHBOARD} className={navLinkClass} onClick={onClose} id="nav-notes">
            <FileText size={18} />
            My Notes
          </NavLink>

          <NavLink to={ROUTES.PROFILE} className={navLinkClass} onClick={onClose} id="nav-profile">
            <User size={18} />
            Profile
          </NavLink>

          {isAdmin && (
            <>
              <div className="nav-section-label" style={{ marginTop: 'var(--space-4)' }}>
                Administration
              </div>
              <NavLink to={ROUTES.ADMIN_NOTES} className={navLinkClass} onClick={onClose} id="nav-admin-notes">
                <Shield size={18} />
                All Notes
                <span className="badge badge-admin" style={{ marginLeft: 'auto', fontSize: 10, padding: '1px 6px' }}>
                  Admin
                </span>
              </NavLink>
            </>
          )}

          <div className="nav-section-label" style={{ marginTop: 'var(--space-4)' }}>
            Account
          </div>

          <button
            className="nav-item danger"
            onClick={handleLogout}
            disabled={isLoggingOut}
            id="nav-logout"
          >
            {isLoggingOut
              ? <div className="spinner spinner-sm" style={{ borderTopColor: 'var(--color-danger)' }} />
              : <LogOut size={18} />
            }
            {isLoggingOut ? 'Logging out…' : 'Log Out'}
          </button>
        </nav>

        {/* User footer */}
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <Avatar user={user} />
            <div className="sidebar-user-info">
              <div className="sidebar-username">{user?.username}</div>
              <div className="sidebar-role">
                {isAdmin ? '🛡️ Administrator' : 'Member'}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
