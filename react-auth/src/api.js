const API = import.meta.env.VITE_API;

async function request(method, path, body, opts = {}) {
  const res = await fetch(`${API}${path}`, {
    method,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  return res;
}

// auto-refresh on 401
export async function api(method, path, body) {
  let r = await request(method, path, body);
  if (r.status === 401 && path !== '/auth/refresh') {
    const rr = await request('POST', '/auth/refresh');
    if (rr.ok) r = await request(method, path, body);
  }
  return r;
}

export const get = (p) => api('GET', p);
export const post = (p, b) => api('POST', p, b);
