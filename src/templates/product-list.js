import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import Layout from '../components/Layout'
import ProductCard from '../components/bigcommerce/ProductCard'
import translations from '../helpers/translations'
import parseChannelRegionInfo from '../helpers/channels'

export const ProductListTemplate = ({
  pageContext,
  products
}) => {
  const channelProductData = pageContext.channelProductData
  const { channelRegionLocale } = parseChannelRegionInfo(pageContext.channel)
  const pageText = translations.getTranslations(channelRegionLocale)

  return (
    <div className="content">
      <div
        className="full-width-image-container margin-top-0"
        style={{
          backgroundImage: `url(/img/boutique-bright-business.jpg)`
        }}>
        <h2
          className="has-text-weight-bold is-size-1"
          style={{
            boxShadow:
              '0.5rem 0 0 rgba(0, 0, 0, 0.75), -0.5rem 0 0 rgba(0, 0, 0, 0.75)',
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            color: 'white',
            padding: '1rem'
          }}>
          {pageText.products}
        </h2>
      </div>
      <section className="section section--gradient">
        <div className="container">
          <div className="section bc-product-grid bc-product-grid--archive bc-product-grid--4col">
            {products.map(product => (
              <ProductCard key={product.id} product={product} channelProductData={channelProductData} channel={pageContext.channel} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

ProductListTemplate.propTypes = {
  pageContext: PropTypes.object,
  products: PropTypes.array
}

const ProductList = ({ pageContext, data }) => {
  const products = data.allBigCommerceProducts.nodes

  return (
    <Layout pageContext={pageContext}>
      <ProductListTemplate
        pageContext={pageContext}
        products={products}
      />
    </Layout>
  )
}

ProductList.propTypes = {
  data: PropTypes.shape({
    allBigCommerceProducts: PropTypes.shape({
      nodes: PropTypes.array
    })
  })
}

export default ProductList

export const productListQuery = graphql`
  query productList {
    allBigCommerceProducts {
      nodes {
        id
        brand_id
        name
        sku
        price
        calculated_price
        retail_price
        sale_price
        map_price
        bigcommerce_id
        custom_url {
          url
        }
        images {
          url_thumbnail
          url_standard
        }
        variants {
          product_id
          id
          option_values {
            label
            option_display_name
          }
          sku
        }
      }
    }
  }
`
