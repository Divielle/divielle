import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { trpc } from "@/lib/trpc";

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("divielle-session");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("divielle-session", id);
  }
  return id;
}

interface CartContextType {
  sessionId: string;
  cartCount: number;
  refreshCart: () => void;
}

const CartContext = createContext<CartContextType>({
  sessionId: "",
  cartCount: 0,
  refreshCart: () => {},
});

export function CartProvider({ children }: { children: ReactNode }) {
  const [sessionId] = useState(getSessionId);

  const { data: cartItems, refetch } = trpc.shop.getCart.useQuery(
    { sessionId },
    { enabled: !!sessionId }
  );

  const cartCount = cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{ sessionId, cartCount, refreshCart: refetch }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
