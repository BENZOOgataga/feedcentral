type FetchOpts = {
  timeoutMs?: number;
  maxBytes?: number;
  redirect?: RequestRedirect;
};

/**
 * Fetch a resource with a timeout and a max-bytes read. Returns a small
 * result object with either buffer on success or an error code.
 */
export async function fetchWithLimit(
  url: string,
  opts: FetchOpts = {}
): Promise<{
  ok: boolean;
  status?: number;
  headers?: Headers;
  buffer?: ArrayBuffer;
  error?: 'timeout' | 'too-large' | 'unsupported-type' | 'redirect' | string;
}> {
  const timeoutMs = opts.timeoutMs ?? 5000;
  const maxBytes = opts.maxBytes ?? 1024 * 1024; // 1MB

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const resp = await fetch(url, { method: 'GET', signal: controller.signal, redirect: opts.redirect ?? 'manual' });

    if (resp.status >= 300 && resp.status < 400) {
      return { ok: false, status: resp.status, error: 'redirect' };
    }

    if (!resp.ok) return { ok: false, status: resp.status, error: 'bad-status' };

    const ct = resp.headers.get('content-type') || '';
    if (!ct.startsWith('image/')) return { ok: false, status: resp.status, error: 'unsupported-type' };

    const lengthHeader = resp.headers.get('content-length');
    if (lengthHeader) {
      const num = Number(lengthHeader);
      if (!Number.isNaN(num) && num > maxBytes) return { ok: false, status: resp.status, error: 'too-large' };
    }

    // Read the body into an ArrayBuffer but stop after maxBytes
    const reader = resp.body?.getReader();
    if (!reader) return { ok: false, status: resp.status, error: 'no-body' };

    const chunks: Uint8Array[] = [];
    let received = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!value) continue;
      received += value.byteLength;
      if (received > maxBytes) {
        try {
          reader.cancel();
        } catch {}
        return { ok: false, status: resp.status, error: 'too-large' };
      }
      chunks.push(value);
    }

    // concat
    const total = chunks.reduce((s, c) => s + c.byteLength, 0);
    const out = new Uint8Array(total);
    let offset = 0;
    for (const c of chunks) {
      out.set(c, offset);
      offset += c.byteLength;
    }

    return { ok: true, status: resp.status, headers: resp.headers, buffer: out.buffer };
  } catch (err: any) {
    if (err && err.name === 'AbortError') return { ok: false, error: 'timeout' };
    return { ok: false, error: String(err) };
  } finally {
    clearTimeout(id);
  }
}

export default fetchWithLimit;
