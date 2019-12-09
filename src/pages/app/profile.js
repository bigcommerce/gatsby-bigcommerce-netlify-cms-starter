import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { Link, graphql, StaticQuery  } from 'gatsby'
import CartContext from '../../context/CartProvider'
import Layout from '../../components/Layout'
import Profile from '../../components/Profile'
import translations from '../../helpers/translations'
import parseChannelRegionInfo from '../../helpers/channels'
import { getUser, isLoggedIn } from '../../services/auth'

const ProfilePageComponent = ({data, count }) => {
  const value = useContext(CartContext)
  const { state, updateCartCustomer } = value
  const {
    channel_id,
    customer_id,
    currency,
    cartAmount,
    lineItems,
    numberItems,
    redirectUrls
  } = state.cart

  if (!customer_id || customer_id === 0) {
    updateCartCustomer(getUser().customer)
  }

  const determineChannelViaWindowPath = (channels, rootChannel) => {
    for (var i = channels.length - 1; i >= 0; i--) {
      const { channelRegionPathPrefix } = parseChannelRegionInfo(channels[i])

      if (typeof window !== 'undefined' && channelRegionPathPrefix.length > 0 && window.location.pathname.match(`${channelRegionPathPrefix}/`) !== null) {
        return channels[i]
      }
    }

    return rootChannel
  }

  const channel = determineChannelViaWindowPath(data.allBigCommerceChannels.nodes, data.rootChannel)
  const { channelRegionLocale } = parseChannelRegionInfo(channel)
  const pageText = translations.getTranslations(channelRegionLocale)
  const pageContext = {
    basePath: "/app/profile",
    channel
  }

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
          {pageText.profile}
        </h1>
      </div>
      <section className="section">
        <div className="container">
          <div className="content">
            <h1>Hello {isLoggedIn() ? getUser().name : "world"}!</h1>
            {isLoggedIn() ? (
              <>
                <Profile />
              </>
            ) : (
              <p>
                You should <Link to="/app/login">log in</Link> to see restricted
                content
              </p>
            )}
          </div>
        </div>
      </section>
    </Layout>
  )
}

ProfilePageComponent.propTypes = {
  data: PropTypes.shape({
    allBigCommerceChannels: PropTypes.shape({
      nodes: PropTypes.array,
    }),
    rootChannel: PropTypes.object,
  })
}

export default () => (
  <StaticQuery
    query={graphql`
      query {
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
    render={(data, count) => <ProfilePageComponent data={data} count={count} />}
  />
)

