import React from 'react'
import Layout from '../../components/Layout'

export default ({pageContext}) => {
  return (
    <Layout pageContext={pageContext}>
      <section className="section">
        <div className="container">
          <div className="content">
            <h1>Thank you!</h1>
            <p>This is a custom thank you page for form submissions</p>
          </div>
        </div>
      </section>
    </Layout>
  )
}
