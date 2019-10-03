import React from 'react';
import { graphql } from 'gatsby';

import AddToCartButton from '../components/AddToCartButton';

export default ({ data }) => (
  <div className="content">
    <h1>product</h1>
    <h3>tap tap tap, is this thing on??</h3>
    <pre>{JSON.stringify(data, null, 2)}</pre>
  </div>
);

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
