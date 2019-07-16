import React from 'react'
import axios from 'axios'

const AddToCartButton = class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      addingToCart: false,
      addToCartError: false,
      cart: {
        currency: {},
        cartAmount: 0,
        lineItems: {},
        numberItems: 0,
        redirectUrls: {}
      },
    }
  }

  addToCart = () => {
    this.setState({ addingToCart: true })
    axios
      .post(`/.netlify/functions/bigcommerce?endpoint=carts/items`, {
        line_items: [
          {
            quantity: 1,
            product_id: parseInt(this.props.productId),
          }
        ]
      })
      .then(response => {
        const lineItems = response.data.data.line_items;
        const cartAmount = response.data.data.cart_amount;
        const currency = response.data.data.currency;

        this.setState({
          loading: false,
          cart: {
            currency,
            cartAmount,
            lineItems,
            numberItems: lineItems.physical_items.length + lineItems.digital_items.length + lineItems.custom_items.length + lineItems.gift_certificates.length,
            redirectUrls: response.data.data.redirect_urls,
          },
        })
      })
      .catch(error => {
        this.setState({ addingToCart: false, addToCartError: error })
      })
  }

  render() {
    const { currency, cartAmount, lineItems, numberItems, redirectUrls } = this.state.cart

    return (
      <div className="bc-product__actions" data-js="bc-product-group-actions">
        <div className="bc-form bc-product-form">
          <div className="bc-product-form__product-message"></div>
          
          <button className="bc-btn bc-btn--form-submit bc-btn--add_to_cart" type="submit" onClick={this.addToCart}>Add to Cart</button>

          {this.state.addingToCart ? (
            <div className="bc-ajax-add-to-cart__message-wrapper">
              <p className="bc-ajax-add-to-cart__message bc-alert bc-alert--success">
                Product successfully added to your cart.
                <a href="{ redirectUrls.checkout_url }">Proceed to Checkout</a>.
              </p>
            </div>
          ) : ()}
        </div>
      </div>
    )
  }
}

export default AddToCartButton
