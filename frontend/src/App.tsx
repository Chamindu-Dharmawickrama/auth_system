import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { ROUTES } from "./constants/app.constants";
import { Spinner } from "./shared/components/ui/Spinner";

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

export default function App() {
    return (
        <>
            <Suspense fallback={<Spinner fullPage message="Loading..." />}>
                <Routes>
                    <Route path={ROUTES.LOGIN} element={<LoginPage />} />
                    <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
                    <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
                    <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
                </Routes>
            </Suspense>
        </>
    );
}
