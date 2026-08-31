import { AuthLayout } from '../components/AuthLayout';
import FormField from '../../../shared/components/ui/FormField';
import InputBox from '../../../shared/components/ui/InputBox';
import { Button } from '../../../shared/components/ui/Button';
import { ROUTES } from '../../../constants/app.constants';
import { Link } from 'react-router-dom';

export function RegisterPage() {

  return (
    <AuthLayout title="Create an account" subtitle="Join NoteVault today" wide>
      {/* {error && (
        // Render 409 errors (username/email taken) as warnings instead of critical errors
        <Alert variant={error.toLowerCase().includes('already exists') ? 'warning' : 'error'} className="mb-6">
          {error}
        </Alert>
      )} */}

      <form noValidate>
        <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
          <div style={{ flex: 1 }}>
            <FormField label="Username" htmlFor="username" >
              <InputBox
                id="username"
                placeholder="johndoe"
                autoComplete="username"
                // disabled={isLoading}
                // hasError={!!errors.username}
                // {...register('username')}
              />
            </FormField>
          </div>
          <div style={{ flex: 1 }}>
            <FormField label="Email" htmlFor="email" >
              <InputBox
                id="email"
                type="email"
                placeholder="john@example.com"
                autoComplete="email"
                // disabled={isLoading}
                // hasError={!!errors.email}
                // {...register('email')}
              />
            </FormField>
          </div>
        </div>

        <FormField label="Password" htmlFor="password" >
          <InputBox
            id="password"
            type="password"
            placeholder="Create a strong password"
            autoComplete="new-password"
            // disabled={isLoading}
            // hasError={!!errors.password}
            // rightIcon={pwdVis.isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
            // onRightIconClick={pwdVis.toggle}
            // {...register('password')}
          />
        </FormField>
        
        {/* <PasswordStrengthBar password={passwordValue} /> */}

        <FormField label="Confirm Password" htmlFor="confirmPassword" >
          <InputBox
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            autoComplete="new-password"
            // disabled={isLoading}
            // hasError={!!errors.confirmPassword}
            // rightIcon={confirmPwdVis.isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
            // onRightIconClick={confirmPwdVis.toggle}
            // {...register('confirmPassword')}
          />
        </FormField>

        <Button type="submit" fullWidth style={{ marginTop: 'var(--space-6)' }}>
          Create Account
        </Button>
      </form>

      <p className="auth-footer">
        Already have an account?{' '}
        <Link to={ROUTES.LOGIN} className="text-link">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
