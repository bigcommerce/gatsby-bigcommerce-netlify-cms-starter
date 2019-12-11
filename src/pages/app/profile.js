import React from 'react'
import PropTypes from 'prop-types'
import { graphql, StaticQuery } from 'gatsby'
import Layout from '../../components/Layout'
import translations from '../../helpers/translations'
import { parseChannelRegionInfo, determineChannelViaWindowPath } from '../../helpers/channels'
import { getUser, isLoggedIn } from '../../services/auth'

const ProfilePageComponent = class extends React.Component {
  constructor(props) {
    super(props)

    const channel = determineChannelViaWindowPath(props.data.allBigCommerceChannels.nodes, props.data.rootChannel)
    const { channelRegionLocale, channelRegionPathPrefix } = parseChannelRegionInfo(channel)
    const pageText = translations.getTranslations(channelRegionLocale)
    const pageContext = {
      basePath: "/app/profile",
      channel
    }

    this.state = {
      channelRegionPathPrefix,
      pageContext,
      pageText,
    }
  }

  render() {
    const pageText = this.state.pageText

    return (
      <Layout pageContext={this.state.pageContext}>
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
              <h1>Hello {isLoggedIn() ? getUser().name : "there"}!</h1>
              {isLoggedIn() ? (
                <>
                  <h1>Your profile</h1>
                  <ul>
                    <li>Name: {getUser().name}</li>
                    <li>E-mail: {getUser().email}</li>
                  </ul>
                </>
              ) : (
                <p>
                  {pageText.logintoviewpage(`${this.state.channelRegionPathPrefix}/app/login`)}
                </p>
              )}
            </div>
          </div>
        </section>
      </Layout>
    )
  }
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

