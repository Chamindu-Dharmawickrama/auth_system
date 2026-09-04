import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import "./Button.css";

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost" | "google";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            variant = "primary",
            size = "md",
            isLoading = false,
            leftIcon,
            rightIcon,
            fullWidth = false,
            disabled,
            children,
            className = "",
            ...props
        },
        ref,
    ) => {
        const sizeClass =
            size === "sm" ? "btn-sm" : size === "lg" ? "btn-lg" : "";
        const variantClass = `btn-${variant}`;

        return (
            <button
                ref={ref}
                className={`btn ${variantClass} ${sizeClass} ${fullWidth ? "btn-full" : ""} ${className}`.trim()}
                disabled={disabled ?? isLoading}
                {...props}
            >
                {isLoading ? (
                    <>
                        <div
                            className="spinner spinner-sm"
                            style={{
                                borderTopColor:
                                    variant === "primary" ||
                                    variant === "danger"
                                        ? "#fff"
                                        : "var(--color-primary)",
                            }}
                        />
                        {children}
                    </>
                ) : (
                    <>
                        {leftIcon}
                        {children}
                        {rightIcon}
                    </>
                )}
            </button>
        );
    },
);

Button.displayName = "Button";
