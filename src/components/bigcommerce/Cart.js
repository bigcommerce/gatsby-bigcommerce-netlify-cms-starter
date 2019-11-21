import React from 'react';
import { Link } from 'gatsby';
import CurrencyFormatter from './CurrencyFormatter';
import Loader from '../Loader';
import CartContext from '../../context/CartProvider';

// const channelRegionNameIdx = 0
// const channelRegionLocaleIdx = 1
const channelRegionPathIdx = 2
// const channelRegionCurrencyIdx = 3

const translations = {
  'fr': {
    'checkout': 'Passer À La Caisse',
    'cartempty': 'Votre panier est vide.',
    'lookaround': 'Regardez autour de vous.',
    'item': 'Article',
    'qty': 'Quantité',
    'price': 'Prix',
    'loadingcart': 'Chariot De Chargement',
    'remove': 'Retirer',
  },
  'default': {
    'checkout': 'Proceed to Checkout',
    'cartempty': 'Your cart is empty.',
    'lookaround': 'Take a look around.',
    'item': 'Item',
    'qty': 'Qty',
    'price': 'Price',
    'loadingcart': 'Loading Cart',
    'remove': 'Remove',
  }
}

const AdjustItem = props => {
  const { item, updatingItem, cartType } = props;
  let minusBtn, plusBtn;

  if (cartType === 'full') {
    minusBtn = (
      <button
        className="bc-btn"
        onClick={() => props.updateCartItemQuantity(item, 'minus')}>
        -
      </button>
    )

    plusBtn = (
      <button
        className="bc-btn"
        onClick={() => props.updateCartItemQuantity(item, 'plus')}>
        +
      </button>
    )
  }

  return (
    <div className="bc-cart-item-quantity">
      {minusBtn}

      {updatingItem === item.id ? <Loader /> : <div>{item.quantity}</div>}
      
      {plusBtn}
    </div>
  );
};

const CustomItems = props => {
  const { items } = props;
  const cartType = props.cartType;
  let itemImage;

  return (
    <>
      {items.map(item => {
        if (cartType === 'full') {
          itemImage = (
            <div className="bc-cart-item-image">
              <img src="/img/default-bc-product.png" alt={`${item.name}`} />
              <button
                className="bc-link bc-cart-item__remove-button"
                onClick={() => props.removeItemFromCart(item.id)}
                type="button">
                {props.pageText.remove}
              </button>
            </div>
          )
        }

        return (
          <div className="bc-cart-item" key={item.id}>
            {itemImage}
            
            <div className="bc-cart-item-meta">
              <h3 className="bc-cart-item__product-title">{item.name}</h3>
              <span className="bc-cart-item__product-brand">{item.sku}</span>
            </div>
            
            <AdjustItem {...props} item={item} cartType={cartType} />

            <div className="bc-cart-item-total-price">
              <CurrencyFormatter
                currency={props.currency.code}
                amount={item.list_price}
              />
            </div>
          </div>
        )
      })}
    </>
  );
};

const StandardItems = props => {
  const { items } = props;
  const cartType = props.cartType;
  let itemImage;

  return (
    <>
      {items.map(item => {
        if (cartType === 'full') {
          itemImage = (
            <div className="bc-cart-item-image">
              <img src={item.image_url} alt={`${item.name}`} />
              <button
                className="bc-link bc-cart-item__remove-button"
                onClick={() => props.removeItemFromCart(item.id)}
                type="button">
                {props.pageText.remove}
              </button>
            </div>
          )
        }

        return (
          <div className="bc-cart-item" key={item.id}>
            {itemImage}
            
            <div className="bc-cart-item-meta">
              <h3 className="bc-cart-item__product-title">{item.name}</h3>
              <span className="bc-cart-item__product-brand">{item.sku}</span>
            </div>

            <AdjustItem {...props} item={item} cartType={cartType} />

            <div className="bc-cart-item-total-price">
              <CurrencyFormatter
                currency={props.currency.code}
                amount={item.list_price}
              />
            </div>
          </div>
        )
      })}
    </>
  );
};

