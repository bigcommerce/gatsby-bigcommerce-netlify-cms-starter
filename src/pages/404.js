import React from 'react'
import { Link } from 'gatsby';
import Layout from '../components/Layout'

// const channelRegionNameIdx = 0
// const channelRegionLocaleIdx = 1
const channelRegionPathIdx = 2
// const channelRegionCurrencyIdx = 3

const translations = {
  'fr': {
    'pagenotfound': 'Page non trouvée',
    'lookingtoshop': 'Vous avez frappé une page qui n\'existe pas. Vous cherchez à magasiner?',
    'lookaround': 'Regardez autour de vous.',
  },
  'default': {
    'pagenotfound': 'Page Not Found',
    'lookingtoshop': 'You\'ve hit a page that doesn\'t exist. Looking to shop?',
    'lookaround': 'Take a look around.',
  }
}

const NotFoundPage = ({pageContext}) => {
  const channel = pageContext.channel
  let channelRegionPathPrefix = channel.external_id.split('|')[channelRegionPathIdx]
  let pageText = translations['default']
    
  if (channelRegionPathPrefix.length > 0 && translations[channelRegionPathPrefix]) {
    pageText = translations[channelRegionPathPrefix]
  }

  channelRegionPathPrefix = (!channelRegionPathPrefix.length) ? '' : '/' + channelRegionPathPrefix

  return (
    <Layout pageContext={pageContext}>
      <section className="section">
        <div className="container">
          <div className="content">
            <div className="container">
              <section className="bc-cart">
                <div className="bc-cart__empty">
                  <h2 className="bc-cart__title--empty">{pageText.pagenotfound}</h2>
                  <p>{pageText.lookingtoshop}</p>
                  <Link to={`${channelRegionPathPrefix}/products`} className="bc-cart__continue-shopping">{pageText.lookaround}</Link>
          			</div>
              </section>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default NotFoundPage
