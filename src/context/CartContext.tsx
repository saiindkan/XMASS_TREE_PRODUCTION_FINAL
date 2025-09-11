"use client";
import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  img: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (id: number) => number;
  getCartTotal: () => number;
  getCartItemCount: () => number;
  restoreCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'xmas_tree_shop_cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session, status } = useSession();

  // Load cart from localStorage on initial render
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Failed to load cart from storage', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Ensure cart persists across session changes (but respect user's clear cart action)
  useEffect(() => {
    console.log('Session restoration useEffect triggered - status:', status, 'cart.length:', cart.length);
    if (status === 'authenticated' || status === 'unauthenticated') {
      // When session status changes, only restore cart if it's not intentionally empty
      try {
        const savedCart = localStorage.getItem(CART_STORAGE_KEY);
        console.log('Saved cart from localStorage:', savedCart);
        
        // Only restore if:
        // 1. We have saved cart data
        // 2. Current cart is empty 
        // 3. Saved cart is not empty (not "[]")
        // 4. Saved cart is not null (not cleared)
        if (savedCart && cart.length === 0 && savedCart !== '[]' && savedCart !== 'null') {
          const parsedCart = JSON.parse(savedCart);
          console.log('Parsed cart:', parsedCart);
          // Only restore if there are actually items in localStorage
          if (parsedCart && parsedCart.length > 0) {
            console.log('RESTORING CART FROM SESSION CHANGE');
            setCart(parsedCart);
          }
        } else {
          console.log('Not restoring cart - conditions not met');
        }
      } catch (error) {
        console.error('Failed to restore cart after session change', error);
      }
    }
  }, [status, cart.length]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      console.log('Cart state changed:', cart);
      console.log('Cart length:', cart.length);
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
        console.log('Cart saved to localStorage:', cart);
        if (cart.length === 0) {
          console.log('EMPTY CART SAVED TO LOCALSTORAGE');
        }
      } catch (error) {
        console.error('Failed to save cart to storage', error);
      }
    }
  }, [cart, isLoading]);

  // Handle storage events from other tabs (but don't auto-restore empty cart)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === CART_STORAGE_KEY && e.newValue) {
        try {
          const savedCart = JSON.parse(e.newValue);
          // Only restore if we have items in localStorage and our current cart is empty
          // But don't restore if the localStorage cart is empty (user cleared it intentionally)
          if (savedCart && savedCart.length > 0 && cart.length === 0) {
            setCart(savedCart);
          }
        } catch (error) {
          console.error('Failed to restore cart from storage event', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [cart.length]);

  const addToCart = useCallback((item: Omit<CartItem, "quantity">, quantity: number = 1) => {
    setCart((prev) => {
      // Create a unique key based on both ID and name (which includes height)
      const existingItem = prev.find((i) => i.id === item.id && i.name === item.name);
      if (existingItem) {
        return prev.map((i) =>
          i.id === item.id && i.name === item.name
            ? { ...i, quantity: i.quantity + quantity } 
            : i
        );
      }
      return [...prev, { ...item, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((id: number, name?: string) => {
    console.log('=== removeFromCart called for id:', id, 'name:', name, '===');
    console.log('Current cart state before removal:', cart);
    console.log('Cart length before removal:', cart.length);
    
    setCart((prev) => {
      console.log('Previous cart state in setCart:', prev);
      const newCart = prev.filter((item) => {
        // If name is provided, match both ID and name (for height variations)
        if (name) {
          return !(item.id === id && item.name === name);
        }
        // Otherwise, just match ID (for backward compatibility)
        return item.id !== id;
      });
      console.log('New cart state after removal:', newCart);
      console.log('New cart length after removal:', newCart.length);
      if (newCart.length === 0) {
        console.log('CART IS NOW EMPTY - REMOVING LAST ITEM');
        // Immediately clear localStorage to prevent restoration
        try {
          localStorage.removeItem(CART_STORAGE_KEY);
          console.log('localStorage immediately cleared for empty cart');
        } catch (error) {
          console.error('Failed to clear localStorage immediately:', error);
        }
      }
      return newCart;
    });
  }, [cart]);

  const updateQuantity = useCallback((id: number, quantity: number, name?: string) => {
    if (quantity <= 0) {
      removeFromCart(id, name);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        // If name is provided, match both ID and name (for height variations)
        if (name) {
          return (item.id === id && item.name === name) ? { ...item, quantity } : item;
        }
        // Otherwise, just match ID (for backward compatibility)
        return item.id === id ? { ...item, quantity } : item;
      })
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    console.log('clearCart called - setting cart to empty array');
    setCart([]);
    // Also clear localStorage immediately
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
      console.log('localStorage cleared');
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  }, []);

  const getItemQuantity = useCallback((id: number, name?: string) => {
    if (name) {
      return cart.find((item) => item.id === id && item.name === name)?.quantity || 0;
    }
    return cart.find((item) => item.id === id)?.quantity || 0;
  }, [cart]);

  const getCartTotal = useCallback(() => {
    return cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }, [cart]);

  const getCartItemCount = useCallback(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  const restoreCart = useCallback(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
        console.log('Cart restored from localStorage:', parsedCart);
      }
    } catch (error) {
      console.error('Failed to restore cart manually', error);
    }
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getItemQuantity,
        getCartTotal,
        getCartItemCount,
        restoreCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
