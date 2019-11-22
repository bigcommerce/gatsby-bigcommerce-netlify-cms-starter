import React from 'react'
import { navigate } from 'gatsby-link'
import Layout from '../../components/Layout'

const channelRegionNameIdx = 0
const channelRegionLocaleIdx = 1
const channelRegionPathIdx = 2
// const channelRegionCurrencyIdx = 3

const translations = {
  'fr': {
    'contactus': 'Contactez Nous',
    'yourname': 'Votre Nom',
    'email': 'Email',
    'message': 'Message',
    'send': 'Envoyer',
  },
  'default': {
    'contactus': 'Contact Us',
    'yourname': 'Your Name',
    'email': 'Email',
    'message': 'Message',
    'send': 'Send',
  }
}

function encode(data) {
  return Object.keys(data)
    .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
    .join('&')
}

export default class Index extends React.Component {
  constructor(props) {
    super(props)
    this.state = { isValidated: false }
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  handleSubmit = e => {
    e.preventDefault()
    const form = e.target
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encode({
        'form-name': form.getAttribute('name'),
        ...this.state,
      }),
    })
      .then(() => navigate(form.getAttribute('action')))
      .catch(error => alert(error))
  }

  render() {
    const pageContext = this.props.pageContext
    const channelRegionName = pageContext.channel.external_id.split('|')[channelRegionNameIdx]
    const channelRegionLocale = pageContext.channel.external_id.split('|')[channelRegionLocaleIdx]
    let channelRegionPathPrefix = pageContext.channel.external_id.split('|')[channelRegionPathIdx]

    let pageText = translations['default']
      
    if (channelRegionPathPrefix.length > 0 && translations[channelRegionPathPrefix]) {
      pageText = translations[channelRegionPathPrefix]
    }

    channelRegionPathPrefix = (!channelRegionPathPrefix.length) ? '' : '/' + channelRegionPathPrefix

    return (
      <Layout pageContext={pageContext}>
        <div className="container is-fluid">
          <section className="section">
            <div className="container">
              <h2 className="title has-text-centered">{pageText.contactus}</h2>
              <div className="columns">
                <div className="column is-6">
                  <img src="/img/architecture-blur.jpg" alt="" style={{borderRadius: "6px"}} />
                </div>
                <div className="column is-5 is-offset-1">
                  <div className="container">
                    <div className="content">
                      <form
                        name="contact"
                        method="post"
                        action={`${channelRegionPathPrefix}/contact/thanks/`}
                        data-netlify="true"
                        data-netlify-honeypot="bot-field"
                        onSubmit={this.handleSubmit}
                      >
                        {/* The `form-name` hidden field is required to support form submissions without JavaScript */}
                        <input type="hidden" name="form-name" value="contact" />
                        <input type="hidden" name="channel" value={channelRegionName} />
                        <input type="hidden" name="locale" value={channelRegionLocale} />
                        <div hidden>
                          <label>
                            Don’t fill this out:{' '}
                            <input name="bot-field" onChange={this.handleChange} />
                          </label>
                        </div>
                        <div className="field">
                          <label className="label" htmlFor={'name'}>
                            {pageText.yourname}
                          </label>
                          <div className="control">
                            <input
                              className="input"
                              type={'text'}
                              name={'name'}
                              onChange={this.handleChange}
                              id={'name'}
                              required={true}
                            />
                          </div>
                        </div>
                        <div className="field">
                          <label className="label" htmlFor={'email'}>
                            {pageText.email}
                          </label>
                          <div className="control">
                            <input
                              className="input"
                              type={'email'}
                              name={'email'}
                              onChange={this.handleChange}
                              id={'email'}
                              required={true}
                            />
                          </div>
                        </div>
                        <div className="field">
                          <label className="label" htmlFor={'message'}>
                            {pageText.message}
                          </label>
                          <div className="control">
                            <textarea
                              className="textarea"
                              name={'message'}
                              onChange={this.handleChange}
                              id={'message'}
                              required={true}
                            />
                          </div>
                        </div>
                        <div className="field">
                          <button className="btn" type="submit">
                            {pageText.send}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </Layout>
    )
  }
}
