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
      loading: false,
      error: false,
      pupper: {
        img: "",
        breed: "",
      },
    }
  }

  componentDidMount() {
    this.fetchRicksPupper()
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

  fetchRicksPupper = () => {
    this.setState({ loading: true })
    axios
      .get(`/.netlify/functions/hello?endpoint=carts`)
      .then(pupper => {
        this.setState({
          loading: false,
          pupper: {
            img: 'test',
            breed: pupper.data.id,
          },
        })
      })
      .catch(error => {
        this.setState({ loading: false, error })
      })
  }

  render() {
    const { img, breed } = this.state.pupper

    return (
      <nav
        className="navbar is-transparent"
        role="navigation"
        aria-label="main-navigation"
      >
        <div className="container">
          <div className="navbar-brand">
            <Link to="/" className="navbar-item" title="Logo">
              <img src={logo} alt="Kaldi" style={{ width: '88px' }} />
            </Link>
            {/* Hamburger menu */}
            <div
              className={`navbar-burger burger ${this.state.navBarActiveClass}`}
              data-target="navMenu"
              onClick={() => this.toggleHamburger()}
            >
              <span />
              <span />
              <span />
            </div>
          </div>
          <div
            id="navMenu"
            className={`navbar-menu ${this.state.navBarActiveClass}`}
          >
            <div className="navbar-start has-text-centered">
              <Link className="navbar-item" to="/about">
                About
              </Link>
              <Link className="navbar-item" to="/products">
                Products
              </Link>
              <Link className="navbar-item" to="/blog">
                Blog
              </Link>
              <Link className="navbar-item" to="/contact">
                Contact
              </Link>
              <Link className="navbar-item" to="/contact/examples">
                Form Examples
              </Link>
              <div>
                {this.state.loading ? (
                  <p>Loading Cart...</p>
                ) : img && breed ? (
                  <>
                    <h2>{`${breed} pupper!`}</h2>
                    <img src={img} alt={`cute random `} style={{ maxWidth: 300 }} />
                  </>
                ) : (
                  <p>Oh noes, error fetching pupper :(</p>
                )}
              </div>
            </div>
            <div className="navbar-end has-text-centered">
              <a
                className="navbar-item"
                href="https://github.com/netlify-templates/gatsby-starter-netlify-cms"
                target="_blank"
                rel="noopener noreferrer"
              >
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
