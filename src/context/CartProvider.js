import React, { createContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => (
  <CartContext.Provider value={{ itemsTotal: 2 }}>
    {children}
  </CartContext.Provider>
);

export default CartContext;
