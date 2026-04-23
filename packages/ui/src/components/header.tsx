import { Brand } from './brand.js';

interface Props {
  right?: React.ReactNode;
}

export function Header({ right }: Props) {
  return (
    <header className="app-header">
      <Brand />
      {right && <div className="action-row">{right}</div>}
    </header>
  );
}
