import { createContext, useState } from "react";
import { Product } from "../product";

interface MyContextState {
    cart: Product[];
    addNewProduct: (newProduct: Product) => void;
  }

export const CartContext = createContext<MyContextState | undefined>(undefined);
 
export const CartContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Product[]>([]);

  const addNewProduct = (newProduct: Product) => {
    setCart([...cart, newProduct]);
  }
 
  return (
    <CartContext.Provider value={{cart, addNewProduct}}>
      {children}
    </CartContext.Provider>
  );
};