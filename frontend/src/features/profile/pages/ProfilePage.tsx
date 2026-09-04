import { useNavigate } from 'react-router-dom';
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useDeleteAccountMutation,
} from '../api/profileApi';
import { useLogoutAllMutation } from '@/features/auth/api/authApi';
import type { UpdateProfileFormData } from '../validation/profile.schemas';

import { ProfileHeader } from '../components/ProfileHeader';
import { ProfileInfoSection } from '../components/ProfileInfoSection';
import { SecuritySection } from '../components/SecuritySection';
import { DangerZone } from '../components/DangerZone';
import { Spinner, Alert } from '@/shared/components/ui';
import { useToast } from '@/shared/hooks/useToast';
import { ROUTES } from '@/constants/app.constants';
import './ProfilePage.css';

export function ProfilePage() {
  const navigate = useNavigate();
  const toast = useToast();

  const { data: profile, isLoading, isError, error } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [deleteAccount, { isLoading: isDeleting }] = useDeleteAccountMutation();
  const [logoutAll, { isLoading: isLoggingOut }] = useLogoutAllMutation();

  if (isLoading) return <Spinner fullPage message="Loading profile…" />;
  if (isError || !profile) {
    return (
      <Alert variant="error" className="m-6">
        Failed to load profile. Please try again later.
      </Alert>
    );
  }

  const handleUpdate = async (data: UpdateProfileFormData) => {
    try {
      await updateProfile(data).unwrap();
      toast.success('Profile updated successfully');
    } catch {
      toast.error('Failed to update profile');
    }
  };

  const handleLogoutAll = async () => {
    try {
      await logoutAll().unwrap();
      navigate(ROUTES.LOGIN);
      toast.success('Logged out of all devices');
    } catch {
      navigate(ROUTES.LOGIN);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount().unwrap();
      navigate(ROUTES.LOGIN);
      toast.success('Account deleted successfully');
    } catch {
      toast.error('Failed to delete account');
    }
  };

  return (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>
      <ProfileHeader profile={profile} />

      <ProfileInfoSection
        profile={profile}
        onUpdate={handleUpdate}
        isUpdating={isUpdating}
      />

      <SecuritySection
        onLogoutAll={handleLogoutAll}
        isLoggingOut={isLoggingOut}
      />

      <DangerZone
        username={profile.username}
        onDeleteAccount={handleDeleteAccount}
        isDeleting={isDeleting}
      />
    </div>
  );
}
