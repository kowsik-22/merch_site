"use client";

import {
  createContext,
  useContext,
  useState,
  useMemo,
  ReactNode,
} from "react";
import { Product } from "@/lib/products";

export type CartItem = {
  cartItemId: string; // unique per product+size+color combo
  product: Product;
  size: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (product: Product, size: string, quantity: number) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  itemCount: number;
  subtotal: number;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  function addItem(product: Product, size: string, quantity: number) {
    const cartItemId = `${product.id}-${size}`;
    setItems((prev) => {
      const existing = prev.find((i) => i.cartItemId === cartItemId);
      if (existing) {
        return prev.map((i) =>
          i.cartItemId === cartItemId
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { cartItemId, product, size, quantity }];
    });
  }

  function removeItem(cartItemId: string) {
    setItems((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
  }

  function updateQuantity(cartItemId: string, quantity: number) {
    if (quantity < 1) return;
    setItems((prev) =>
      prev.map((i) => (i.cartItemId === cartItemId ? { ...i, quantity } : i))
    );
  }

  const itemCount = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () =>
      items.reduce(
        (sum, i) => sum + i.product.priceInRupees * i.quantity,
        0
      ),
    [items]
  );

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, itemCount, subtotal }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
