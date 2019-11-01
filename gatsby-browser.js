import React from 'react';
import { CartProvider } from './src/context/CartProvider';
import { PriceProvider } from './src/context/PriceProvider';
export const wrapRootElement = ({ element }) => (
  <PriceProvider>
    <CartProvider>{element}</CartProvider>
  </PriceProvider>
);
