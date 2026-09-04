import { lazy, Suspense, useEffect, useRef } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ROUTES, USER_ROLES } from "./constants/app.constants";
import { ProtectedRoute } from "./shared/guards/ProtectedRoute";
import { GuestRoute } from "./shared/guards/GuestRoute";
import { useAppDispatch } from "./app/hooks";
import { restoreSession } from "./features/auth/slices/authSlice";
import { AppShell } from "./shared/components/layouts/AppShell";

import { LoginPage } from "@/features/auth";
import { RegisterPage } from "@/features/auth";
import { ForgotPasswordPage } from "@/features/auth";
import { ResetPasswordPage } from "@/features/auth";
import { NotesPage } from "@/features/notes";
import { ProfilePage } from "@/features/profile";
import {
   ErrorBoundary,
} from "./shared/components/ErrorBoundary";
import { Toaster } from "react-hot-toast";

export default function App() {
   const dispatch = useAppDispatch();

   // prevent duplicate restore
   const sessionRestored = useRef(false);

   // ensures restoreSession fires exactly once per page load.
   useEffect(() => {
      if (sessionRestored.current) return;
      sessionRestored.current = true;
      dispatch(restoreSession());
   }, [dispatch]);

   return (
      <ErrorBoundary>
         <Toaster
            position="top-right"
            toastOptions={{
               style: {
                  background: "var(--color-bg-card)",
                  color: "var(--color-text-primary)",
                  border: "1px solid var(--color-border)",
                  boxShadow: "var(--shadow-lg)",
               },
               success: {
                  iconTheme: {
                     primary: "hsl(180, 60%, 50%)",
                     secondary: "#111",
                  },
               },
               error: {
                  iconTheme: {
                     primary: "var(--color-danger)",
                     secondary: "#fff",
                  },
               },
            }}
         />
         <Routes>
            <Route
               path={ROUTES.LOGIN}
               element={
                  <GuestRoute>
                     <LoginPage />
                  </GuestRoute>
               }
            />
            <Route
               path={ROUTES.REGISTER}
               element={
                  <GuestRoute>
                     <RegisterPage />
                  </GuestRoute>
               }
            />
            <Route
               path={ROUTES.FORGOT_PASSWORD}
               element={
                  <GuestRoute>
                     <ForgotPasswordPage />
                  </GuestRoute>
               }
            />
            <Route
               path={ROUTES.RESET_PASSWORD}
               element={
                  <GuestRoute>
                     <ResetPasswordPage />
                  </GuestRoute>
               }
            />

            <Route
               path={ROUTES.DASHBOARD}
               element={
                  <ProtectedRoute>
                     <AppShell title="My Notes">
                        <NotesPage />
                     </AppShell>
                  </ProtectedRoute>
               }
            />

            <Route
               path={ROUTES.ADMIN_NOTES}
               element={
                  <ProtectedRoute requiredRole={USER_ROLES.ADMIN}>
                     <AppShell title="All Notes">
                        <NotesPage adminView />
                     </AppShell>
                  </ProtectedRoute>
               }
            />

            <Route
               path={ROUTES.PROFILE}
               element={
                  <ProtectedRoute>
                     <AppShell title="Profile">
                        <ProfilePage />
                     </AppShell>
                  </ProtectedRoute>
               }
            />

            {/* Redirect empty path and 404 to dashboard */}
            <Route
               path="/"
               element={<Navigate to={ROUTES.DASHBOARD} replace />}
            />
            <Route
               path="*"
               element={<Navigate to={ROUTES.DASHBOARD} replace />}
            />
         </Routes>
      </ErrorBoundary>
   );
}
