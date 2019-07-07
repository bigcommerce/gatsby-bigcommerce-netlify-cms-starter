import React from 'react'
import { Link } from 'gatsby'
import axios from 'axios'

const Cart = class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      active: false,
      navBarActiveClass: '',
      cartLoading: false,
      cartError: false,
      cart: {
        lineItems: {},
        numberItems: 0,
        redirectUrls: {},
      },
    }
  }

  componentDidMount() {
    this.fetchCart()
  }

  toggleHamburger = () => {
    // toggle the active boolean in the state
    this.setState(
      {
        active: !this.state.active,
      },
      // after state has been updated,
      () => {
        // set the class in state for the navbar accordingly
        this.state.active
          ? this.setState({
              navBarActiveClass: 'is-active',
            })
          : this.setState({
              navBarActiveClass: '',
            })
      }
    )
  }

  fetchCart = () => {
    this.setState({ loading: true })
    axios
      .get(`/.netlify/functions/hello?endpoint=carts`)
      .then(response => {
        const lineItems = response.data.data.line_items;

        this.setState({
          loading: false,
          cart: {
            lineItems,
            numberItems: lineItems.physical_items.length + lineItems.digital_items.length + lineItems.custom_items.length + lineItems.gift_certificates.length,
            redirectUrls: response.data.data.redirect_urls,
          },
        })
      })
      .catch(error => {
        this.setState({ loading: false, error })
      })
  }

  render() {
    const { lineItems, numberItems, redirectUrls } = this.state.cart

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
          {this.state.loading ? (
            <div className="bc-cart__empty">
              <h2 className="bc-cart__title--empty"><em>Loading Cart</em></h2>
            </div>
          ) : numberItems > 0 ? (
            <div>
            {lineItems.custom_items.map(item => (
              <div className="bc-cart-body">
                <div className="bc-cart-item">
                  <div className="bc-cart-item-image">
                      <img width="270" height="270" src="http://concerned-alpaca.w5.wpsandbox.pro/wp-content/uploads/2015/07/utilitybucket1.1435949357.1280.1280-270x270.jpg" className="attachment-bc-small size-bc-small wp-post-image" alt="" srcset="http://concerned-alpaca.w5.wpsandbox.pro/wp-content/uploads/2015/07/utilitybucket1.1435949357.1280.1280-270x270.jpg 270w, http://concerned-alpaca.w5.wpsandbox.pro/wp-content/uploads/2015/07/utilitybucket1.1435949357.1280.1280-150x150.jpg 150w, http://concerned-alpaca.w5.wpsandbox.pro/wp-content/uploads/2015/07/utilitybucket1.1435949357.1280.1280-300x300.jpg 300w, http://concerned-alpaca.w5.wpsandbox.pro/wp-content/uploads/2015/07/utilitybucket1.1435949357.1280.1280-768x768.jpg 768w, http://concerned-alpaca.w5.wpsandbox.pro/wp-content/uploads/2015/07/utilitybucket1.1435949357.1280.1280-86x86.jpg 86w, http://concerned-alpaca.w5.wpsandbox.pro/wp-content/uploads/2015/07/utilitybucket1.1435949357.1280.1280-370x370.jpg 370w, http://concerned-alpaca.w5.wpsandbox.pro/wp-content/uploads/2015/07/utilitybucket1.1435949357.1280.1280.jpg 900w" sizes="(max-width: 270px) 100vw, 270px" />
                      <button className="bc-link bc-cart-item__remove-button" data-cart_item_id={item.id} type="button">(Remove)</button>
                  </div>

                  <div className="bc-cart-item-meta">
                    <h3 className="bc-cart-item__product-title">
                      {item.name}
                    </h3>
                    <span className="bc-cart-item__product-brand">{item.sku}</span>
                  </div>

                  <div className="bc-cart-item-quantity">
                    <label for="bc-cart-item__quantity" className="u-bc-screen-reader-text">Quantity</label>

                    <input type="number" name="bc-cart-item__quantity" className="bc-cart-item__quantity-input" value={item.quantity} min="1" max="">
                  </div>
                      
                  <div className="bc-cart-item-total-price">
                    ${item.list_price}
                  </div>
                </div>
              </div>
            ))}
            </div>
          ) : (
            <div className="bc-cart__empty">
              <h2 className="bc-cart__title--empty">Your cart is empty.</h2>
              <Link href="/products" className="bc-cart__continue-shopping">Take a look around.</Link>
            </div>
          )}
        </section>

        <a className="checkout-link" href={ redirectUrls.checkout_url }>
          { redirectUrls.checkout_url }
        </a>
      </div>
    )
  }
}

export default Cart
