import FormField from "@/shared/components/ui/FormField";
import { AuthLayout } from "../components/AuthLayout";
import InputBox from "@/shared/components/ui/InputBox";
import { Button } from "@/shared/components/ui/Button";

export function ResetPasswordPage() {
  
  
  // If no token in URL, immediately show error state
  // if (!token) {
  //   return (
  //     <AuthLayout title="Invalid Request" subtitle="Password reset link is broken">
  //       <Alert variant="error" className="mb-6">
  //         The password reset link is missing the required security token. Please request a new reset link.
  //       </Alert>
  //       <Link to={ROUTES.FORGOT_PASSWORD} style={{ textDecoration: 'none' }}>
  //         <Button fullWidth>Request New Link</Button>
  //       </Link>
  //     </AuthLayout>
  //   );
  // }

  // if (success) {
  //   return (
  //     <AuthLayout title="Password Reset" subtitle="Your password has been changed">
  //       <Alert variant="success" className="mb-6">
  //         Your password was successfully updated. You can now sign in with your new password.
  //       </Alert>
  //       <Link to={ROUTES.LOGIN} style={{ textDecoration: 'none' }}>
  //         <Button fullWidth>Sign In</Button>
  //       </Link>
  //     </AuthLayout>
  //   );
  // }

 

  return (
    <AuthLayout title="Create new password" subtitle="Please choose a strong password">
      {/* {error && <Alert variant="error" className="mb-6">{error}</Alert>} */}

      <form  noValidate>
        <FormField label="New Password" htmlFor="newPassword" required>
          <InputBox
            id="newPassword"
            //type={pwdVis.isVisible ? 'text' : 'password'}
            placeholder="Create a strong password"
            autoComplete="new-password"
            // disabled={isLoading}
            //hasError={!!errors.newPassword}
            // rightIcon={pwdVis.isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
            //onRightIconClick={pwdVis.toggle}
            // {...register('newPassword')}
          />
        </FormField>
        
        {/* <PasswordStrengthBar password={passwordValue} /> */}

        <FormField label="Confirm New Password" htmlFor="confirmPassword" required>
          <InputBox
            id="confirmPassword"
            type="password"
            placeholder="Confirm your new password"
            autoComplete="new-password"
            // disabled={isLoading}
            //hasError={!!errors.confirmPassword}
            // rightIcon={confirmPwdVis.isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
            //onRightIconClick={confirmPwdVis.toggle}
            // {...register('confirmPassword')}
          />
        </FormField>

        <Button type="submit" fullWidth   style={{ marginTop: 'var(--space-6)' }}>
          Reset Password
        </Button>
      </form>
    </AuthLayout>
  );
}
