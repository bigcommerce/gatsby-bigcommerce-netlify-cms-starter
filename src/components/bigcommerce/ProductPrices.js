import React from 'react'
import CurrencyFormatter from './CurrencyFormatter'

class ProductPrices extends React.Component {
  constructor(props) {
    super(props);
    
    const storageKey = `${window.location.hostname}-${this.props.product.bigcommerce_id}-${this.props.channelId}-${this.props.currencyCode}-${this.props.customerId}`
    let prices = { price: null, calculated_price: null, sale_price: null }
    let pricesCached = false

    if (typeof(Storage) !== "undefined") {
      if (sessionStorage.getItem(storageKey)) {
        pricesCached = true
        prices = JSON.parse(sessionStorage.getItem(storageKey))
      }
    } else {
      console.log('Browser does not support localStorage / sessionStorage')
    }

    this.state = {
      storageKey,
      pricesCached,
      prices
    }
  }

  componentDidMount() {
    if (this.state.pricesCached) {
      return
    }

    const { product, channelId, currencyCode, customerId } = this.props

    const items = [{
      "product_id": product.bigcommerce_id
    }]

    fetch(`/.netlify/functions/bigcommerce?endpoint=pricing/products`, {
      credentials: 'same-origin',
      mode: 'same-origin',
      method: 'POST',
      body: JSON.stringify({
        "channel_id": channelId,
        "currency_code": currencyCode,
        "customer_id": customerId,
        "items": items
      })
    })
    .then(res => res.json())
    .then(response => {
      const price = (response.data[0].price.entered_inclusive) ? 
                      response.data[0].price.tax_inclusive : response.data[0].price.tax_exclusive

      const calculated_price = (response.data[0].calculated_price.entered_inclusive) ? 
                                response.data[0].calculated_price.tax_inclusive : response.data[0].calculated_price.tax_exclusive

      const sale_price = (response.data[0].sale_price) ? 
                          (response.data[0].sale_price.entered_inclusive) ? response.data[0].sale_price.tax_inclusive : response.data[0].sale_price.tax_exclusive
                          : null

      sessionStorage.setItem(this.state.storageKey, JSON.stringify({ 
        price,
        calculated_price, 
        sale_price
      }))

      this.setState({
        pricesCached: true,
        prices: { 
          price,
          calculated_price, 
          sale_price
        }
      })
    })
    .catch(error => {
      console.error(error);
    });
  }

  render() {
    const { prices } = this.state
    const { currencyCode } = this.props

    return (
      <div className="bc-product__pricing initialized">
            { prices.sale_price ? (
              <p className="bc-product__pricing--api bc-product__pricing--visible">
                <span className="original-price-node bc-product__original-price bc-show-current-price">
                  <CurrencyFormatter
                    currency={currencyCode}
                    amount={prices.price}
                  />
                </span>
                <span className="sale-node bc-product__price bc-product__price--sale bc-show-current-price">
                  <CurrencyFormatter
                    currency={currencyCode}
                    amount={prices.sale_price}
                  />
                </span>
              </p>
            ) : (
              <p className="bc-product__pricing--api bc-product__pricing--visible">
                <span className="price-node bc-product-price bc-product__price--base bc-show-current-price">
                  <CurrencyFormatter
                    currency={currencyCode}
                    amount={prices.calculated_price}
                  />
                </span>
              </p>
            )}
          
      </div>
    )
  }
}

export default ProductPrices
