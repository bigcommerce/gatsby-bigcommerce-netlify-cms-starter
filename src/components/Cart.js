import React from 'react';
import { Link } from 'gatsby';

import Loader from './Loader';

import CartContext from '../context/CartProvider';

const FormattedAmount = props => {
  const currency = props.currency;
  const amount = props.amount;
  const languageCode =
    typeof window !== 'undefined'
      ? window.navigator.language || 'en-US'
      : 'en-US';
  const formattedPrice = new Intl.NumberFormat(languageCode, {
    style: 'currency',
    currency
  }).format(amount);
  return formattedPrice;
};

const AdjustItem = props => {
  const { item, updatingItem } = props;
  return (
    <div className="bc-cart-item-quantity">
      <button
        className="bc-btn"
        onClick={() => props.updateCartItemQuantity(item, 'minus')}>
        -
      </button>
      {updatingItem === item.id ? <Loader /> : <div>{item.quantity}</div>}
      <button
        className="bc-btn"
        onClick={() => props.updateCartItemQuantity(item, 'plus')}>
        +
      </button>
    </div>
  );
};

const CustomItems = props => {
  const { items } = props;
  return (
    <>
      {items.map(item => (
        <div className="bc-cart-item" key={item.id}>
          <div className="bc-cart-item-image">
            <img height="270" src="/img/coffee.png" alt={`${item.name}`} />
            <button
              className="bc-link bc-cart-item__remove-button"
              onClick={() => props.removeItemFromCart(item.id)}
              type="button">
              Remove
            </button>
          </div>

          <div className="bc-cart-item-meta">
            <h3 className="bc-cart-item__product-title">{item.name}</h3>
            <span className="bc-cart-item__product-brand">{item.sku}</span>
          </div>

          <AdjustItem {...props} item={item} />

          <div className="bc-cart-item-total-price">
            <FormattedAmount
              currency={props.currency.code}
              amount={item.list_price}
            />
          </div>
        </div>
      ))}
    </>
  );
};

const StandardItems = props => {
  const { items } = props;
  return (
    <>
      {items.map(item => (
        <div className="bc-cart-item" key={item.id}>
          <div className="bc-cart-item-image">
            <img height="270" src={item.image_url} alt={`${item.name}`} />
            <button
              className="bc-link bc-cart-item__remove-button"
              onClick={() => props.removeItemFromCart(item.id)}
              type="button">
              Remove
            </button>
          </div>

          <div className="bc-cart-item-meta">
            <h3 className="bc-cart-item__product-title">{item.name}</h3>
            <span className="bc-cart-item__product-brand">{item.sku}</span>
          </div>
          <AdjustItem {...props} item={item} />
          <div className="bc-cart-item-total-price">
            <FormattedAmount
              currency={props.currency.code}
              amount={item.list_price}
            />
          </div>
        </div>
      ))}
    </>
  );
};

const GiftCertificateItems = props => {
  const items = props.items;

  return (
    <>
      {items.map(item => (
        <div className="bc-cart-item" key={item.id}>
          <div className="bc-cart-item-image">
            <button
              className="bc-link bc-cart-item__remove-button"
              onClick={() => props.removeItemFromCart(item.id)}
              type="button">
              Remove
            </button>
          </div>

          <div className="bc-cart-item-meta">
            <h3 className="bc-cart-item__product-title">
              {item.name} - Gift Certificate for {item.recipient.name}
            </h3>
            <span className="bc-cart-item__product-brand">
              Theme: {item.theme}
            </span>
          </div>

          <div className="bc-cart-item-total-price">
            <FormattedAmount
              currency={props.currency.code}
              amount={item.amount}
            />
          </div>
        </div>
      ))}
    </>
  );
};

const Cart = class extends React.Component {
  render() {
    return (
      <CartContext.Consumer>
        {value => {
          if (!value) {
            return null;
          }
          const { state, removeItemFromCart, updateCartItemQuantity } = value;
          const {
            currency,
            cartAmount,
            lineItems,
            numberItems,
            redirectUrls
          } = state.cart;
          const { updatingItem } = state;
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
                {state.cartLoading ? (
                  <div className="bc-cart__empty">
                    <h2 className="bc-cart__title--empty">
                      <em>Loading Cart</em>
                    </h2>
                  </div>
                ) : numberItems > 0 ? (
                  <div className="bc-cart-body">
                    <StandardItems
                      currency={currency}
                      updatingItem={updatingItem}
                      updateCartItemQuantity={updateCartItemQuantity}
                      removeItemFromCart={removeItemFromCart}
                      items={lineItems.physical_items}
                    />
                    <StandardItems
                      currency={currency}
                      updatingItem={updatingItem}
                      updateCartItemQuantity={updateCartItemQuantity}
                      removeItemFromCart={removeItemFromCart}
                      items={lineItems.digital_items}
                    />
                    <CustomItems
                      currency={currency}
                      updatingItem={updatingItem}
                      updateCartItemQuantity={updateCartItemQuantity}
                      removeItemFromCart={removeItemFromCart}
                      items={lineItems.custom_items}
                    />
                    <GiftCertificateItems
                      currency={currency}
                      updatingItem={updatingItem}
                      removeItemFromCart={removeItemFromCart}
                      items={lineItems.gift_certificates}
                    />
                  </div>
                ) : (
                  <div className="bc-cart__empty">
                    <h2 className="bc-cart__title--empty">
                      Your cart is empty.
                    </h2>
                    <Link to="/products" className="bc-cart__continue-shopping">
                      Take a look around.
                    </Link>
                  </div>
                )}

                <footer className="bc-cart-footer">
                  <div className="bc-cart-subtotal">
                    <span className="bc-cart-subtotal__label">Subtotal: </span>
                    <span className="bc-cart-subtotal__amount">
                      <FormattedAmount
                        currency={currency.code}
                        amount={cartAmount}
                      />
                    </span>
                  </div>

                  {numberItems > 0 && (
                    <div className="bc-cart-actions">
                      <form
                        action={redirectUrls.checkout_url}
                        method="post"
                        encType="multipart/form-data">
                        <button
                          className="bc-btn bc-cart-actions__checkout-button"
                          type="submit">
                          Proceed to Checkout
                        </button>
                      </form>
                    </div>
                  )}
                </footer>
              </section>
            </div>
          );
        }}
      </CartContext.Consumer>
    );
  }
};

export default Cart;
