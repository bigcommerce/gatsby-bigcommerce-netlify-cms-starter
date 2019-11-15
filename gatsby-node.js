require('dotenv').config();
const axios = require('axios');
const _ = require('lodash');
const path = require('path');
const { createFilePath } = require('gatsby-source-filesystem');
const { fmImagesToRelative } = require('gatsby-remark-relative-images');

async function fetchChannels() {
  return await axios({
    url: `https://api.bigcommerce.com/stores/${process.env.API_STORE_HASH}/v3/channels`,
    method: 'get',
    headers: {
      'X-Auth-Token': process.env.API_TOKEN,
      'X-Auth-Client': process.env.API_CLIENT_ID,
      'Content-Type': 'application/json'
    }
  }).then((result) => {
    return result.data.data;
  }).catch(function (error) {
    console.log(error);
  });
}

async function fetchChannelListings(channelID) {
  return await axios({
    url: `https://api.bigcommerce.com/stores/${process.env.API_STORE_HASH}/v3/channels/${channelID}/listings`,
    method: 'get',
    headers: {
      'X-Auth-Token': process.env.API_TOKEN,
      'X-Auth-Client': process.env.API_CLIENT_ID,
      'Content-Type': 'application/json'
    }
  }).then((result) => {
    return result.data.data;
  }).catch(function (error) {
    console.log(error);
  });
}

exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions;

  const result = await graphql(`
    {
      allMarkdownRemark(limit: 1000) {
        edges {
          node {
            id
            fields {
              slug
            }
            frontmatter {
              tags
              templateKey
            }
          }
        }
      }
      allBigCommerceProducts(limit: 100) {
        nodes {
          id
          bigcommerce_id
          name
          custom_url {
            url
          }
        }
      }
    }
  `);

  if (result.errors) {
    result.errors.forEach(e => console.error(e.toString()));
    return Promise.reject(result.errors);
  }

  const posts = result.data.allMarkdownRemark.edges;
  const products = result.data.allBigCommerceProducts.nodes;

  console.log('fetching channels');
  const channels = await fetchChannels();

  for (var i = channels.length - 1; i >= 0; i--) {
    let channel = channels[i];

    if (channel.is_enabled) {
      console.log(`creating product pages for channel: ${channel.name}`);
      let channelListings = await fetchChannelListings(channel.id);

      for (var x = channelListings.length - 1; x >= 0; x--) {
        let channelListing = channelListings[x];
        // console.log(`product_id: ${channelListing.product_id} listing_id: ${channelListing.listing_id}`);

        if (channelListing.state === "active") {
          products.forEach( ({ bigcommerce_id, custom_url, id }) => {
            if (bigcommerce_id === channelListing.product_id) {
              console.log(`${channel.external_id}/products${custom_url.url}`);
              createPage({
                path: `${channel.external_id}/products${custom_url.url}`,
                component: path.resolve(`src/templates/product-details.js`),
                context: {
                  productId: id,
                  overrides: channelListing.overrides || {}
                }
              });
            }
          });
        }
      }
    }
  }

  posts.forEach(edge => {
    const id = edge.node.id;
    createPage({
      path: edge.node.fields.slug,
      tags: edge.node.frontmatter.tags,
      component: path.resolve(
        `src/templates/${String(edge.node.frontmatter.templateKey)}.js`
      ),
      // additional data can be passed via context
      context: {
        id
      }
    });
  });

  // Tag pages:
  let tags = [];
  // Iterate through each post, putting all found tags into `tags`
  posts.forEach(edge => {
    if (_.get(edge, `node.frontmatter.tags`)) {
      tags = tags.concat(edge.node.frontmatter.tags);
    }
  });
  // Eliminate duplicate tags
  tags = _.uniq(tags);

  // Make tag pages
  tags.forEach(tag => {
    const tagPath = `/tags/${_.kebabCase(tag)}/`;

    createPage({
      path: tagPath,
      component: path.resolve(`src/templates/tags.js`),
      context: {
        tag
      }
    });
  });
};

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;
  fmImagesToRelative(node); // convert image paths for gatsby images

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode });
    createNodeField({
      name: `slug`,
      node,
      value
    });
  }
};
