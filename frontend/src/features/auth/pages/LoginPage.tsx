import { useEffect } from "react";
import FormField from "../../../shared/components/ui/FormField";
import { AuthLayout } from "../components/AuthLayout";
import InputBox from "../../../shared/components/ui/InputBox";
import { Button } from "../../../shared/components/ui/Button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../../../constants/app.constants";
import { Alert } from "@/shared/components/ui/Alert";
import { usePasswordVisibility } from "../hooks/useAuthForm";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "../validation/auth.schemas";
import { useLoginMutation } from "../api/authApi";
import { getErrorMessage } from "@/types/api.types";

export function LoginPage() {
   const navigate = useNavigate();
   const location = useLocation();
   const passwordVisibility = usePasswordVisibility();

   // RTK query hanlde the API request, we can get the loading, error and reset functions from the hook
   const [
      login,
      { isLoading: isLocalLoading, error: localError, reset, isSuccess },
   ] = useLoginMutation();

   const isLoading = isLocalLoading;
   const error = getErrorMessage(localError);
   const from =
      (location.state as { from?: { pathname: string } })?.from?.pathname ||
      ROUTES.DASHBOARD;

   // useForm - used to handle form state, validation, and submission
   // resolver - used to validate the form input data against the loginSchema schema
   const {
      register,
      handleSubmit,
      watch,
      formState: { errors },
   } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

   const onSubmit = async (data: LoginFormData) => {
      console.log("onsubmit data:", data);
      try {
         await login(data).unwrap();
         if (isSuccess) {
            alert("Login Successfully !");
         }
         // navigate(from, { replace: true });
      } catch (error) {}
   };

   const allFormValues = watch();
   console.log("Current form state:", allFormValues);

   // Clear API error when the user starts typing/changing inputs
   useEffect(() => {
      const subscription = watch((value, { name }) => {
         if (name && localError) {
            reset();
         }
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
               <InputBox
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
               <InputBox
                  id="password"
                  type={passwordVisibility.isVisible ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={isLoading}
                  hasError={!!errors.password}
                  rightIcon={
                     passwordVisibility.isVisible ? (
                        <EyeOff size={16} />
                     ) : (
                        <Eye size={16} />
                     )
                  }
                  onRightIconClick={passwordVisibility.toggle}
                  {...register("password")}
               />
            </FormField>

            <Button
               type="submit"
               fullWidth
               //isLoading={isLocalLoading}
               disabled={isLoading}
               style={{ marginTop: "var(--space-6)" }}
            >
               Sign In
            </Button>
         </form>

         <div className="flex items-center w-full mt-8">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-gray-300 dark:via-gray-600 dark:to-gray-600 rounded-full"></div>
            <span className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-widest">
               OR
            </span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent via-gray-300 to-gray-300 dark:via-gray-600 dark:to-gray-600 rounded-full"></div>
         </div>

         <p className="mt-6 text-center text-sm text-[hsl(228,12%,58%)]">
            Don&apos;t have an account?{" "}
            <Link to={ROUTES.REGISTER} className="text-link">
               Create one
            </Link>
         </p>
      </AuthLayout>
   );
}
