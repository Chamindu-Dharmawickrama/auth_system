import { LogOut } from 'lucide-react';
import { Button } from '@/shared/components/ui';
import './SecuritySection.css';

interface SecuritySectionProps {
  onLogoutAll: () => Promise<void>;
  isLoggingOut: boolean;
}

export function SecuritySection({ onLogoutAll, isLoggingOut }: SecuritySectionProps) {
  return (
    <section className="profile-section">
      <h3 className="profile-section-title" style={{ marginBottom: 'var(--space-6)' }}>Security Settings</h3>
      
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        padding: 'var(--space-4)',
        background: 'var(--color-bg-alt)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)'
      }}>
        <div>
          <h4 style={{ fontSize: 'var(--text-md)', fontWeight: 'var(--fw-medium)', marginBottom: 4 }}>
            Active Sessions
          </h4>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
            Log out from all other devices and browsers.
          </p>
        </div>
        <Button 
          variant="secondary" 
          onClick={onLogoutAll} 
          isLoading={isLoggingOut}
          leftIcon={<LogOut size={16} />}
        >
          Log Out All
        </Button>
      </div>
    </section>
  );
}
