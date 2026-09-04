import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { NOTE_CONSTRAINTS } from '@/constants/app.constants';
import './Textarea.css'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
  showCounter?: boolean;
  currentLength?: number;
  maxLength?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      hasError = false,
      showCounter = false,
      currentLength = 0,
      maxLength,
      className = '',
      ...props
    },  
    ref,
  ) => {
    const limit = maxLength ?? NOTE_CONSTRAINTS.CONTENT_MAX;
    const isOver = currentLength > limit;

    return (
      <div>
        <textarea
          ref={ref}
          className={`form-textarea ${hasError ? 'error' : ''} ${className}`.trim()}
          maxLength={limit + 100}
          {...props}
        />
        {showCounter && (
          <p className={`char-counter ${isOver ? 'over' : ''}`}>
            {currentLength.toLocaleString()}/{limit.toLocaleString()}
          </p>
        )}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';
