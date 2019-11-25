import React from 'react'
import PropTypes from 'prop-types'
import { AboutPageTemplate } from '../../templates/about-page'

const AboutPagePreview = ({ entry, widgetFor }) => {
  const data = entry.getIn(['data']).toJS()

  if (data) {
    const pageContext = {
      'basepath': data.basepath,
      'channel': data.channel
    }

  	return (
      <AboutPageTemplate
        pageContext={pageContext}
      	image={entry.getIn(['data', 'image'])}
        title={entry.getIn(['data', 'title'])}
        content={widgetFor('body')}
      />
    )
  } else {
    return <div>Loading...</div>
  }
}

AboutPagePreview.propTypes = {
  entry: PropTypes.shape({
    getIn: PropTypes.func,
  }),
  widgetFor: PropTypes.func,
}

export default AboutPagePreview
