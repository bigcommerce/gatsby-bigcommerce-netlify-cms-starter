import React from 'react'

import Layout from '../../components/Layout'
import BlogRoll from '../../components/BlogRoll'

// const channelRegionNameIdx = 0
// const channelRegionLocaleIdx = 1
const channelRegionPathIdx = 2
// const channelRegionCurrencyIdx = 3

const translations = {
  'fr': {
    'storeblog': 'Le Blog Du Magasin',
  },
  'default': {
    'storeblog': 'The Store Blog',
  }
}

export default class BlogIndexPage extends React.Component {
  render() {
    const pageContext = this.props.pageContext
    const channel = pageContext.channel
    let channelRegionPathPrefix = channel.external_id.split('|')[channelRegionPathIdx]
    let pageText = translations['default']
      
    if (channelRegionPathPrefix.length > 0 && translations[channelRegionPathPrefix]) {
      pageText = translations[channelRegionPathPrefix]
    }

    return (
      <Layout pageContext={pageContext}>
        <div
          className="full-width-image-container margin-top-0"
          style={{
            backgroundImage: `url('/img/retail-shop.jpg')`,
          }}
        >
          <h1
            className="has-text-weight-bold is-size-1"
            style={{
              boxShadow: '0.5rem 0 0 rgba(0, 0, 0, 0.75), -0.5rem 0 0 rgba(0, 0, 0, 0.75)',
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
              color: 'white',
              padding: '1rem',
            }}
          >
            {pageText.storeblog}
          </h1>
        </div>
        <section className="section">
          <div className="container">
            <div className="content">
              <BlogRoll pageContext={pageContext} />
            </div>
          </div>
        </section>
      </Layout>
    )
  }
}
