interface Props {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
  autoFocus?: boolean;
}

export function LoginField({
  id,
  label,
  value,
  onChange,
  type = 'text',
  autoComplete,
  autoFocus,
}: Props) {
  return (
    <label htmlFor={id} className="field">
      <span className="field-label">{label}</span>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        dir="ltr"
        className="field-input"
      />
    </label>
  );
}
