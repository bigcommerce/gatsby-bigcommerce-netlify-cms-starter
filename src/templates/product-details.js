import React, { useState } from 'react';
import { graphql } from 'gatsby';

import AddToCartButton from '../components/AddToCartButton';
import Layout from '../components/Layout';

import useWindow from '../hooks/useWindow';

export default ({
  data: {
    allBigCommerceProducts: {
      nodes: [{ name, id, sku, price, description, variants, images }]
    }
  }
}) => {
  const [selectedImage, updateSelectedImage] = useState(
    images.length && images[0].url_standard
  );
  const currency = '$'; // lets find currency somewhere, ok?
  const { width } = useWindow();
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
          <div
            className="container"
            style={{
              display: 'flex',
              flexDirection: width < 1200 ? 'column' : 'row'
            }}>
            <section
              style={{
                display: 'flex',
                flexDirection: 'column',
                minWidth: '30vw',
                paddingBottom: '50px'
              }}>
              <img
                src={
                  (selectedImage && selectedImage) ||
                  '/img/default-bc-product.png'
                }
                style={{ objectFit: 'contain' }}
              />
              <div
                style={{
                  display: 'flex',
                  cursor: 'pointer',
                  justifyContent: 'center'
                }}>
                {images.length &&
                  images.map(img => (
                    <img
                      height="100px"
                      width="100px"
                      src={img.url_thumbnail}
                      alt="thumb"
                      key={JSON.stringify(img)}
                      onClick={() => updateSelectedImage(img.url_standard)}
                    />
                  ))}
              </div>
            </section>
            <section style={{ padding: ' 0 200px' }}>
              <div
                className="content"
                dangerouslySetInnerHTML={{ __html: description }}
              />
              <strong>
                {currency}
                {Number(price).toFixed(2)}
              </strong>
              <AddToCartButton productId={id} variantId={variants[0].id}>
                Add to Cart
              </AddToCartButton>
            </section>
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
          url_thumbnail
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
