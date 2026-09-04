import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useResetPasswordMutation } from "../api/authApi";
import {
   resetPasswordSchema,
   type ResetPasswordFormData,
} from "../validation/auth.schemas";
import { AuthLayout } from "../components/AuthLayout";
import { PasswordStrengthBar } from "../components/PasswordStrengthBar";
import { usePasswordVisibility } from "../hooks/useAuthForm";
import { Input, Button, FormField, Alert } from "@/shared/components/ui";
import { ROUTES } from "@/constants/app.constants";
import { getErrorMessage } from "@/types/api.types";

export function ResetPasswordPage() {
   const [searchParams] = useSearchParams();
   const token = searchParams.get("token");
   const [success, setSuccess] = useState(false);

   const pwdVis = usePasswordVisibility();
   const confirmPwdVis = usePasswordVisibility();

   const [resetPassword, { isLoading, error: apiError }] =
      useResetPasswordMutation();
   const error = getErrorMessage(apiError);

   const {
      register,
      handleSubmit,
      watch,
      formState: { errors },
   } = useForm<ResetPasswordFormData>({
      resolver: zodResolver(resetPasswordSchema),
      mode: "onTouched",
   });

   const passwordValue = watch("newPassword", "");

   // If no token in URL, immediately show error state
   if (!token) {
      return (
         <AuthLayout
            title="Invalid Request"
            subtitle="Password reset link is broken"
         >
            <Alert variant="error" className="mb-6">
               The password reset link is missing the required security token.
               Please request a new reset link.
            </Alert>
            <Link
               to={ROUTES.FORGOT_PASSWORD}
               style={{ textDecoration: "none" }}
            >
               <Button fullWidth>Request New Link</Button>
            </Link>
         </AuthLayout>
      );
   }

   if (success) {
      return (
         <AuthLayout
            title="Password Reset"
            subtitle="Your password has been changed"
         >
            <Alert variant="success" className="mb-6">
               Your password was successfully updated. You can now sign in with
               your new password.
            </Alert>
            <Link to={ROUTES.LOGIN} style={{ textDecoration: "none" }}>
               <Button fullWidth>Sign In</Button>
            </Link>
         </AuthLayout>
      );
   }

   const onSubmit = async (data: ResetPasswordFormData) => {
      try {
         await resetPassword({ token, newPassword: data.newPassword }).unwrap();
         setSuccess(true);
      } catch {
         // Handled by RTK Query / getErrorMessage
      }
   };

   return (
      <AuthLayout
         title="Create new password"
         subtitle="Please choose a strong password"
      >
         {error && (
            <Alert variant="error" className="mb-6">
               {error}
            </Alert>
         )}

         <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <FormField
               label="New Password"
               htmlFor="newPassword"
               required
               error={errors.newPassword?.message}
            >
               <Input
                  id="newPassword"
                  type={pwdVis.isVisible ? "text" : "password"}
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                  disabled={isLoading}
                  hasError={!!errors.newPassword}
                  rightIcon={
                     pwdVis.isVisible ? <EyeOff size={18} strokeWidth={1.75} /> : <Eye size={18} strokeWidth={1.75} />
                  }
                  onRightIconClick={pwdVis.toggle}
                  {...register("newPassword")}
               />
            </FormField>

            <PasswordStrengthBar password={passwordValue} />

            <FormField
               label="Confirm New Password"
               htmlFor="confirmPassword"
               required
               error={errors.confirmPassword?.message}
            >
               <Input
                  id="confirmPassword"
                  type={confirmPwdVis.isVisible ? "text" : "password"}
                  placeholder="Confirm your new password"
                  autoComplete="new-password"
                  disabled={isLoading}
                  hasError={!!errors.confirmPassword}
                  rightIcon={
                     confirmPwdVis.isVisible ? (
                        <EyeOff size={18} strokeWidth={1.75} />
                     ) : (
                        <Eye size={18} strokeWidth={1.75} />
                     )
                  }
                  onRightIconClick={confirmPwdVis.toggle}
                  {...register("confirmPassword")}
               />
            </FormField>

            <Button
               type="submit"
               fullWidth
               isLoading={isLoading}
               style={{ marginTop: "var(--space-6)" }}
            >
               Reset Password
            </Button>
         </form>
      </AuthLayout>
   );
}
