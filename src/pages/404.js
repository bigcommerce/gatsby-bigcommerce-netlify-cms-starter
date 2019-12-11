import React from 'react'
import PropTypes from 'prop-types'
import { Link, graphql, StaticQuery } from 'gatsby'
import Layout from '../components/Layout'
import translations from '../helpers/translations'
import { parseChannelRegionInfo, determineChannelViaWindowPath } from '../helpers/channels'

const NotFoundPageComponent = ({data, count, pageContext}) => {
  const channel = determineChannelViaWindowPath(data.allBigCommerceChannels.nodes, data.rootChannel)
  const { channelRegionLocale, channelRegionPathPrefix } = parseChannelRegionInfo(channel)
  const pageText = translations.getTranslations(channelRegionLocale)
  pageContext.channel = channel

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

NotFoundPageComponent.propTypes = {
  data: PropTypes.shape({
    allBigCommerceChannels: PropTypes.shape({
      nodes: PropTypes.array,
    }),
    rootChannel: PropTypes.object,
  }),
  pageContext: PropTypes.object,
}

export default (pageContext) => (
  <StaticQuery
    query={graphql`
      query PageNotFoundChannelQuery {
        allBigCommerceChannels(filter: {is_enabled: {eq: true}, platform: {eq: "custom"}, type: {eq: "storefront"}}) {
          nodes {
            id
            bigcommerce_id
            external_id
            name
          }
        }
        rootChannel: bigCommerceChannels(external_id: {regex: "/[|][|]/i"}, is_enabled: {eq: true}) {
          id
          bigcommerce_id
          external_id
          name
        }
      }
    `}
    render={(data, count) => <NotFoundPageComponent data={data} count={count} pageContext={pageContext.pageContext} />}
  />
)
