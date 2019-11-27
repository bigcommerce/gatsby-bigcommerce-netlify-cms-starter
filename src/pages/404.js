import React from 'react'
import { Link } from 'gatsby'
import Layout from '../components/Layout'
import translations from '../helpers/translations'

// const channelRegionNameIdx = 0
const channelRegionLocaleIdx = 1
const channelRegionPathIdx = 2
// const channelRegionCurrencyIdx = 3

const NotFoundPage = ({pageContext}) => {
  const channelRegionLocale = pageContext.channel.external_id.split('|')[channelRegionLocaleIdx]
  const pageText = translations.getTranslations(channelRegionLocale)

  let channelRegionPathPrefix = pageContext.channel.external_id.split('|')[channelRegionPathIdx]
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
