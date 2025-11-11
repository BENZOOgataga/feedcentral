import { getImageProxyConfig, isHostAllowed } from '@/lib/imageProxyConfig';

describe('imageProxyConfig', () => {
  afterEach(() => {
    jest.resetModules();
    delete process.env.IMAGE_PROXY_ALLOWED_HOSTS;
  });

  test('default config returns sensible defaults', () => {
    const cfg = getImageProxyConfig();
    expect(cfg.maxBytes).toBeGreaterThan(0);
    expect(cfg.allowedHosts.length).toBeGreaterThan(0);
  });

  test('isHostAllowed matches exact and suffix', () => {
    process.env.IMAGE_PROXY_ALLOWED_HOSTS = 'example.com,cloudfront.net';
    // reload module to pick up env
    const mod = require('@/lib/imageProxyConfig') as typeof import('@/lib/imageProxyConfig');
    const cfg = mod.getImageProxyConfig();
    expect(mod.isHostAllowed('cdn.example.com', cfg)).toBe(true);
    expect(mod.isHostAllowed('foo.cloudfront.net', cfg)).toBe(true);
    expect(mod.isHostAllowed('evil.com', cfg)).toBe(false);
  });
});
