import React from 'react'

import Layout from '../../components/Layout'
import Cart from '../../components/Cart'

export default class CartIndexPage extends React.Component {
  render() {
    return (
      <Layout>
        <div
          className="has-text-centered margin-top-0"
        >
          <h1
            className="has-text-weight-bold is-size-1"
            style={{
              boxShadow: '0.5rem 0 0 #f40, -0.5rem 0 0 #f40',
              backgroundColor: '#f40',
              color: 'white',
              padding: '1rem',
            }}
          >
            Cart
          </h1>
        </div>
        <section className="section">
          <div className="container">
            <div className="content">
              <Cart />
            </div>
          </div>
        </section>
      </Layout>
    )
  }
}
