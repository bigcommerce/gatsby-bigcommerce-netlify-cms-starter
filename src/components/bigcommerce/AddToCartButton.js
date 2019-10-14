import React, { useContext } from 'react';
import CartContext from '../../context/CartProvider';

const AddToCartButton = ({ children, productId, variantId }) => {
  const value = useContext(CartContext);
  const addToCart = value && value.addToCart;
  const addingToCart = value && value.state.addingToCart;

  return (
    <div className="bc-product-card">
      <div className="bc-product__actions" data-js="bc-product-group-actions">
        <div className="bc-form bc-product-form">
          <div className="bc-product-form__product-message"></div>
          <button
            className="bc-btn bc-btn--form-submit bc-btn--add_to_cart"
            type="submit"
            disabled={addingToCart === productId}
            onClick={() => addToCart(productId, variantId)}>
            {addingToCart === productId ? 'Adding to Cart' : children}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddToCartButton;
