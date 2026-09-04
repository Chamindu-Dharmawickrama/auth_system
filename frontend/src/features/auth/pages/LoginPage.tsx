import { useEffect } from "react";
import { FormField, Input, Button, Alert } from "@/shared/components/ui";
import { AuthLayout } from "../components/AuthLayout";
import { GoogleSignInButton } from "../components/GoogleSignInButton";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../../../constants/app.constants";
import { usePasswordVisibility } from "../hooks/useAuthForm";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "../validation/auth.schemas";
import { useLoginMutation } from "../api/authApi";
import { getErrorMessage } from "@/types/api.types";
import { sanitizeRedirectPath } from "@/shared/utils/routeUtils";

export function LoginPage() {
   const navigate = useNavigate();
   const location = useLocation();
   const passwordVisibility = usePasswordVisibility();

   // RTK query hanlde the API request, we can get the loading, error and reset functions from the hook
   const [login, { isLoading, error: localError, reset, isSuccess }] =
      useLoginMutation();

   const error = getErrorMessage(localError);
   const from = sanitizeRedirectPath(
      (location.state as { from?: { pathname: string } })?.from?.pathname,
      ROUTES.DASHBOARD,
   );

   // useForm - used to handle form state, validation, and submission
   // resolver - used to validate the form input data against the loginSchema schema
   const {
      register,
      handleSubmit,
      watch,
      formState: { errors },
   } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

   const onSubmit = async (data: LoginFormData) => {
      try {
         await login(data).unwrap();
         navigate(from, { replace: true });
      } catch {
         // error is surfaced via `error` above
      }
   };

   // Clear API error when the user starts typing/changing inputs
   useEffect(() => {
      const subscription = watch((_, { name }) => {
         if (name && localError) reset();
      });
      return () => subscription.unsubscribe();
   }, [watch, localError, reset]);

   return (
      <AuthLayout
         title="Welcome back"
         subtitle="Sign in to your account to continue"
      >
         {error && (
            <Alert variant="error" className="mb-6">
               {error}
            </Alert>
         )}

         <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <FormField
               label="Username"
               htmlFor="username"
               error={errors.username?.message}
            >
               <Input
                  id="username"
                  placeholder="Enter your username"
                  autoComplete="username"
                  disabled={isLoading}
                  hasError={!!errors.username}
                  {...register("username")}
               />
            </FormField>

            <FormField
               label="Password"
               htmlFor="password"
               error={errors.password?.message}
               labelAction={
                  <Link
                     to={ROUTES.FORGOT_PASSWORD}
                     className="text-link"
                     style={{ fontSize: "var(--text-xs)" }}
                  >
                     Forgot password?
                  </Link>
               }
            >
               <Input
                  id="password"
                  type={passwordVisibility.isVisible ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={isLoading}
                  hasError={!!errors.password}
                  rightIcon={
                     passwordVisibility.isVisible ? (
                        <EyeOff size={18} strokeWidth={1.75} />
                     ) : (
                        <Eye size={18} strokeWidth={1.75} />
                     )
                  }
                  onRightIconClick={passwordVisibility.toggle}
                  {...register("password")}
               />
            </FormField>

            <Button
               type="submit"
               fullWidth
               isLoading={isLoading}
               disabled={isLoading}
               style={{ marginTop: "var(--space-6)" }}
            >
               Sign In
            </Button>
         </form>

         {/* ── Divider ───────────────────────────────────────────────────── */}
         <div className="auth-divider">
            <span className="auth-divider-label">or</span>
         </div>

         {/* ── Google Sign-In ────────────────────────────────────────────── */}
         <GoogleSignInButton />

         <p className="auth-footer">
            Don&apos;t have an account?{" "}
            <Link to={ROUTES.REGISTER} className="text-link">
               Create one
            </Link>
         </p>
      </AuthLayout>
   );
}
