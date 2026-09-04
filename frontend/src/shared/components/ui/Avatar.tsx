import type { AuthUser } from '@/features/auth/types/auth.types';
import './Avatar.css'

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  user?: Pick<AuthUser, 'username' | 'avatarUrl'> | null;
  size?: AvatarSize;
}

const SIZE_MAP: Record<AvatarSize, string> = {
  sm: 'avatar-sm',
  md: '',
  lg: 'avatar-lg',
  xl: 'avatar-xl',
};

export function Avatar({ user, size = 'md' }: AvatarProps) {
  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : '??';

  if (user?.avatarUrl) {
    return (
      <div className={`avatar ${SIZE_MAP[size]}`}>
        <img
          src={user.avatarUrl}
          alt={`${user.username} avatar`}
          onError={(e) => {
            // Fall back to initials if image fails to load
            (e.currentTarget as HTMLImageElement).style.display = 'none';
          }}
        />
      </div>
    );
  }

  return (
    <div className={`avatar ${SIZE_MAP[size]}`} aria-label={`${user?.username ?? 'User'} avatar`}>
      {initials}
    </div>
  );
}