const GiftCertificateItems = props => {
  const items = props.items;
  const cartType = props.cartType;
  let itemImage;

  return (
    <>
      {items.map(item => {
        if (cartType === 'full') {
          itemImage = (
            <div className="bc-cart-item-image">
              <button
                className="bc-link bc-cart-item__remove-button"
                onClick={() => props.removeItemFromCart(item.id)}
                type="button">
                {props.pageText.remove}
              </button>
            </div>
          )
        }

        return (
          <div className="bc-cart-item" key={item.id}>
            {itemImage}

            <div className="bc-cart-item-meta">
              <h3 className="bc-cart-item__product-title">
                {item.name} - Gift Certificate for {item.recipient.name}
              </h3>
              <span className="bc-cart-item__product-brand">
                Theme: {item.theme}
              </span>
            </div>

            <div className="bc-cart-item-total-price">
              <CurrencyFormatter
                currency={props.currency.code}
                amount={item.amount}
              />
            </div>
          </div>
        )
      })}
    </>
  );
};

const Cart = class extends React.Component {
  render() {
    const cartType = this.props.cartType;
    const pageContext = this.props.pageContext
    const channel = pageContext.channel
    let channelRegionPathPrefix = channel.external_id.split('|')[channelRegionPathIdx]
    let pageText = translations['default']
      
    if (channelRegionPathPrefix.length > 0 && translations[channelRegionPathPrefix]) {
      pageText = translations[channelRegionPathPrefix]
    }

    let cartFooter;

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

          if (cartType === 'full') {
            cartFooter = (
              <footer className="bc-cart-footer">
                <div className="bc-cart-subtotal">
                  <span className="bc-cart-subtotal__label">Subtotal: </span>
                  <span className="bc-cart-subtotal__amount">
                    <CurrencyFormatter
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
                        {pageText.checkout}
                      </button>
                    </form>
                  </div>
                )}
              </footer>
            )
          }

          return (
            <div className="container">
              <section className="bc-cart">
                <div className="bc-cart-error">
                  <p className="bc-cart-error__message"></p>
                </div>
                <header className="bc-cart-header">
                  <div className="bc-cart-header__item">{pageText.item}</div>
                  <div className="bc-cart-header__qty">{pageText.qty}</div>
                  <div className="bc-cart-header__price">{pageText.price}</div>
                </header>
                {state.cartLoading ? (
                  <div className="bc-cart__empty">
                    <h2 className="bc-cart__title--empty">
                      <em>{pageText.loadingcart}</em>
                    </h2>
                  </div>
                ) : numberItems > 0 ? (
                  <div className="bc-cart-body">
                    <StandardItems
                      pageText={pageText}
                      currency={currency}
                      updatingItem={updatingItem}
                      updateCartItemQuantity={updateCartItemQuantity}
                      removeItemFromCart={removeItemFromCart}
                      items={lineItems.physical_items}
                      cartType={cartType}
                    />
                    <StandardItems
                      pageText={pageText}
                      currency={currency}
                      updatingItem={updatingItem}
                      updateCartItemQuantity={updateCartItemQuantity}
                      removeItemFromCart={removeItemFromCart}
                      items={lineItems.digital_items}
                      cartType={cartType}
                    />
                    <CustomItems
                      pageText={pageText}
                      currency={currency}
                      updatingItem={updatingItem}
                      updateCartItemQuantity={updateCartItemQuantity}
                      removeItemFromCart={removeItemFromCart}
                      items={lineItems.custom_items}
                      cartType={cartType}
                    />
                    <GiftCertificateItems
                      pageText={pageText}
                      currency={currency}
                      updatingItem={updatingItem}
                      removeItemFromCart={removeItemFromCart}
                      items={lineItems.gift_certificates}
                      cartType={cartType}
                    />
                  </div>
                ) : (
                  <div className="bc-cart__empty">
                    <h2 className="bc-cart__title--empty">
                      {pageText.cartempty}
                    </h2>
                    <Link to="/products" className="bc-cart__continue-shopping">
                      {pageText.lookaround}
                    </Link>
                  </div>
                )}

                {cartFooter}
              </section>
            </div>
          );
        }}
      </CartContext.Consumer>
    );
  }
};

export default Cart;
