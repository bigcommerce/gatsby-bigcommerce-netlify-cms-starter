import React from 'react'
import PropTypes from 'prop-types'
import { IndexPageTemplate } from '../../templates/index-page'

const IndexPagePreview = ({ entry, getAsset }) => {
  const data = entry.getIn(['data']).toJS()

  if (data) {
    const pageContext = {
      'basepath': data.basepath,
      'channel': data.channel
    }

    return (
      <IndexPageTemplate
        pageContext={pageContext}
        bigimage={data.bigimage}
        image={data.image}
        title={data.title}
        subtitle={data.subtitle}
        heading={data.heading}
        intro={data.intro || { blurbs: [] }}
        mainpitch={data.mainpitch || {}}
        basepath={data.basepath}
        channel={data.channel || {}}
      />
    )
  } else {
    return <div>Loading...</div>
  }
}

IndexPagePreview.propTypes = {
  entry: PropTypes.shape({
    getIn: PropTypes.func,
  }),
  getAsset: PropTypes.func,
}

export default IndexPagePreview
