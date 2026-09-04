import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useRegisterMutation } from "../api/authApi";
import {
   registerSchema,
   type RegisterFormData,
} from "../validation/auth.schemas";
import { AuthLayout } from "../components/AuthLayout";
import { PasswordStrengthBar } from "../components/PasswordStrengthBar";
import { usePasswordVisibility } from "../hooks/useAuthForm";
import { Input, Button, FormField, Alert } from "@/shared/components/ui";
import { useToast } from "@/shared/hooks/useToast";
import { ROUTES } from "@/constants/app.constants";
import { getErrorMessage } from "@/types/api.types";
import type { RegisterRequest } from "../types/auth.types";

export function RegisterPage() {
   const navigate = useNavigate();
   const toast = useToast();
   const pwdVis = usePasswordVisibility();
   const confirmPwdVis = usePasswordVisibility();

   const [registerMutation, { isLoading, error: apiError }] =
      useRegisterMutation();
   const error = getErrorMessage(apiError);

   const {
      register,
      handleSubmit,
      watch,
      formState: { errors },
   } = useForm<RegisterFormData>({
      resolver: zodResolver(registerSchema),
      mode: "onTouched",
   });

   const passwordValue = watch("password", "");

   const onSubmit = async (data: RegisterFormData) => {
      try {
         await registerMutation(data as RegisterRequest).unwrap();
         toast.success("Account created! Please sign in.");
         navigate(ROUTES.LOGIN);
      } catch {
         // Error handled by RTK Query / getErrorMessage
      }
   };

   return (
      <AuthLayout
         title="Create an account"
         subtitle="Join NoteVault today"
         wide
      >
         {error && (
            // Render 409 errors (username/email taken) as warnings instead of critical errors
            <Alert
               variant={
                  error.toLowerCase().includes("already exists")
                     ? "warning"
                     : "error"
               }
               className="mb-6"
            >
               {error}
            </Alert>
         )}

         <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div style={{ display: "flex", gap: "var(--space-4)" }}>
               <div style={{ flex: 1 }}>
                  <FormField
                     label="Username"
                     htmlFor="username"
                     required
                     error={errors.username?.message}
                  >
                     <Input
                        id="username"
                        placeholder="johndoe"
                        autoComplete="username"
                        disabled={isLoading}
                        hasError={!!errors.username}
                        {...register("username")}
                     />
                  </FormField>
               </div>
               <div style={{ flex: 1 }}>
                  <FormField
                     label="Email"
                     htmlFor="email"
                     required
                     error={errors.email?.message}
                  >
                     <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        autoComplete="email"
                        disabled={isLoading}
                        hasError={!!errors.email}
                        {...register("email")}
                     />
                  </FormField>
               </div>
            </div>

            <FormField
               label="Password"
               htmlFor="password"
               required
               error={errors.password?.message}
            >
               <Input
                  id="password"
                  type={pwdVis.isVisible ? "text" : "password"}
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                  disabled={isLoading}
                  hasError={!!errors.password}
                  rightIcon={
                     pwdVis.isVisible ? <EyeOff size={18} strokeWidth={1.75} /> : <Eye size={18} strokeWidth={1.75} />
                  }
                  onRightIconClick={pwdVis.toggle}
                  {...register("password")}
               />
            </FormField>

            <PasswordStrengthBar password={passwordValue} />

            <FormField
               label="Confirm Password"
               htmlFor="confirmPassword"
               required
               error={errors.confirmPassword?.message}
            >
               <Input
                  id="confirmPassword"
                  type={confirmPwdVis.isVisible ? "text" : "password"}
                  placeholder="Confirm your password"
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
               Create Account
            </Button>
         </form>

         <p className="auth-footer">
            Already have an account?{" "}
            <Link to={ROUTES.LOGIN} className="text-link">
               Sign in
            </Link>
         </p>
      </AuthLayout>
   );
}
