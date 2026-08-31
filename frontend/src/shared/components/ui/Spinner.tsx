import styles from './Spinner.module.css';

export type SpinnerSize = 'sm' | 'md' | 'lg';

interface SpinnerProps {
  size?: SpinnerSize;
  fullPage?: boolean;
  message?: string;
}

export function Spinner({ size = 'md', fullPage = false, message }: SpinnerProps) {
  const sizeClass = styles[size] || styles.md;

  if (fullPage) {
    return (
      <div className={styles.pageLoader}>
        <div className={`${styles.spinner} ${styles.lg}`} />
        {message && (
          <p className={styles.message}>
            {message}
          </p>
        )}
      </div>
    );
  }

  return <div className={`${styles.spinner} ${sizeClass}`} role="status" aria-label="Loading" />;
}
