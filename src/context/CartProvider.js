import React, { createContext, useState, useEffect } from 'react';

const CartContext = createContext();

const emptyCartObj = {
  currency: {
    code: 'USD'
  },
  cartAmount: 0,
  lineItems: {},
  numberItems: 0,
  redirectUrls: {}
};
export const CartProvider = ({ children }) => {
  const [state, setState] = useState({
    cartLoading: false,
    cartError: false,
    cart: emptyCartObj
  });

  const fetchCart = () => {
    fetch(`/.netlify/functions/bigcommerce?endpoint=carts`, {
      credentials: 'same-origin',
      mode: 'same-origin'
    })
      .then(res => res.json())
      .then(response => {
        console.log(response);
        refreshCart(response);
      })
      .catch(error => {
        setState({ ...state, cartLoading: false, cartError: error });
      });
  };

  useEffect(() => fetchCart(), []);

  const refreshCart = response => {
    console.log('refreshcart', response);
    if (response.status === 204 || response.status === 404) {
      setState({ ...state, cartLoading: false, cart: emptyCartObj });
    } else {
      const lineItems = response.data.line_items;
      const cartAmount = response.data.cart_amount;
      const currency = response.data.currency;

      setState({
        ...state,
        cartLoading: false,
        cart: {
          currency,
          cartAmount,
          lineItems,
          numberItems:
            lineItems.physical_items.length +
            lineItems.digital_items.length +
            lineItems.custom_items.length +
            lineItems.gift_certificates.length,
          redirectUrls: response.data.redirect_urls
        }
      });
    }
  };
  const addToCart = (productId, variantId) => {
    setState({ ...state, addingToCart: true });
    fetch(`/.netlify/functions/bigcommerce?endpoint=carts/items`, {
      method: 'POST',
      credentials: 'same-origin',
      body: JSON.stringify({
        line_items: [
          {
            quantity: 1,
            product_id: parseInt(productId),
            variant_id: parseInt(variantId)
          }
        ]
      })
    })
      .then(res => res.json())
      .then(response => {
        const lineItems = response.data.line_items;
        const cartAmount = response.data.cart_amount;
        const currency = response.data.currency;

        setState({
          ...state,
          addingToCart: false,
          addedToCart: true,
          cart: {
            currency,
            cartAmount,
            lineItems,
            numberItems:
              lineItems.physical_items.length +
              lineItems.digital_items.length +
              lineItems.custom_items.length +
              lineItems.gift_certificates.length,
            redirectUrls: response.data.redirect_urls
          }
        });
      })
      .catch(error => {
        setState({ ...state, addingToCart: false, addToCartError: error });
      });
  };
  return (
    <CartContext.Provider value={{ state, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
