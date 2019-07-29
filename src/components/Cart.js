import React from 'react'
import { Link } from 'gatsby'
import axios from 'axios'

const Cart = class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      cartLoading: false,
      cartError: false,
      cart: this.emptyCartObj(),
    }
  }

  componentDidMount() {
    this.fetchCart()
  }

  emptyCartObj = () => {
    return {
      currency: {
        code: 'USD'
      },
      cartAmount: 0,
      lineItems: {},
      numberItems: 0,
      redirectUrls: {},
    }
  }

  refreshCart = (response) => {
    if (response.status === 204 || response.status === 404) {
      this.setState({ 
        cartLoading: false,
        cart: this.emptyCartObj(),
      });
    } else {
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
    }
  }

  fetchCart = () => {
    this.setState({ cartLoading: true })
    axios
      .get(`/.netlify/functions/bigcommerce?endpoint=carts`, { withCredentials: true })
      .then(response => {
        this.refreshCart(response)
      })
      .catch(error => {
        this.setState({ cartLoading: false, cartError: error })
      })
  }

  updateItemInCart = (itemId, updatedItemData) => {
    this.setState({ cartLoading: true })
    axios
      .put(`/.netlify/functions/bigcommerce?endpoint=carts/items&itemId=${itemId}`, updatedItemData, { withCredentials: true })
      .then(response => {
        this.refreshCart(response)
      })
      .catch(error => {
        this.setState({ cartLoading: false, cartError: error })
      })
  }

  removeItemFromCart = (itemId) => {
    this.setState({ cartLoading: true })
    axios
      .delete(`/.netlify/functions/bigcommerce?endpoint=carts/items&itemId=${itemId}`, { withCredentials: true })
      .then(response => {
        this.refreshCart(response)
      })
      .catch(error => {
        this.setState({ cartLoading: false, cartError: error })
      })
  }

  updateCartItemQuantity = (item, action) => {
    const newQuantity = item.quantity + ((action === 'minus') ? -1 : 1)

    if (newQuantity < 1) {
      this.removeItemFromCart(item.id)
    } else {
      let productVariantReferences = null
      
      if (typeof item.product_id !== 'undefined') {
        productVariantReferences = {
          product_id: item.product_id,
          variant_id: item.variant_id
        }
      }

      this.updateItemInCart(item.id, {
        line_item: {
          quantity: newQuantity,
          ...productVariantReferences
        }
      })
    }
  }

  removeCartItem = (itemId) => {
    this.removeItemFromCart(itemId)
  }

  render() {
    const { currency, cartAmount, lineItems, numberItems, redirectUrls } = this.state.cart

    const FormattedAmount = (props) => {
      const currency = props.currency
      const amount = props.amount
      const languageCode = (typeof window !== 'undefined') ? window.navigator.language || 'en-US' : 'en-US'
      const formattedPrice = new Intl.NumberFormat(languageCode, { style: 'currency', currency }).format(amount)
      return formattedPrice
    }

    const CustomItems = (props) => {
      const items = props.items;

      return items.map(item => 
        <div className="bc-cart-item" key={item.id}>
          <div className="bc-cart-item-image">
              <img height="270" src="/img/coffee.png" alt={ `${item.name}` } />
              <button className="bc-link bc-cart-item__remove-button" onClick={this.removeCartItem.bind(this, item.id)} type="button">Remove</button>
          </div>

          <div className="bc-cart-item-meta">
            <h3 className="bc-cart-item__product-title">
              {item.name}
            </h3>
            <span className="bc-cart-item__product-brand">{item.sku}</span>
          </div>

          <div className="bc-cart-item-quantity">
            <button className="bc-btn" onClick={this.updateCartItemQuantity.bind(this, item, 'minus')}>-</button>
            <div>{item.quantity}</div>
            <button className="bc-btn" onClick={this.updateCartItemQuantity.bind(this, item, 'plus')}>+</button>
          </div>
              
          <div className="bc-cart-item-total-price">
            <FormattedAmount currency={currency.code} amount={item.list_price} />
          </div>
        </div>
      )
    }

    const StandardItems = (props) => {
      const items = props.items;

      return items.map(item => 
        <div className="bc-cart-item" key={item.id}>
          <div className="bc-cart-item-image">
              <img height="270" src={item.image_url} alt={ `${item.name}` } />
              <button className="bc-link bc-cart-item__remove-button" onClick={this.removeCartItem.bind(this, item.id)} type="button">Remove</button>
          </div>

          <div className="bc-cart-item-meta">
            <h3 className="bc-cart-item__product-title">
              {item.name}
            </h3>
            <span className="bc-cart-item__product-brand">{item.sku}</span>
          </div>

          <div className="bc-cart-item-quantity">
            <button className="bc-btn" onClick={this.updateCartItemQuantity.bind(this, item, 'minus')}>-</button>
            <div>{item.quantity}</div>
            <button className="bc-btn" onClick={this.updateCartItemQuantity.bind(this, item, 'plus')}>+</button>
          </div>
              
          <div className="bc-cart-item-total-price">
            <FormattedAmount currency={currency.code} amount={item.list_price} />
          </div>
        </div>
      )
    }

    const GiftCertificateItems = (props) => {
      const items = props.items;

      return items.map(item => 
        <div className="bc-cart-item" key={item.id}>
          <div className="bc-cart-item-image">
              <button className="bc-link bc-cart-item__remove-button" onClick={this.removeCartItem.bind(this, item.id)} type="button">Remove</button>
          </div>

          <div className="bc-cart-item-meta">
            <h3 className="bc-cart-item__product-title">
              {item.name} - Gift Certificate for {item.recipient.name}
            </h3>
            <span className="bc-cart-item__product-brand">Theme: {item.theme}</span>
          </div>
              
          <div className="bc-cart-item-total-price">
            <FormattedAmount currency={currency.code} amount={item.amount} />
          </div>
        </div>
      )
    }

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
              <StandardItems items={lineItems.physical_items} />
              <StandardItems items={lineItems.digital_items} />
              <CustomItems items={lineItems.custom_items} />
              <GiftCertificateItems items={lineItems.gift_certificates} />
            </div>
          ) : (
            <div className="bc-cart__empty">
              <h2 className="bc-cart__title--empty">Your cart is empty.</h2>
              <Link to="/products" className="bc-cart__continue-shopping">Take a look around.</Link>
            </div>
          )}

          <footer className="bc-cart-footer">
            <div className="bc-cart-subtotal">
              <span className="bc-cart-subtotal__label">Subtotal: </span>
              <span className="bc-cart-subtotal__amount">
                <FormattedAmount currency={currency.code} amount={cartAmount} />
              </span>
            </div>

            { numberItems > 0 &&
              <div className="bc-cart-actions">
                <form action={ redirectUrls.checkout_url } method="post" encType="multipart/form-data">
                  <button className="bc-btn bc-cart-actions__checkout-button" type="submit">Proceed to Checkout</button>
                </form>
              </div>
            }
          </footer>

        </section>
      </div>
    )
  }
}

export default Cart
