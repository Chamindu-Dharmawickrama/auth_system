import { Avatar } from '@/shared/components/ui';
import { Badge } from '@/shared/components/ui';
import type { ProfileResponse } from '../types/profile.types';

import './ProfileHeader.css';

interface ProfileHeaderProps {
  profile: ProfileResponse;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  return (
    <div className="profile-header">
      <Avatar
        user={{ username: profile.username, avatarUrl: profile.avatarUrl }}
        size="xl"
      />
      <div className="profile-header-info">
        <h2 className="profile-username">{profile.username}</h2>
        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          <Badge variant={profile.role === 'ADMIN' ? 'admin' : 'primary'}>
            {profile.role}
          </Badge>
          {profile.authProvider === 'google' && (
            <Badge variant="google">Google Account</Badge>
          )}
        </div>
      </div>
    </div>
  );
}
