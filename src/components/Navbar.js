import React from 'react'
import { Link, navigate } from 'gatsby'
import github from '../img/github-icon.svg'
import logo from '../img/logo-header.png'
import CartContext from '../context/CartProvider'
import RegionSelector from './bigcommerce/RegionSelector'
import translations from '../helpers/translations'
import parseChannelRegionInfo from '../helpers/channels'
import { getUser, isLoggedIn, logout } from "../services/auth"

const Navbar = class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      active: false,
      navBarActiveClass: ''
    }
  }

  toggleHamburger = () => {
    // toggle the active boolean in the state
    this.setState(
      {
        active: !this.state.active
      },
      // after state has been updated,
      () => {
        // set the class in state for the navbar accordingly
        this.state.active
          ? this.setState({
              navBarActiveClass: 'is-active'
            })
          : this.setState({
              navBarActiveClass: ''
            })
      }
    )
  }

  render() {
    const { channelRegionLocale, channelRegionPathPrefix, channelRegionHomeLink } = parseChannelRegionInfo(this.props.pageContext.channel)
    const pageText = translations.getTranslations(channelRegionLocale)

    const content = { message: "", login: true }
    if (isLoggedIn()) {
      content.message = `Hello, ${getUser().name}`
    } else {
      content.message = "You are not logged in"
    }

    return (
      <nav
        className="navbar is-transparent"
        role="navigation"
        aria-label="main-navigation">
        <div className="container">
          <div className="navbar-brand">
            <Link to={`${channelRegionHomeLink}`} className="navbar-item" title="Logo">
              <img src={logo} alt="My Store" />
            </Link>
            {/* Hamburger menu */}
            <div
              className={`navbar-burger burger ${this.state.navBarActiveClass}`}
              data-target="navMenu"
              onClick={() => this.toggleHamburger()}>
              <span />
              <span />
              <span />
            </div>
          </div>
          <div
            id="navMenu"
            className={`navbar-menu ${this.state.navBarActiveClass}`}>
            <div className="navbar-start has-text-centered">
              <Link className="navbar-item" to={`${channelRegionPathPrefix}/about`}>
                {pageText.about}
              </Link>
              <Link className="navbar-item" to={`${channelRegionPathPrefix}/products`}>
                {pageText.products}
              </Link>
              <Link className="navbar-item" to={`${channelRegionPathPrefix}/blog`}>
                {pageText.blog}
              </Link>
              <Link className="navbar-item" to={`${channelRegionPathPrefix}/contact`}>
                {pageText.contact}
              </Link>
              <Link className="navbar-item" to={`${channelRegionPathPrefix}/app/profile`}>Profile</Link>
              {isLoggedIn() ? (
                <a
                  href="/"
                  className="navbar-item"
                  onClick={event => {
                    event.preventDefault()
                    logout(() => navigate(`${channelRegionPathPrefix}/app/login`))
                  }}
                >
                  Logout
                </a>
              ) : null}              
              <CartContext.Consumer>
                {value => {
                  return (
                    <Link className="navbar-item menu-item-bigcommerce-cart" to={`${channelRegionPathPrefix}/cart`}>
                      {pageText.cart}
                      
                      {value &&
                        value.state.cart &&
                        value.state.cart.numberItems > 0 && (
                          <span className="bigcommerce-cart__item-count full">{value.state.cart.numberItems}</span>
                        )}
                    </Link>
                  )
                }}
              </CartContext.Consumer>
            </div>
            <div className="navbar-end has-text-centered">
              <RegionSelector pageContext={this.props.pageContext} />
              <a
                className="navbar-item"
                href="https://github.com/bigcommerce/gatsby-bigcommerce-netlify-cms-starter"
                target="_blank"
                rel="noopener noreferrer">
                <span className="icon">
                  <img src={github} alt="Github" />
                </span>
              </a>
            </div>
          </div>
        </div>
      </nav>
    )
  }
}

export default Navbar
