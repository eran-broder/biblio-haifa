import { useState, type FormEvent } from 'react';
import { LogIn } from 'lucide-react';
import type { Credentials } from '@biblio/core';
import { useRememberedUsername } from '../hooks/use-remembered-username.js';
import { LoginField } from './login-field.js';

interface Props {
  onSubmit: (creds: Credentials, remember: boolean) => void;
  isLoading: boolean;
  error?: string | null;
}

export function LoginForm({ onSubmit, isLoading, error }: Props) {
  const [remembered, remember] = useRememberedUsername();
  const [username, setUsername] = useState(remembered);
  const [password, setPassword] = useState('');
  const [shouldRemember, setShouldRemember] = useState(true);

  const effectiveUsername = username || remembered;
  const canSubmit = !isLoading && effectiveUsername.trim() && password.trim();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit) return;
    const trimmed = effectiveUsername.trim();
    remember(trimmed);
    onSubmit({ username: trimmed, password }, shouldRemember);
  };

  return (
    <form onSubmit={handleSubmit} className="login-wrap" noValidate>
      <div className="login-intro">
        <div className="login-intro-mark">biblio</div>
        <div className="login-intro-caption">הרישום המשפחתי של ספריות חיפה</div>
      </div>

      <LoginField
        id="username"
        label="שם משתמש"
        value={effectiveUsername}
        onChange={setUsername}
        autoComplete="username"
        autoFocus
      />
      <LoginField
        id="password"
        label="סיסמה"
        type="password"
        value={password}
        onChange={setPassword}
        autoComplete="current-password"
      />

      <label className="remember-row">
        <input
          type="checkbox"
          checked={shouldRemember}
          onChange={(e) => setShouldRemember(e.target.checked)}
        />
        <span className="remember-box" aria-hidden="true" />
        <span className="remember-label">זכור אותי במכשיר הזה</span>
      </label>

      <button type="submit" disabled={!canSubmit} className="submit-btn">
        <LogIn size={15} strokeWidth={2} />
        <span>{isLoading ? 'מתחבר…' : 'היכנס'}</span>
      </button>

      {error && <div className="error-note">{error}</div>}
    </form>
  );
}
