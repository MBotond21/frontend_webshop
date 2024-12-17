import { createContext, useState } from "react";
import { Product } from "../product";

interface CartContextState {
    cart: Product[];
    addNewProduct: (newProduct: Product) => void;
    removeProduct: (id: number) =>void;
  }

export const CartContext = createContext<CartContextState>({
  cart: [],
  addNewProduct: () => {},
  removeProduct: () => {}
});
 
export const CartContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Product[]>([]);

  const addNewProduct = (newProduct: Product) => {
    setCart([...cart, newProduct]);
  }

  const removeProduct = (id: number) => {
    setCart(cart.filter((product) => product.id != id));
  }
 
  return (
    <CartContext.Provider value={{cart, addNewProduct, removeProduct}}>
      {children}
    </CartContext.Provider>
  );
};