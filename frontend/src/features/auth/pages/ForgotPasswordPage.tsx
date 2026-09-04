import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForgotPasswordMutation } from "../api/authApi";
import { type ForgotPasswordRequest } from "../types/auth.types";
import {
   forgotPasswordSchema,
   type ForgotPasswordFormData,
} from "../validation/auth.schemas";
import { AuthLayout } from "../components/AuthLayout";
import { Input, Button, FormField, Alert } from "@/shared/components/ui";
import { ROUTES } from "@/constants/app.constants";
import { getErrorMessage } from "@/types/api.types";

export function ForgotPasswordPage() {
   const [success, setSuccess] = useState(false);
   const [forgotPassword, { isLoading, error: apiError }] =
      useForgotPasswordMutation();
   const error = getErrorMessage(apiError);

   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm<ForgotPasswordFormData>({
      resolver: zodResolver(forgotPasswordSchema),
   });

   const onSubmit = async (data: ForgotPasswordFormData) => {
      try {
         await forgotPassword(data as ForgotPasswordRequest).unwrap();
         setSuccess(true);
      } catch {
         // Fall through to success state to prevent email enumeration
         setSuccess(true);
      }
   };

   if (success) {
      return (
         <AuthLayout
            title="Check your inbox"
            subtitle="We sent password reset instructions"
         >
            <Alert variant="success" className="mb-6">
               If an account exists for the provided email, a reset link has
               been sent.
            </Alert>
            <Link to={ROUTES.LOGIN} style={{ textDecoration: "none" }}>
               <Button fullWidth variant="secondary">
                  Return to Login
               </Button>
            </Link>
         </AuthLayout>
      );
   }

   return (
      <AuthLayout
         title="Forgot password?"
         subtitle="Enter your email to receive a reset link"
      >
         {error && (
            <Alert variant="error" className="mb-6">
               {error}
            </Alert>
         )}

         <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <FormField
               label="Email"
               htmlFor="email"
               required
               error={errors.email?.message}
            >
               <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  autoComplete="email"
                  disabled={isLoading}
                  hasError={!!errors.email}
                  {...register("email")}
               />
            </FormField>

            <Button
               type="submit"
               fullWidth
               isLoading={isLoading}
               style={{ marginTop: "var(--space-6)" }}
            >
               Send Reset Link
            </Button>
         </form>

         <p className="auth-footer">
            Remember your password?{" "}
            <Link to={ROUTES.LOGIN} className="text-link">
               Sign in
            </Link>
         </p>
      </AuthLayout>
   );
}
