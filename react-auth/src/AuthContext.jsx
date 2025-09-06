import { createContext, useContext, useEffect, useState } from 'react';
import { get, post } from './api';

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchMe() {
    try {
      const r = await get('/me');
      if (r.ok) setUser(await r.json());
      else setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMe();
  }, []);

  async function register(email, password, name) {
    const r = await post('/auth/register', { email, password, name });
    if (!r.ok) throw await r.json();
    const u = await r.json();
    setUser(u);
  }

  async function login(email, password) {
    const r = await post('/auth/login', { email, password });
    if (!r.ok) throw await r.json();
    const u = await r.json();
    setUser(u);
  }

  async function logout() {
    await post('/auth/logout');
    setUser(null);
  }

  const value = { user, loading, register, login, logout };
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}
