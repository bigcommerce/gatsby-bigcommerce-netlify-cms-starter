import React, { useContext } from 'react'
import CartContext from '../../context/CartProvider'
import translations from '../../helpers/translations'

const AddToCartButton = ({ children, productId, variantId, channelRegionLocale }) => {
  const value = useContext(CartContext)
  const addToCart = value && value.addToCart
  const addingToCart = value && value.state.addingToCart
  const pageText = translations.getTranslations(channelRegionLocale)

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
            {addingToCart === productId ? pageText.addingtocart : children}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddToCartButton
