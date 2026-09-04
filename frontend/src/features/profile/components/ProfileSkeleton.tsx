import { SkeletonGrid } from '@/shared/components/feedback';
import '../components/ProfileHeader.css';
import '../components/ProfileInfoSection.css';
import '../components/SecuritySection.css';
import '../components/DangerZone.css';

export function ProfileSkeleton() {
  return (
    <div style={{ maxWidth: 760, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Header Skeleton */}
      <div className="profile-header" style={{ marginBottom: 0 }}>
        <div className="skeleton" style={{ width: 80, height: 80, borderRadius: '50%', flexShrink: 0 }} />
        <div className="profile-header-info" style={{ justifyContent: 'center' }}>
          <div className="skeleton" style={{ width: 220, height: 32, marginBottom: 'var(--space-2)' }} />
          <div className="skeleton" style={{ width: 80, height: 24, borderRadius: 'var(--radius-full)' }} />
        </div>
      </div>

      {/* Account Info Skeleton */}
      <section className="profile-section" style={{ marginBottom: 0 }}>
        <div className="skeleton" style={{ width: 180, height: 24, marginBottom: 'var(--space-6)' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div className="profile-field">
            <div className="skeleton" style={{ width: 100, height: 20 }} />
            <div className="skeleton" style={{ width: 200, height: 20 }} />
          </div>
          <div className="profile-field">
            <div className="skeleton" style={{ width: 100, height: 20 }} />
            <div className="skeleton" style={{ width: 140, height: 20 }} />
          </div>
        </div>
      </section>

      {/* Security Settings Skeleton */}
      <section className="profile-section" style={{ marginBottom: 0 }}>
        <div className="skeleton" style={{ width: 160, height: 24, marginBottom: 'var(--space-6)' }} />
        <div className="skeleton" style={{ width: '100%', height: 80, borderRadius: 'var(--radius-lg)' }} />
      </section>

      {/* Danger Zone Skeleton */}
      <section className="profile-section danger-zone" style={{ marginBottom: 0 }}>
        <div className="skeleton" style={{ width: 140, height: 24, marginBottom: 'var(--space-6)' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-4)' }}>
          <div style={{ flex: 1 }}>
            <div className="skeleton" style={{ width: 160, height: 24, marginBottom: 'var(--space-2)' }} />
            <div className="skeleton" style={{ width: '80%', height: 16 }} />
          </div>
          <div className="skeleton" style={{ width: 140, height: 40, borderRadius: 'var(--radius-md)' }} />
        </div>
      </section>
    </div>
  );
}
