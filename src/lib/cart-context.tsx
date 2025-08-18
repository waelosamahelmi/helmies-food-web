import { createContext, useContext, useState, useEffect } from "react";
import type { MenuItem } from "@shared/schema";

export interface CartItem {
  id: number;
  menuItem: MenuItem;
  quantity: number;
  size?: string;
  toppings?: string[];
  specialInstructions?: string;
  toppingsPrice?: number;
  sizePrice?: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (menuItem: MenuItem, quantity?: number, size?: string, toppings?: string[], specialInstructions?: string, toppingsPrice?: number, sizePrice?: number) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Failed to load cart from localStorage:", error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const addItem = (menuItem: MenuItem, quantity = 1, size?: string, toppings?: string[], specialInstructions?: string, toppingsPrice = 0, sizePrice = 0) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(item => 
        item.menuItem.id === menuItem.id && 
        item.size === size &&
        JSON.stringify(item.toppings?.sort()) === JSON.stringify(toppings?.sort()) &&
        item.specialInstructions === specialInstructions
      );

      if (existingItem) {
        return currentItems.map(item =>
          item.id === existingItem.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        const newId = Math.max(0, ...currentItems.map(item => item.id)) + 1;
        return [...currentItems, {
          id: newId,
          menuItem,
          quantity,
          size,
          toppings,
          specialInstructions,
          toppingsPrice,
          sizePrice,
        }];
      }
    });
  };

  const removeItem = (id: number) => {
    setItems(currentItems => currentItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }

    setItems(currentItems =>
      currentItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => {
    const basePrice = parseFloat(item.menuItem.price);
    const toppingsPrice = item.toppingsPrice || 0;
    const sizePrice = item.sizePrice || 0;
    return sum + ((basePrice + toppingsPrice + sizePrice) * item.quantity);
  }, 0);

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
    }}>
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
