import { getPasswordStrength } from '../validation/auth.schemas';
import './PasswordStrengthBar.css'

interface PasswordStrengthBarProps {
  password: string;
}

export function PasswordStrengthBar({ password }: PasswordStrengthBarProps) {
  if (!password) return null;

  const { score, level, color } = getPasswordStrength(password);
  const widthPct = `${(score / 5) * 100}%`;
  const label = level.charAt(0).toUpperCase() + level.slice(1);

  return (
    <div className="password-strength" aria-live="polite" aria-atomic="true">
      <div className="strength-bar" role="progressbar" aria-valuenow={score} aria-valuemin={0} aria-valuemax={5}>
        <div
          className="strength-fill"
          style={{ width: widthPct, background: color, transition: 'width 300ms ease, background 300ms ease' }}
        />
      </div>
      <p className="strength-label" style={{ color }}>
        {label} password
      </p>
    </div>
  );
}
