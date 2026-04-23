import { ANSI } from './ansi.js';

export function header(text: string): void {
  console.log(`${ANSI.bold}${ANSI.cyan}${text}${ANSI.reset}`);
}

export function info(text: string): void {
  console.log(`${ANSI.dim}${text}${ANSI.reset}`);
}

export function ok(text: string): void {
  console.log(`${ANSI.green}✓${ANSI.reset} ${text}`);
}

export function fail(text: string): void {
  console.log(`${ANSI.red}✗${ANSI.reset} ${text}`);
}
