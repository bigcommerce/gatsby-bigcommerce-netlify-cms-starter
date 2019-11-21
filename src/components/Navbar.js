import React from 'react';
import { Link } from 'gatsby';
import github from '../img/github-icon.svg';
import logo from '../img/logo-header.png';

import CartContext from '../context/CartProvider';
import RegionSelector from './bigcommerce/RegionSelector';

// const channelRegionNameIdx = 0
// const channelRegionLocaleIdx = 1
const channelRegionPathIdx = 2
// const channelRegionCurrencyIdx = 3

const Navbar = class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      navBarActiveClass: ''
    };
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
            });
      }
    );
  };

  render() {
    const pageContext = this.props.pageContext
    let channelRegionPathPrefix = pageContext.channel.external_id.split('|')[channelRegionPathIdx]
    channelRegionPathPrefix = (!channelRegionPathPrefix.length) ? '' : '/' + channelRegionPathPrefix

    return (
      <nav
        className="navbar is-transparent"
        role="navigation"
        aria-label="main-navigation">
        <div className="container">
          <div className="navbar-brand">
            <Link to={`${channelRegionPathPrefix}`} className="navbar-item" title="Logo">
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
                About
              </Link>
              <Link className="navbar-item" to={`${channelRegionPathPrefix}/products`}>
                Products
              </Link>
              <Link className="navbar-item" to={`${channelRegionPathPrefix}/blog`}>
                Blog
              </Link>
              <Link className="navbar-item" to={`${channelRegionPathPrefix}/contact`}>
                Contact
              </Link>
              <CartContext.Consumer>
                {value => {
                  return (
                    <Link className="navbar-item menu-item-bigcommerce-cart" to={`${channelRegionPathPrefix}/cart`}>
                      Cart
                      
                      {value &&
                        value.state.cart &&
                        value.state.cart.numberItems > 0 && (
                          <span className="bigcommerce-cart__item-count full">{value.state.cart.numberItems}</span>
                        )}
                    </Link>
                  );
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
    );
  }
};

export default Navbar;
