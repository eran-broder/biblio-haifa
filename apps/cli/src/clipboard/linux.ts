import { execSync } from 'node:child_process';

const CANDIDATES = ['wl-copy', 'xclip -selection clipboard'];

export function copyLinux(text: string): boolean {
  for (const cmd of CANDIDATES) {
    try {
      execSync(cmd, { input: text });
      return true;
    } catch {
      /* try next */
    }
  }
  return false;
}
