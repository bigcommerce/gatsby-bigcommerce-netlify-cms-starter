import React, { createContext, useState, useEffect } from 'react';

const PriceContext = createContext();

export const PriceProvider = ({ children }) => {
  const [prices, setPrices] = useState({});

  const fetchPrices = () => {
    fetch(`/.netlify/functions/bigcommerce?endpoint=catalog/products`, {
      credentials: 'same-origin',
      mode: 'same-origin'
    })
      .then(res => res.json())
      .then(response => {
        setPrices(
          response.data &&
            response.data.reduce((acc, item) => {
              acc[item.id] = item;
              return acc;
            }, {})
        );
      })
      .catch(error => {
        console.error(error);
        setPrices({ error });
      });
  };

  useEffect(() => fetchPrices(), []);

  return (
    <PriceContext.Provider value={prices}>{children}</PriceContext.Provider>
  );
};

export default PriceContext;
