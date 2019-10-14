import React from 'react';
import CurrencyFormatter from './CurrencyFormatter';

const currencyCode = "USD"; // TODO: Move this to use settings merchant sets up in BigCommerce (v2 Currencies API)

class ProductPrices extends React.Component {
  render() {
    const product = this.props.product;
    let prices;

    if (product.sale_price !== 0) {
      prices =  (
        <p className="bc-product__pricing--api bc-product__pricing--visible">
          <span className="original-price-node bc-product__original-price bc-show-current-price">
            <CurrencyFormatter
              currency={currencyCode}
              amount={product.price}
            />
          </span>
          <span className="sale-node bc-product__price bc-product__price--sale bc-show-current-price">
            <CurrencyFormatter
              currency={currencyCode}
              amount={product.calculated_price}
            />
          </span>
        </p>
      )
    } else {
      prices = (
        <p className="bc-product__pricing--api bc-product__pricing--visible">
          <span className="price-node bc-product-price bc-product__price--base bc-show-current-price">
            <CurrencyFormatter
              currency={currencyCode}
              amount={product.calculated_price}
            />
          </span>
        </p>
      )
    }

    return (
      <div className="bc-product__pricing initialized">
        {prices}
      </div>
    )
  }
}

export default ProductPrices;
