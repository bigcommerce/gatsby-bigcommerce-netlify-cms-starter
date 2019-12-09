import React from 'react'
import PropTypes from 'prop-types'
import { graphql, StaticQuery  } from 'gatsby'
import Layout from '../../components/Layout'
import Login from '../../components/Login'
import translations from '../../helpers/translations'
import parseChannelRegionInfo from '../../helpers/channels'

const LoginPageComponent = ({data, count }) => {

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
    basePath: "/app/login",
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
          {pageText.login}
        </h1>
      </div>
      <section className="section">
        <div className="container">
          <div className="content">
            <Login />
          </div>
        </div>
      </section>
    </Layout>
  )
}

LoginPageComponent.propTypes = {
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
    render={(data, count) => 
      <LoginPageComponent data={data} count={count} />
    }
  />
)
