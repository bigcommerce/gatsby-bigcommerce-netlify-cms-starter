import React from 'react';
import { Link } from 'gatsby';
import PreviewCompatibleImage from './PreviewCompatibleImage'
import translations from '../helpers/translations'
import parseChannelRegionInfo from '../helpers/channels'

class BlogItem extends React.Component {
  render() {
    const post = this.props.post
    const columnWidth = this.props.columnWidth ? this.props.columnWidth : 'is-6'
    const { channelRegionLocale, channelRegionPathPrefix } = parseChannelRegionInfo(this.props.pageContext.channel)
    const pageText = translations.getTranslations(channelRegionLocale)

    if (!post) {
      return <div />
    }

    return (
      <div className={`is-parent column ${columnWidth}`}>
        <article
          className={`blog-list-item tile is-child box notification ${
            post.frontmatter.featuredpost ? 'is-featured' : ''
          }`}
        >
          <div className="featured-badge">
            {pageText.featuredpost}
          </div>
          <header>
            {post.frontmatter.featuredimage ? (
              <div className="featured-thumbnail">
                <PreviewCompatibleImage
                  imageInfo={{
                    image: post.frontmatter.featuredimage,
                    alt: `featured image thumbnail for post ${post.frontmatter.title}`
                  }}
                />
              </div>
            ) : null}
            <p className="post-meta">
              <Link
                className="title has-text-primary is-size-4"
                to={`${channelRegionPathPrefix}${post.fields.slug}`}
              >
                {post.frontmatter.title}
              </Link>
              <span> &bull; </span>
              <span className="subtitle is-size-5 is-block">
                {post.frontmatter.date}
              </span>
            </p>
          </header>
          <p>
            {post.excerpt}
            <br />
            <br />
            <Link className="button" to={`${channelRegionPathPrefix}${post.fields.slug}`}>
              {pageText.keepreading} →
            </Link>
          </p>
        </article>
      </div>
    )
  }
}

export default BlogItem
