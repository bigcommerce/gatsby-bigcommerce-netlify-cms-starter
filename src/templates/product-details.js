import React, { useState } from 'react';
import { graphql } from 'gatsby';

import AddToCartButton from '../components/AddToCartButton';
import Layout from '../components/Layout';

export default ({
  data: {
    allBigCommerceProducts: {
      nodes: [{ name, id, sku, price, description, variants, images }]
    }
  }
}) => {
  const currency = '$'; // lets find currency somewhere, ok?
  return (
    <Layout>
      <div className="content">
        <div className="has-text-centered margin-top-0">
          <h1
            className="has-text-weight-bold is-size-1"
            style={{
              boxShadow: '0.5rem 0 0 #f40, -0.5rem 0 0 #f40',
              backgroundColor: '#f40',
              color: 'white',
              padding: '1rem'
            }}>
            {name}
          </h1>
        </div>
        <section className="section">
          <div className="container">
            {images.map(img => (
              <img src={img.url_standard} alt="" />
            ))}
            <img src={images[0].url_standard} alt="" />
            <div
              className="content"
              dangerouslySetInnerHTML={{ __html: description }}
            />
            <strong>
              {currency}
              {Number(price).toFixed(2)}
            </strong>
            <AddToCartButton productId={id} variantId={variants[0].id} />
          </div>
        </section>
      </div>
    </Layout>
  );
};

export const query = graphql`
  query($productId: String!) {
    allBigCommerceProducts(filter: { id: { eq: $productId } }) {
      nodes {
        id
        name
        sku
        price
        description
        images {
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
`;
