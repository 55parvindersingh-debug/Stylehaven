import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api';
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); const [loading, setLoading] = useState(true);
  const refresh = useCallback(async () => { try { const data = await api('/auth/me'); setUser(data.user || null); } catch { setUser(null); } finally { setLoading(false); } }, []);
  useEffect(() => { refresh(); }, [refresh]);
  const login = async (payload) => { const data = await api('/auth/login', { method: 'POST', body: payload }); setUser(data.user); return data; };
  const signup = async (payload) => { const data = await api('/auth/signup', { method: 'POST', body: payload }); setUser(data.user); return data; };
  const logout = async () => { await api('/auth/logout', { method: 'POST' }); setUser(null); };
  const updateProfile = async (payload) => { const data = await api('/auth/profile', { method: 'PUT', body: payload }); setUser(data.user); return data; };
  const value = useMemo(() => ({ user, loading, login, signup, logout, refresh, updateProfile }), [user, loading, refresh]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() { return useContext(AuthContext); }
