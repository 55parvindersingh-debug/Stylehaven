import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api';
import { useAuth } from './AuthContext';
const WishlistContext = createContext(null);
export function WishlistProvider({ children }) {
  const { user } = useAuth(); const [items, setItems] = useState([]); const [loading, setLoading] = useState(false);
  const refresh = useCallback(async () => {
    if (!user) { setItems([]); return; }
    setLoading(true); try { const data = await api('/wishlist'); setItems(data.items || []); } catch { setItems([]); } finally { setLoading(false); }
  }, [user]);
  useEffect(() => { refresh(); }, [refresh]);
  const perform = async (path, method) => { const data = await api(path, { method }); setItems(data.items || []); return data; };
  const value = useMemo(() => ({ items, loading, refresh, has: (id) => items.some((item) => item._id === id), add: (id) => perform(`/wishlist/${id}`, 'POST'), remove: (id) => perform(`/wishlist/${id}`, 'DELETE') }), [items, loading, refresh]);
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}
export function useWishlist() { return useContext(WishlistContext); }
