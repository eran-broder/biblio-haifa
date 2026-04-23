import { currentPlatform, Platform } from './platform.js';
import { copyLinux } from './linux.js';
import { copyMac } from './mac.js';
import { copyWindows } from './windows.js';

export function copyToClipboard(text: string): boolean {
  switch (currentPlatform()) {
    case Platform.Windows:
      return copyWindows(text);
    case Platform.Mac:
      return copyMac(text);
    case Platform.Linux:
      return copyLinux(text);
  }
}
