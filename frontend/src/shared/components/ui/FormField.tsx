import type { ReactNode } from "react";
import "./FormField.css";

interface FormFieldProps {
   label: string;
   htmlFor: string;
   error?: string;
   hint?: string;
   required?: boolean;
   children: ReactNode;
   /** Optional element rendered to the right of the label (e.g. "Forgot password?" link) */
   labelAction?: ReactNode;
}

export function FormField({
   label,
   htmlFor,
   error,
   hint,
   required,
   children,
   labelAction,
}: FormFieldProps) {
   return (
      <div className="form-group">
         <div
            style={{
               display: "flex",
               justifyContent: "space-between",
               alignItems: "center",
               marginBottom: "var(--space-2)",
            }}
         >
            <label
               className="form-label"
               htmlFor={htmlFor}
               style={{ margin: 0 }}
            >
               {label}
               {required && (
                  <span
                     style={{
                        color: "var(--color-danger)",
                        marginLeft: 2,
                     }}
                  >
                     *
                  </span>
               )}
            </label>
            {labelAction}
         </div>
         {/* this allows us to render a variety of inputs and other controls inside the field */}
         {children}
         {error && (
            <p className="form-error" role="alert" id={`${htmlFor}-error`}>
               {error}
            </p>
         )}
         {hint && !error && <p className="form-hint">{hint}</p>}
      </div>
   );
}
