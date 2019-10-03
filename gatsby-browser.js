import React from 'react';
import { CartProvider } from './src/context/CartProvider';
export const wrapRootElement = ({ element }) => (
  <CartProvider>{element}</CartProvider>
);
