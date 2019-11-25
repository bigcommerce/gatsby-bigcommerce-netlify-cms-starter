import React from 'react'
import Layout from '../../components/Layout'
import Cart from '../../components/bigcommerce/Cart'
import translations from '../../helpers/translations'

// const channelRegionNameIdx = 0
const channelRegionLocaleIdx = 1
// const channelRegionPathIdx = 2
// const channelRegionCurrencyIdx = 3

export default class CartIndexPage extends React.Component {
  render() {
    const pageContext = this.props.pageContext
    const channelRegionLocale = pageContext.channel.external_id.split('|')[channelRegionLocaleIdx]
    const pageText = translations.getTranslations(channelRegionLocale)

    return (
      <Layout pageContext={pageContext}>
        <div
          className="has-text-centered margin-top-0"
        >
          <h1
            className="has-text-weight-bold is-size-1"
            style={{
              boxShadow: '0.5rem 0 0 rgba(0, 0, 0, 1), -0.5rem 0 0 rgba(0, 0, 0, 1)',
              backgroundColor: 'rgba(0, 0, 0, 1)',
              color: 'white',
              padding: '1rem',
            }}
          >
            {pageText.yourcart}
          </h1>
        </div>
        <section className="section">
          <div className="container">
            <div className="content">
              <Cart cartType="full" pageContext={pageContext} />
            </div>
          </div>
        </section>
      </Layout>
    )
  }
}
