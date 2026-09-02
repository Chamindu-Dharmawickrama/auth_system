import React, { Suspense, useEffect, useRef } from "react";
import { Route, Routes } from "react-router-dom";
import { ROUTES } from "./constants/app.constants";
import { Spinner } from "./shared/components/ui/Spinner";
import { ProtectedRoute } from "./shared/guards/ProtectedRoute";
import { GuestRoute } from "./shared/guards/GuestRoute";
import { useAppDispatch } from "./app/hooks";
import { restoreSession } from "./features/auth/slices/authSlice";

// lazy load them to improve the initial load time of the application.
const LoginPage = React.lazy(() =>
   import("@/features/auth").then((m) => ({ default: m.LoginPage })),
);
const RegisterPage = React.lazy(() =>
   import("@/features/auth").then((m) => ({ default: m.RegisterPage })),
);
const ForgotPasswordPage = React.lazy(() =>
   import("@/features/auth").then((m) => ({ default: m.ForgotPasswordPage })),
);
const ResetPasswordPage = React.lazy(() =>
   import("@/features/auth").then((m) => ({ default: m.ResetPasswordPage })),
);
const NotePage = React.lazy(() =>
   import("@/features/notes").then((m) => ({ default: m.NotePage })),
);

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
      <>
         <Suspense fallback={<Spinner fullPage message="Loading..xx" />}>
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
                        <NotePage />
                     </ProtectedRoute>
                  }
               />
            </Routes>
         </Suspense>
      </>
   );
}
