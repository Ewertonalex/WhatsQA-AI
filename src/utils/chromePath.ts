import fs from 'fs';
import os from 'os';
import path from 'path';

const WINDOWS_CANDIDATES = [
  process.env.PUPPETEER_EXECUTABLE_PATH,
  process.env.CHROME_PATH,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  path.join(
    os.homedir(),
    'AppData',
    'Local',
    'Google',
    'Chrome',
    'Application',
    'chrome.exe',
  ),
];

const UNIX_CANDIDATES = [
  process.env.PUPPETEER_EXECUTABLE_PATH,
  process.env.CHROME_PATH,
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
];

export function resolveChromeExecutable(): string | undefined {
  const candidates = process.platform === 'win32' ? WINDOWS_CANDIDATES : UNIX_CANDIDATES;

  for (const candidate of candidates) {
    if (!candidate) {
      continue;
    }
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return undefined;
}
