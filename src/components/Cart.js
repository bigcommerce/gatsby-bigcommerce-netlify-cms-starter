import React from 'react'
import { Link } from 'gatsby'
import github from '../img/github-icon.svg'
import logo from '../img/logo.svg'
import axios from 'axios'

const Navbar = class extends React.Component {
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
          },
        })
      })
      .catch(error => {
        this.setState({ loading: false, error })
      })
  }

  render() {
    const { lineItems, numberItems } = this.state.cart

    return (
      <div className="container">
        {this.state.loading ? (
          <h2 className="has-centered-text"><em>Loading Cart</em></h2>
        ) : numberItems > 0 ? (
          {
            lineItems.custom_items.foreach(item => {
              return (<h2>{item.name} {item.sku} {item.quantity} {item.list_price} <br /><small>id:{item.id}</small></h2>)
            }
          }
        ) : (
          <h2 className="has-centered-text"><em>Error Loading Cart</em></h2>
        )}
      </div>
    )
  }
}

export default Navbar
