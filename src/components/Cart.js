import React from 'react'
import { Link } from 'gatsby'
import axios from 'axios'

const Cart = class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      cartLoading: false,
      cartError: false,
      cart: {
        currency: {},
        cartAmount: 0,
        lineItems: {},
        numberItems: 0,
        redirectUrls: {},
      },
    }
  }

  componentDidMount() {
    this.fetchCart()
  }

  fetchCart = () => {
    this.setState({ cartLoading: true })
    axios
      .get(`/.netlify/functions/bigcommerce?endpoint=carts`)
      .then(response => {
        const lineItems = response.data.data.line_items;
        const cartAmount = response.data.data.cart_amount;
        const currency = response.data.data.currency;

        this.setState({
          cartLoading: false,
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
        this.setState({ cartLoading: false, cartError: error })
      })
  }

  CustomItems = (props) => {
    const items = props.items;

    return lineItems.physical_items.map(item => 
      <div className="bc-cart-item">
        <div className="bc-cart-item-image">
            <img width="270" height="270" src="/img/coffee.png" alt={ `Image for ${item.name}` } />
            <button className="bc-link bc-cart-item__remove-button" data-cart_item_id={item.id} type="button">Remove</button>
        </div>

        <div className="bc-cart-item-meta">
          <h3 className="bc-cart-item__product-title">
            {item.name}
          </h3>
          <span className="bc-cart-item__product-brand">{item.sku}</span>
        </div>

        <div className="bc-cart-item-quantity">
          <label for="bc-cart-item__quantity" className="u-bc-screen-reader-text">Quantity</label>

          <input type="number" name="bc-cart-item__quantity" className="bc-cart-item__quantity-input" value={item.quantity} min="1" max="" />
        </div>
            
        <div className="bc-cart-item-total-price">
          ${item.list_price}
        </div>
      </div>
    )
  }

  render() {
    const { currency, cartAmount, lineItems, numberItems, redirectUrls } = this.state.cart

    return (
      <div className="container">
        <section className="bc-cart">
          <div className="bc-cart-error">
            <p className="bc-cart-error__message"></p>
          </div>
          <header className="bc-cart-header">
            <div className="bc-cart-header__item">Item</div>
            <div className="bc-cart-header__qty">Qty</div>
            <div className="bc-cart-header__price">Price</div>
          </header>
          {this.state.cartLoading ? (
            <div className="bc-cart__empty">
              <h2 className="bc-cart__title--empty"><em>Loading Cart</em></h2>
            </div>
          ) : numberItems > 0 ? (
            <div className="bc-cart-body">
              <CustomItems items={lineItems.custom_items} />
            </div>
          ) : (
            <div className="bc-cart__empty">
              <h2 className="bc-cart__title--empty">Your cart is empty.</h2>
              <Link href="/products" className="bc-cart__continue-shopping">Take a look around.</Link>
            </div>
          )}

          <footer className="bc-cart-footer">
            <div className="bc-cart-subtotal">
              <span className="bc-cart-subtotal__label">Subtotal: </span>
              <span className="bc-cart-subtotal__amount">${cartAmount}</span>
            </div>

            <div className="bc-cart-actions">
              <form action={ redirectUrls.checkout_url } method="post" enctype="multipart/form-data">
                <button className="bc-btn bc-cart-actions__checkout-button" type="submit">Proceed to Checkout</button>
              </form>
            </div>
          </footer>

        </section>
      </div>
    )
  }
}

export default Cart
