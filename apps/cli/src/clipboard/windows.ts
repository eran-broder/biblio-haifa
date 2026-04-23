import { execSync } from 'node:child_process';
import { writeFileSync, unlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const UTF8_BOM = '﻿';

export function copyWindows(text: string): boolean {
  const tmp = path.join(tmpdir(), `_biblio_clip_${process.pid}.txt`);
  try {
    writeFileSync(tmp, UTF8_BOM + text, 'utf8');
    execSync(
      `powershell -NoProfile -Command "Get-Content -Path '${tmp}' -Encoding UTF8 | Set-Clipboard"`,
      { stdio: 'pipe' },
    );
    return true;
  } catch {
    return false;
  } finally {
    try {
      unlinkSync(tmp);
    } catch {
      /* best effort */
    }
  }
}
