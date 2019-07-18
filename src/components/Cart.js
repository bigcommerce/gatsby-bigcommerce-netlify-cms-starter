import React from 'react'
import { Link } from 'gatsby'
import axios from 'axios'

const Cart = class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      cartLoading: false,
      cartError: false,
      cart: {
        currency: {},
        cartAmount: 0,
        lineItems: {},
        numberItems: 0,
        redirectUrls: {},
      },
    }
  }

  componentDidMount() {
    this.fetchCart()
  }

  fetchCart = () => {
    this.setState({ cartLoading: true })
    axios
      .get(`/.netlify/functions/bigcommerce?endpoint=carts`)
      .then(response => {
        const lineItems = response.data.data.line_items;
        const cartAmount = response.data.data.cart_amount;
        const currency = response.data.data.currency;

        this.setState({
          cartLoading: false,
          cart: {
            currency,
            cartAmount,
            lineItems,
            numberItems: lineItems.physical_items.length + lineItems.digital_items.length + lineItems.custom_items.length + lineItems.gift_certificates.length,
            redirectUrls: response.data.data.redirect_urls,
          },
        })
      })
      .catch(error => {
        this.setState({ cartLoading: false, cartError: error })
      })
  }

  updateCartItemQuantity = () => {
    console.log("updateCartItemQuantity()")
  }

  removeCartItem = () => {
    console.log("removeCartItem()")
  }

  render() {
    const { currency, cartAmount, lineItems, numberItems, redirectUrls } = this.state.cart

    const CustomItems = (props) => {
      const items = props.items;

      return items.map(item => 
        <div className="bc-cart-item">
          <div className="bc-cart-item-image">
              <img width="270" height="270" src="/img/coffee.png" alt={ `Image for ${item.name}` } />
              <button className="bc-link bc-cart-item__remove-button" onClick={this.removeCartItem(item.id)} type="button">Remove</button>
          </div>

          <div className="bc-cart-item-meta">
            <h3 className="bc-cart-item__product-title">
              {item.name}
            </h3>
            <span className="bc-cart-item__product-brand">{item.sku}</span>
          </div>

          <div className="bc-cart-item-quantity">
            <label for="bc-cart-item__quantity" className="u-bc-screen-reader-text">Quantity</label>

            <input type="number" className="bc-cart-item__quantity-input" onChange={this.updateCartItemQuantity(item.id)} value={item.quantity} min="1" max="" />
          </div>
              
          <div className="bc-cart-item-total-price">
            ${item.list_price}
          </div>
        </div>
      )
    }

    const PhysicalItems = (props) => {
      const items = props.items;

      return items.map(item => 
        <div className="bc-cart-item">
          <div className="bc-cart-item-image">
              <img width="270" height="270" src="/img/coffee.png" alt={ `Image for ${item.name}` } />
              <button className="bc-link bc-cart-item__remove-button" data-cart_item_id={item.id} type="button">Remove</button>
          </div>

          <div className="bc-cart-item-meta">
            <h3 className="bc-cart-item__product-title">
              {item.name}
            </h3>
            <span className="bc-cart-item__product-brand">{item.sku}</span>
          </div>

          <div className="bc-cart-item-quantity">
            <label for="bc-cart-item__quantity" className="u-bc-screen-reader-text">Quantity</label>

            <input type="number" name="bc-cart-item__quantity" className="bc-cart-item__quantity-input" value={item.quantity} min="1" max="" />
          </div>
              
          <div className="bc-cart-item-total-price">
            ${item.list_price}
          </div>
        </div>
      )
    }


    "line_items": {
      "physical_items": [{
        "id": "666d1bda-7885-414a-8cd8-1b671a7de930",
        "parent_id": null,
        "variant_id": 4,
        "product_id": 4,
        "sku": "TEST-2",
        "name": "Test Product 2",
        "url": "https://app-test-store.mybigcommerce.com/test-product-2/",
        "quantity": 7,
        "taxable": true,
        "image_url": "https://cdn11.bigcommerce.com/s-2bapcono7r/products/4/images/3/apil9atk1__13801.1540585129.220.290.png?c=2",
        "discounts": [],
        "coupons": [],
        "discount_amount": 0,
        "coupon_amount": 0,
        "list_price": 20,
        "sale_price": 20,
        "extended_list_price": 140,
        "extended_sale_price": 140,
        "is_require_shipping": true
      }],
      "digital_items": [{
        "id": "5e55d159-bb87-4a77-b75b-c0944173b2d2",
        "parent_id": null,
        "variant_id": 110,
        "product_id": 55,
        "sku": "DOWNLOAD-1",
        "name": "Downloadable Product",
        "url": "https://app-test-store.mybigcommerce.com/downloadable-product/",
        "quantity": 1,
        "taxable": true,
        "image_url": "https://cdn11.bigcommerce.com/r-cfcff2e8acd98b7a58600f747e5ddc2b7f306d38/themes/ClassicNext/images/ProductDefault.gif",
        "discounts": [],
        "coupons": [],
        "discount_amount": 0,
        "coupon_amount": 0,
        "list_price": 50,
        "sale_price": 50,
        "extended_list_price": 50,
        "extended_sale_price": 50,
        "is_require_shipping": false
      }],
      "gift_certificates": [{
        "id": "4f1c0c79-a673-4379-a8f1-391386caedcf",
        "name": "Happy Birthday",
        "theme": "Birthday",
        "amount": 50,
        "quantity": 1,
        "taxable": false,
        "sender": {
          "name": "Jane Does",
          "email": "janedoe@email.com"
        },
        "recipient": {
          "name": "Jane Does",
          "email": "janedoe@email.com"
        },
        "message": "Happy Birthday Jane!"
      }],
      "custom_items": [{
        "id": "419a790e-9f53-488a-b6bf-f30ba7417601",
        "sku": "abc-123",
        "name": "Custom Product",
        "quantity": 1,
        "list_price": 10,
        "extended_list_price": 10
      }]

    return (
      <div className="container">
        <section className="bc-cart">
          <div className="bc-cart-error">
            <p className="bc-cart-error__message"></p>
          </div>
          <header className="bc-cart-header">
            <div className="bc-cart-header__item">Item</div>
            <div className="bc-cart-header__qty">Qty</div>
            <div className="bc-cart-header__price">Price</div>
          </header>
          {this.state.cartLoading ? (
            <div className="bc-cart__empty">
              <h2 className="bc-cart__title--empty"><em>Loading Cart</em></h2>
            </div>
          ) : numberItems > 0 ? (
            <div className="bc-cart-body">
              <CustomItems items={lineItems.custom_items} />
            </div>
          ) : (
            <div className="bc-cart__empty">
              <h2 className="bc-cart__title--empty">Your cart is empty.</h2>
              <Link href="/products" className="bc-cart__continue-shopping">Take a look around.</Link>
            </div>
          )}

          <footer className="bc-cart-footer">
            <div className="bc-cart-subtotal">
              <span className="bc-cart-subtotal__label">Subtotal: </span>
              <span className="bc-cart-subtotal__amount">${cartAmount}</span>
            </div>

            <div className="bc-cart-actions">
              <form action={ redirectUrls.checkout_url } method="post" enctype="multipart/form-data">
                <button className="bc-btn bc-cart-actions__checkout-button" type="submit">Proceed to Checkout</button>
              </form>
            </div>
          </footer>

        </section>
      </div>
    )
  }
}

export default Cart
