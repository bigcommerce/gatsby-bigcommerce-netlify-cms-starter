import React from 'react'
import { Link } from 'gatsby';
import Layout from '../components/Layout'

const NotFoundPage = () => (
  <Layout>
    <section className="section">
      <div className="container">
        <div className="content">
          <div className="container">
            <section className="bc-cart">
              <div className="bc-cart__empty">
                <h2 className="bc-cart__title--empty">Page Not Found</h2>
                <p>You've hit a page that doesn't exist. Looking to shop?</p>
                <Link to="/products" className="bc-cart__continue-shopping">Take a look around.</Link>
        			</div>
            </section>
          </div>
        </div>
      </div>
    </section>
  </Layout>
)

export default NotFoundPage
