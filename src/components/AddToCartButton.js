import React, { useContext } from 'react';
import CartContext from '../context/CartProvider';
import { relative } from 'path';

const AddToCartButton = ({ children, productId, variantId }) => {
  const { addToCart, state } = useContext(CartContext);

  const { redirectUrls } = state && state.cart;

  return (
    <div className="bc-product-card">
      <div className="bc-product__actions" data-js="bc-product-group-actions">
        <div className="bc-form bc-product-form">
          <div className="bc-product-form__product-message"></div>
          <button
            className="bc-btn bc-btn--form-submit bc-btn--add_to_cart"
            type="submit"
            onClick={() => addToCart(productId, variantId)}>
            {children}
          </button>
          {state.addedToCart === productId && (
            <div
              style={{
                position: 'relative',
                top: '-150px',
                marginBottom: '-105px'
              }}
              className="bc-ajax-add-to-cart__message-wrapper">
              <p className="bc-ajax-add-to-cart__message bc-alert bc-alert--success">
                Product successfully added to your cart.
                <a href={redirectUrls.checkout_url}>Proceed to Checkout</a>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddToCartButton;
