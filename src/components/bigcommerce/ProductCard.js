import React from 'react';
import { Link } from 'gatsby';
import AddToCartButton from './AddToCartButton';
import ProductPrices from './ProductPrices';

// const channelRegionNameIdx = 0
// const channelRegionLocaleIdx = 1
// const channelRegionPathIdx = 2
const channelRegionCurrencyIdx = 3

class ProductCard extends React.Component {
  render() {
    const product = this.props.product
    
    if (this.props.channelProductData[product.bigcommerce_id]) {
      const overrides = this.props.channelProductData[product.bigcommerce_id].overrides
      const channel = this.props.channel
      const productLink = this.props.channelProductData[product.bigcommerce_id].productPath
      const channelId = channel.bigcommerce_id
      const currencyCode = channel.external_id.split('|')[channelRegionCurrencyIdx]

      return (
        <div className="bc-product-card">
          <Link to={productLink} className="bc-product-card-image-anchor" title={overrides.name || product.name}>
            <div className="bc-product-card__featured-image">
              <img
                className="attachment-bc-medium size-bc-medium"
                src={
                  (product.images.length && product.images[0].url_standard) ||
                  '/img/default-bc-product.png'
                }
                alt={overrides.name || product.name}
              />
            </div>
          </Link>

          <div className="bc-product__meta">
            <h3 className="bc-product__title">
              <Link to={productLink} className="bc-product__title-link" title={overrides.name || product.name}>{overrides.name || product.name}</Link>
            </h3>
            
            <ProductPrices product={product} channelId={channelId} currencyCode={currencyCode}  />
          </div>

          <AddToCartButton
            productId={product.variants[0].product_id}
            variantId={product.variants[0].id}>
            Add to Cart
          </AddToCartButton>
        </div>
      )
    } else {
      return (<div/>)
    }
  }
}

export default ProductCard;
