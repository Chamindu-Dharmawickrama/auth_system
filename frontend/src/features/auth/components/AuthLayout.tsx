import { Notebook } from "lucide-react";
import type { ReactNode } from "react";
import "./AuthLayout.css";

interface AuthLayoutProps {
    title: string;
    subtitle: string;
    children: ReactNode;
    wide?: boolean;
}

// common layout for auth pages
export function AuthLayout({
    title,
    subtitle,
    children,
    wide = false,
}: AuthLayoutProps) {
    return (
        <div className="auth-page">
            <div
                className="auth-container"
                style={{ maxWidth: wide ? 480 : 440 }}
            >
                <div className="auth-card">
                    {/* Logo mark */}
                    <div className="auth-logo">
                        <div className="auth-logo-icon">
                            <Notebook size={20} color="#fff" />
                        </div>
                        <span className="auth-logo-text">NoteVault</span>
                    </div>

                    <h1 className="auth-title">{title}</h1>
                    <p className="auth-subtitle">{subtitle}</p>

                    {children}
                </div>
            </div>
        </div>
    );
}
