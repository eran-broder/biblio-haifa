import { useEffect, useState } from 'react';

const STORAGE_KEY = 'biblio.username';

export function useRememberedUsername(): [string, (value: string) => void, () => void] {
  const [value, setValue] = useState('');

  useEffect(() => {
    const saved = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    if (saved) setValue(saved);
  }, []);

  const remember = (v: string) => {
    if (typeof localStorage !== 'undefined') localStorage.setItem(STORAGE_KEY, v);
  };
  const forget = () => {
    if (typeof localStorage !== 'undefined') localStorage.removeItem(STORAGE_KEY);
  };

  return [value, remember, forget];
}
