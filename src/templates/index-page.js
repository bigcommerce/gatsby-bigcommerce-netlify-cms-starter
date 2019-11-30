import React from 'react'
import PropTypes from 'prop-types'
import { Link, graphql } from 'gatsby'
import PreviewCompatibleImage from '../components/PreviewCompatibleImage'
import Layout from '../components/Layout'
import PhotoGrid from '../components/PhotoGrid'
import BlogItem from '../components/BlogItem'
import translations from '../helpers/translations'
import parseChannelRegionInfo from '../helpers/channels'

export const IndexPageTemplate = ({
  pageContext,
  image,
  title,
  subtitle,
  mainpitch,
  bigimage,
  intro,
  post,
  basepath,
  channel
}) => {
  const { channelRegionLocale, channelRegionPathPrefix } = parseChannelRegionInfo(pageContext.channel)
  const pageText = translations.getTranslations(channelRegionLocale)

  return (
    <div>
      <div
        className="full-width-image margin-top-0"
        style={{
          backgroundImage: `url(${
            !!image.childImageSharp ? image.childImageSharp.fluid.src : image
          })`,
          backgroundPosition: `top left`,
          backgroundAttachment: `fixed`
        }}>
        <div
          style={{
            display: 'flex',
            height: '150px',
            lineHeight: '1',
            justifyContent: 'space-around',
            alignItems: 'left',
            flexDirection: 'column'
          }}>
          <h1
            className="has-text-weight-bold is-size-3-mobile is-size-2-tablet is-size-1-widescreen"
            style={{
              boxShadow:
                'rgba(0, 0, 0, 0.75) 0.5rem 0px 0px, rgba(0, 0, 0, 0.75) -0.5rem 0px 0px',
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
              color: 'white',
              lineHeight: '1',
              padding: '0.25em'
            }}>
            {title}
          </h1>
          <h3
            className="has-text-weight-bold is-size-5-mobile is-size-5-tablet is-size-4-widescreen"
            style={{
              boxShadow:
                'rgba(0, 0, 0, 0.75) 0.5rem 0px 0px, rgba(0, 0, 0, 0.75) -0.5rem 0px 0px',
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
              color: 'white',
              lineHeight: '1',
              padding: '0.25em'
            }}>
            {subtitle}
          </h3>
        </div>
      </div>

      <section className="section section--gradient">
        <div className="container">
          <div className="section">
            <div className="columns">
              <div className="column is-10 is-offset-1">
                <div className="content">
                  <div className="content">
                    <div className="tile">
                      <h3 className="subtitle">{mainpitch.description}</h3>
                    </div>
                  </div>
                  
                  <section className="section">
                    <div className="container has-text-centered">
                      <div className="block">
                        <PreviewCompatibleImage imageInfo={bigimage} />
                      </div>
                      
                      <PhotoGrid gridItems={intro.blurbs} />
                      
                      <h4 className="title is-spaced is-4">{intro.heading}</h4>
                      <p className="subtitle">{intro.description}</p>
                    </div>
                  </section>
                  
                  <div className="columns">
                    <div className="column is-12 has-text-centered">
                      <Link className="btn" to={`${channelRegionPathPrefix}/products`}>
                        {pageText.seeallproducts}
                      </Link>
                    </div>
                  </div>
                  <div className="column is-12">
                    <BlogItem post={post} pageContext={pageContext} columnWidth="is-12" />
                    <div className="column is-12 has-text-centered">
                      <Link className="btn" to={`${channelRegionPathPrefix}/blog`}>
                        {pageText.readmore}
                      </Link> 
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

IndexPageTemplate.propTypes = {
  pageContext: PropTypes.object,
  image: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  title: PropTypes.string,
  subtitle: PropTypes.string,
  mainpitch: PropTypes.object,
  bigimage: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  intro: PropTypes.shape({
    blurbs: PropTypes.array
  }),
  post: PropTypes.object,
  basepath: PropTypes.string,
  channel: PropTypes.object,
}

const IndexPage = ({ pageContext, data }) => {
  const { frontmatter } = data.markdownRemark

  if (!pageContext.channel) {
    pageContext = {
      basePath: frontmatter.basepath,
      channel: frontmatter.channel
    }
  }

  return (
    <Layout pageContext={pageContext}>
      <IndexPageTemplate
        pageContext={pageContext}
        image={frontmatter.image}
        title={frontmatter.title}
        subtitle={frontmatter.subtitle}
        heading={frontmatter.heading}
        mainpitch={frontmatter.mainpitch}
        bigimage={frontmatter.bigimage}
        description={frontmatter.description}
        intro={frontmatter.intro}
        post={data.allMarkdownRemark.edges[0].node}
        basepath={frontmatter.basepath}
        channel={frontmatter.channel}
      />
    </Layout>
  )
}

IndexPage.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.shape({
      frontmatter: PropTypes.object
    }),
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.array,
    })
  })
}

export default IndexPage

export const pageQuery = graphql`
  query IndexPageTemplate($id: String!) {
    markdownRemark(id: { eq: $id }) {
      frontmatter {
        basepath,
        channel {
          external_id
        },
        title
        subtitle
        image {
          childImageSharp {
            fluid(maxWidth: 2048, quality: 100) {
              ...GatsbyImageSharpFluid
            }
          }
        }
        mainpitch {
          description
        }
        bigimage {
         image {
            childImageSharp {
              fluid(maxWidth: 240, quality: 64) {
                ...GatsbyImageSharpFluid
              }
            }
            publicURL
          }
          alt
        }
        intro {
          blurbs {
            image {
              childImageSharp {
                fluid(maxWidth: 240, quality: 64) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
            text
          }
          heading
          description
        }
      }
    }
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___featuredpost, frontmatter___date] }
      filter: { frontmatter: { templateKey: { eq: "blog-post" } } }
      limit: 1
    ) {
      edges {
        node {
          excerpt(pruneLength: 400)
          id
          fields {
            slug
          }
          frontmatter {
            title
            templateKey
            date(formatString: "MMMM DD, YYYY")
            featuredpost
            featuredimage {
              childImageSharp {
                fluid(maxWidth: 120, quality: 100) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
        }
      }
    }
  }
`
