var proxy = require('http-proxy-middleware');
require('dotenv').config();

module.exports = {
  siteMetadata: {
    title: 'Gatsby + BigCommerce + Netlify CMS Starter',
    description:
      'This repo contains an example ecommerce website that is built with Gatsby, BigCommerce and Netlify CMS. It follows the JAMstack architecture by using Git as a single source of truth for content, BigCommerce for catalog / cart / checkout, and Netlify for continuous deployment.'
  },
  plugins: [
    {
      resolve: 'gatsby-source-bigcommerce',
      options: {
        // REQUIRED
        clientId: process.env.API_CLIENT_ID,
        secret: process.env.API_SECRET,
        accessToken: process.env.API_TOKEN,
        storeHash: process.env.API_STORE_HASH,
        endpoints: {
          BigCommerceProducts: '/catalog/products?include=images,variants,custom_fields,options,modifiers,videos',
          BigCommerceCategories: '/catalog/categories',
          BigCommerceBrands: "/catalog/brands"
        }
      }
    },
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-sass',
    {
      // keep as first gatsby-source-filesystem plugin for gatsby image support
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/static/img`,
        name: 'uploads'
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/src/pages`,
        name: 'pages'
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/src/img`,
        name: 'images'
      }
    },
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: 'gatsby-remark-relative-images',
            options: {
              name: 'uploads'
            }
          },
          {
            resolve: 'gatsby-remark-images',
            options: {
              // It's important to specify the maxWidth (in pixels) of
              // the content container as this plugin uses this as the
              // base for generating different widths of each image.
              maxWidth: 2048
            }
          },
          {
            resolve: 'gatsby-remark-copy-linked-files',
            options: {
              destinationDir: 'static'
            }
          }
        ]
      }
    },
    {
      resolve: 'gatsby-plugin-netlify-cms',
      options: {
        modulePath: `${__dirname}/src/cms/cms.js`
      }
    },
    {
      resolve: 'gatsby-plugin-purgecss', // purges all unused/unreferenced css rules
      options: {
        develop: true, // Activates purging in npm run develop
        purgeOnly: ['/all.sass'] // applies purging only on the bulma css file
      }
    }, // must be after other CSS plugins
    'gatsby-plugin-netlify' // make sure to keep it last in the array
  ],
  // for avoiding CORS while developing Netlify Functions locally
  // read more: https://www.gatsbyjs.org/docs/api-proxy/#advanced-proxying
  developMiddleware: app => {
    app.use(
      '/.netlify/functions/',
      proxy({
        target: 'http://localhost:9000',
        pathRewrite: {
          '/.netlify/functions/': ''
        }
      })
    );
  }
};
