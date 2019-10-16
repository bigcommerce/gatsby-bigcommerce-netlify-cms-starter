import React from 'react'
import PropTypes from 'prop-types'
import PreviewCompatibleImage from '../components/PreviewCompatibleImage'

const PhotoGrid = ({ gridItems }) => (
  <div className="columns is-mobile">
    {gridItems.map(item => (
      <div key={item.text} className="column is-3 frontpage">
        <PreviewCompatibleImage imageInfo={item} />
      </div>
    ))}
  </div>
)

PhotoGrid.propTypes = {
  gridItems: PropTypes.arrayOf(
    PropTypes.shape({
      image: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
      text: PropTypes.string,
    })
  ),
}

export default PhotoGrid
