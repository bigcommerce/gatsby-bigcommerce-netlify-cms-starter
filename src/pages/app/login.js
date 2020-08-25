import React from 'react'
import PropTypes from 'prop-types'
import { graphql, navigate, StaticQuery } from 'gatsby'
import Layout from '../../components/Layout'
import translations from '../../helpers/translations'
import { parseChannelRegionInfo, determineChannelViaWindowPath } from '../../helpers/channels'
import { handleLogin, isLoggedIn } from "../../services/auth"

const LoginPageComponent = class extends React.Component {
  constructor(props) {
    super(props)

    const channel = determineChannelViaWindowPath(props.data.allBigCommerceChannels.nodes, props.data.rootChannel)
    const { channelRegionLocale, channelRegionPathPrefix } = parseChannelRegionInfo(channel)
    const pageText = translations.getTranslations(channelRegionLocale)
    const pageContext = {
      basePath: "/app/login",
      channel
    }

    this.state = {
      channelRegionPathPrefix,
      pageContext,
      pageText,
      username: ``,
      password: ``,
      loginFailed: false,
      loading: false,
    }
  }

  componentDidMount() {
    if (isLoggedIn()) {
      navigate(`${this.state.channelRegionPathPrefix}/app/profile`)
    }
  }

  handleUpdate = event => {
    this.setState({
      [event.target.name]: event.target.value,
    })
  }

  handleSubmit = async event => {
    event.preventDefault()
    this.setState({
      loading: true
    })

    if (await handleLogin(this.state)) {
      navigate(`${this.state.channelRegionPathPrefix}/app/profile`)
    } else {
      this.setState({
        loginFailed: true
      })
    }

    this.setState({
      loading: false
    })
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
            {pageText.logintitle}
          </h1>
        </div>
        <section className="section">
          <div className="container">
            <div className="content">
              <>
                {this.state.loginFailed ? <div className="bc-alert bc-alert--error">{pageText.loginfailed}</div> : ''}
                <div className="bc-account-page">
                  <form className="bc-form" method="post" onSubmit={event => { this.handleSubmit(event) }}>

                    <label className="bc-form__control bc-form-2col__control bc-form-2col__control--left" htmlFor="bc-account-login-email">
                      <span className="bc-form__label bc-account-profile__form-label bc-form-control-required">{pageText.emailaddress}</span>
                      <input type="text" name="username" id="bc-account-login-email" autoComplete="off" onChange={this.handleUpdate} />
                    </label>

                    <label className="bc-form__control bc-form-2col__control bc-form-2col__control--left" htmlFor="bc-account-login-password">
                      <span className="bc-form__label bc-account-profile__form-label bc-form-control-required">{pageText.password}</span>
                      <input type="password" name="password" id="bc-account-login-password" autoComplete="current-password" onChange={this.handleUpdate} />
                    </label>
                    
                    <button className="bc-btn bc-btn--account" type="submit">{this.state.loading ? pageText.loginbuttonloading : pageText.loginbutton}</button>

                  </form>
                </div>
              </>
            </div>
          </div>
        </section>
      </Layout>
    )
  }
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
        allBigCommerceChannels(filter: {is_enabled: {eq: true}, external_id: {ne: ""}, platform: {eq: "custom"}, type: {eq: "storefront"}}) {
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
