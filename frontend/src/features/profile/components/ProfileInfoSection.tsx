import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Image as ImageIcon, Calendar } from 'lucide-react';
import { updateProfileSchema, type UpdateProfileFormData } from '../validation/profile.schemas';
import type { ProfileResponse } from '../types/profile.types';
import { formatDate } from '@/shared/utils/dateUtils';
import { Button, Input, FormField } from '@/shared/components/ui';
import './ProfileInfoSection.css';

interface ProfileInfoSectionProps {
  profile: ProfileResponse;
  onUpdate: (data: UpdateProfileFormData) => Promise<void>;
  isUpdating: boolean;
}

export function ProfileInfoSection({ profile, onUpdate, isUpdating }: ProfileInfoSectionProps) {
  const [isEditing, setIsEditing] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      email: profile.email || '',
      avatarUrl: profile.avatarUrl || '',
    },
  });

  const handleCancel = () => {
    reset({
      email: profile.email || '',
      avatarUrl: profile.avatarUrl || '',
    });
    setIsEditing(false);
  };

  const onSubmit = async (data: UpdateProfileFormData) => {
    // Convert empty strings to undefined for the API
    const payload = {
      email: data.email?.trim() || undefined,
      avatarUrl: data.avatarUrl?.trim() || undefined,
    };
    await onUpdate(payload);
    setIsEditing(false);
  };

  return (
    <section className="profile-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
        <h3 className="profile-section-title">Account Information</h3>
        {!isEditing && (
          <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)}>
            Edit Profile
          </Button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <FormField label="Email Address" htmlFor="email" error={errors.email?.message}>
              <Input
                id="email"
                type="email"
                placeholder="No email set"
                leftIcon={<Mail size={16} />}
                disabled={isUpdating}
                hasError={!!errors.email}
                {...register('email')}
              />
            </FormField>

            <FormField label="Avatar URL" htmlFor="avatarUrl" error={errors.avatarUrl?.message} hint="Must be a valid image URL (https://...)">
              <Input
                id="avatarUrl"
                type="url"
                placeholder="https://example.com/avatar.png"
                leftIcon={<ImageIcon size={16} />}
                disabled={isUpdating}
                hasError={!!errors.avatarUrl}
                {...register('avatarUrl')}
              />
            </FormField>

            <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
              <Button type="submit" isLoading={isUpdating}>Save Changes</Button>
              <Button type="button" variant="ghost" onClick={handleCancel} disabled={isUpdating}>Cancel</Button>
            </div>
          </div>
        </form>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div className="profile-field">
            <span className="profile-field-label">Email Address</span>
            <div className="profile-field-value">
              <Mail size={14} style={{ opacity: 0.5 }} />
              {profile.email || <span style={{ opacity: 0.5 }}>Not provided</span>}
            </div>
          </div>

          <div className="profile-field">
            <span className="profile-field-label">Member Since</span>
            <div className="profile-field-value">
              <Calendar size={14} style={{ opacity: 0.5 }} />
              {formatDate(profile.createdAt)}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
