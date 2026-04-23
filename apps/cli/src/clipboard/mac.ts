import { execSync } from 'node:child_process';

export function copyMac(text: string): boolean {
  try {
    execSync('pbcopy', { input: text });
    return true;
  } catch {
    return false;
  }
}
