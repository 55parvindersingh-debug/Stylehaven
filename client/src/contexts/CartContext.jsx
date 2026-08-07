import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api';
const emptyCart = { items: [], itemCount: 0, subtotal: 0, deliveryFee: 0, discount: 0, total: 0, coupon: null };
const CartContext = createContext(null);
export function CartProvider({ children }) {
  const [cart, setCart] = useState(emptyCart); const [loading, setLoading] = useState(true);
  const refreshCart = useCallback(async () => { try { const data = await api('/cart'); setCart(data.cart); } catch { setCart(emptyCart); } finally { setLoading(false); } }, []);
  useEffect(() => { refreshCart(); }, [refreshCart]);
  const perform = async (path, options) => { const data = await api(path, options); if (data.cart) setCart(data.cart); return data; };
  const value = useMemo(() => ({ cart, loading, refreshCart,
    addItem: (payload) => perform('/cart/items', { method: 'POST', body: payload }),
    updateItem: (lineId, quantity) => perform(`/cart/items/${encodeURIComponent(lineId)}`, { method: 'PUT', body: { quantity } }),
    removeItem: (lineId) => perform(`/cart/items/${encodeURIComponent(lineId)}`, { method: 'DELETE' }),
    applyCoupon: (code) => perform('/cart/coupon', { method: 'POST', body: { code } }),
    removeCoupon: () => perform('/cart/coupon', { method: 'DELETE' }),
    clearCart: () => perform('/cart', { method: 'DELETE' }), setCart,
  }), [cart, loading, refreshCart]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
export function useCart() { return useContext(CartContext); }
