import { resolveChromeExecutable } from '../../../src/utils/chromePath';

describe('resolveChromeExecutable', () => {
  it('encontra Chrome no Windows quando instalado', () => {
    const pathFound = resolveChromeExecutable();
    if (process.platform === 'win32') {
      expect(pathFound).toBeTruthy();
      expect(pathFound?.toLowerCase()).toContain('chrome');
    } else {
      expect(pathFound === undefined || typeof pathFound === 'string').toBe(true);
    }
  });
});
