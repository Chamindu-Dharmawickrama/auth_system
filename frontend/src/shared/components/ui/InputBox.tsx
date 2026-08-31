import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import './InputBox.css'

// Parent input properties, allow to pass all input HTML tag properties to input component
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    onRightIconClick?: () => void;
    hasError?: boolean;
}

// forwardRef to allow parent to get ref to the input element
const InputBox = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            leftIcon,
            rightIcon,
            onRightIconClick,
            hasError = false,
            className = "",
            ...props
        },
        ref,
    ) => {
        const withLeft = leftIcon ? "input-with-icon" : "";
        const withRight = rightIcon ? "input-with-icon-right" : "";
        const errorClass = hasError ? "error" : "";
        return (
            <div className="input-wrapper">
                {leftIcon && <span className="input-icon">{leftIcon}</span>}
                <input
                    ref={ref}
                    className={`form-input ${withLeft} ${withRight} ${errorClass} ${className}`.trim()}
                    {...props}
                />
                {rightIcon && (
                    <button
                        type="button"
                        className="input-icon-right"
                        onClick={onRightIconClick}
                        tabIndex={-1}
                        aria-hidden="true"
                    >
                        {rightIcon}
                    </button>
                )}
            </div>
        );
    },
);

export default InputBox;
