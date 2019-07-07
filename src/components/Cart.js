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
        {this.state.loading ? (
          <h2 className="has-centered-text"><em>Loading Cart</em></h2>
        ) : numberItems > 0 ? (
          <div>
          {lineItems.custom_items.map(item => (
            <h2 key={item.id}>
              {item.name} {item.sku} {item.quantity} {item.list_price} <br /><small>id:{item.id}</small>
            </h2>
          ))}
          </div>
        ) : (
          <h2 className="has-centered-text"><em>Error Loading Cart</em></h2>
        )}

        <a className="checkout-link" href={ redirectUrls.checkout_url }>
          { redirectUrls.checkout_url }
        </a>
      </div>
    )
  }
}

export default Cart
