import FormField from "@/shared/components/ui/FormField";
import { AuthLayout } from "../components/AuthLayout";
import InputBox from "@/shared/components/ui/InputBox";
import { Button } from "@/shared/components/ui/Button";
import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/app.constants";


export function ForgotPasswordPage() {
  
  // if (success) {
  //   return (
  //     <AuthLayout title="Check your inbox" subtitle="We sent password reset instructions">
  //       <Alert variant="success" className="mb-6">
  //         If an account exists for the provided email, a reset link has been sent.
  //       </Alert>
  //       <Link to={ROUTES.LOGIN} style={{ textDecoration: 'none' }}>
  //         <Button fullWidth variant="secondary">Return to Login</Button>
  //       </Link>
  //     </AuthLayout>
  //   );
  // }

  return (
    <AuthLayout title="Forgot password?" subtitle="Enter your email to receive a reset link">
      {/* {error && <Alert variant="error" className="mb-6">{error}</Alert>} */}

      <form  noValidate>
        <FormField label="Email" htmlFor="email" required>
          <InputBox
            id="email"
            type="email"
            placeholder="Enter your email"
            autoComplete="email"
            // disabled={isLoading}
            // hasError={!!errors.email}
            // {...register('email')}
          />
        </FormField>

        <Button type="submit" fullWidth   style={{ marginTop: 'var(--space-6)' }}>
          Send Reset Link
        </Button>
      </form>

      <p className="auth-footer">
        Remember your password?{' '}
        <Link to={ROUTES.LOGIN} className="text-link">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
