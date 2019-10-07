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
        refreshCart(response);
      })
      .catch(error => {
        setState({ ...state, cartLoading: false, cartError: error });
      });
  };

  useEffect(() => fetchCart(), []);

  const refreshCart = response => {
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
      mode: 'same-origin',
      body: JSON.stringify({
        line_items: [
          {
            quantity: 1,
            product_id: parseInt(productId, 10),
            variant_id: parseInt(variantId, 10)
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
          addedToCart: productId,
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

  const updateItemInCart = (itemId, updatedItemData) => {
    fetch(
      `/.netlify/functions/bigcommerce?endpoint=carts/items&itemId=${itemId}`,
      {
        credentials: 'same-origin',
        mode: 'same-origin',
        method: 'put',
        body: JSON.stringify(updatedItemData)
      }
    )
      .then(res => res.json())
      .then(response => {
        refreshCart(response);
      })
      .catch(error => {
        setState({ ...state, cartLoading: false, cartError: error });
      });
  };

  const removeItemFromCart = itemId => {
    fetch(
      `/.netlify/functions/bigcommerce?endpoint=carts/items&itemId=${itemId}`,
      {
        credentials: 'same-origin',
        mode: 'same-origin',
        method: 'delete'
      }
    )
      .then(res => res.json())
      .then(response => {
        refreshCart(response);
      })
      .catch(error => {
        setState({ ...state, cartLoading: false, cartError: error });
      });
  };

  const updateCartItemQuantity = (item, action) => {
    const newQuantity = item.quantity + (action === 'minus' ? -1 : 1);

    if (newQuantity < 1) {
      removeItemFromCart(item.id);
    } else {
      let productVariantReferences = null;

      if (typeof item.product_id !== 'undefined') {
        productVariantReferences = {
          product_id: item.product_id,
          variant_id: item.variant_id
        };
      }

      updateItemInCart(item.id, {
        line_item: {
          quantity: newQuantity,
          ...productVariantReferences
        }
      });
    }
  };

  return (
    <CartContext.Provider
      value={{ state, addToCart, removeItemFromCart, updateCartItemQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
