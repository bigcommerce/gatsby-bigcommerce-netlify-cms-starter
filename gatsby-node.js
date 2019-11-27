require('dotenv').config()
const axios = require('axios')
const _ = require('lodash')
const path = require('path')
const { createFilePath } = require('gatsby-source-filesystem')
const { fmImagesToRelative } = require('gatsby-remark-relative-images')

const availableRegions = []

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
    return result.data.data
  }).catch(function (error) {
    console.log(error)
  })
}

exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions

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
              localeKey
              basepath
              channel {
                external_id
              }
            }
          }
        }
      }
      allRootChannelPosts: allMarkdownRemark(filter: {frontmatter: {channel: { external_id: {regex: "/[|][|]/i"}}}}) {
        edges {
          node {
            id
            fields {
              slug
            }
            frontmatter {
              tags
              templateKey
              localeKey
              basepath
              channel {
                external_id
              }
            }
          }
        }
      }
      allBigCommerceProducts(limit: 1000) {
        nodes {
          id
          bigcommerce_id
          name
          custom_url {
            url
          }
        }
      }
      allBigCommerceChannels(filter: {is_enabled: {eq: true}, platform: {eq: "custom"}, type: {eq: "storefront"}}) {
        nodes {
          id
          bigcommerce_id
          external_id
          is_enabled
          name
          platform
          type
        }
      }
      allBigCommerceCurrencies(filter: {enabled: {eq: true}}) {
        nodes {
          bigcommerce_id
          decimal_places
          decimal_token
          currency_exchange_rate
          currency_code
          is_default
          is_transactional
          name
          thousands_token
          token
          token_location
        }
      }
    }
  `)

  if (result.errors) {
    result.errors.forEach(e => console.error(e.toString()))
    return Promise.reject(result.errors)
  }

  const posts = result.data.allMarkdownRemark.edges
  const rootChannelPosts = result.data.allRootChannelPosts.edges
  const products = result.data.allBigCommerceProducts.nodes
  const channels = result.data.allBigCommerceChannels.nodes
  const currencies = result.data.allBigCommerceCurrencies.nodes

  for (var i = channels.length - 1; i >= 0; i--) {
    let channel = channels[i]

    const [ regionName, regionLocaleCode, regionPathPrefix, regionCurrency ] = channel.external_id.split('|')
    availableRegions.push(channel)

    console.log(`creating product pages for channel '${channel.name}' targeting ${regionName} (${regionLocaleCode}) with currency of ${regionCurrency} using subdirectory /${regionPathPrefix}`)

    let channelListings = await fetchChannelListings(channel.bigcommerce_id)
    let channelProducts = []
    for (var x = channelListings.length - 1; x >= 0; x--) {
      let channelListing = channelListings[x]
      // console.log(`product_id: ${channelListing.product_id} listing_id: ${channelListing.listing_id}`)

      if (channelListing.state === "active") {
        products.forEach( ({ bigcommerce_id, custom_url, id }) => {
          if (bigcommerce_id === channelListing.product_id) {
            console.log(`${regionPathPrefix}/products${custom_url.url}`)

            channelProducts[bigcommerce_id] = {
              productPath: `${regionPathPrefix}/products${custom_url.url}`,
              overrides: channelListing.overrides || {}
            }

            createPage({
              path: `${regionPathPrefix}/products${custom_url.url}`,
              component: path.resolve(`src/templates/product-details.js`),
              context: {
                basePath: `/products${custom_url.url}`,
                productId: id,
                channel,
                channels,
                currencies,
                overrides: channelListing.overrides || {}
              }
            })
          }
        })
      }
    }
    
    console.log(`${regionPathPrefix}/products`)
    createPage({
      path: `${regionPathPrefix}/products`,
      component: path.resolve(`src/templates/product-list.js`),
      context: {
        basePath: `/products`,
        channel,
        channels,
        currencies,
        channelProductData: channelProducts
      }
    })
  }

  const postSlugsCreated = []
  posts.forEach(edge => {
    const id = edge.node.id

    let pagePath = edge.node.fields.slug
    if (edge.node.frontmatter.localeKey && edge.node.frontmatter.localeKey !== 'default') {
      const [ regionName, regionLocaleCode, regionPathPrefix, regionCurrency ] = edge.node.frontmatter.channel.external_id.split('|')
      
      let basePath = edge.node.frontmatter.basepath ? edge.node.frontmatter.basepath : ''
      if (basePath !== '' && basePath[0] !== '/') {
        basePath = `/${basePath}`
      }

      let newPagePath = `${regionPathPrefix}${basePath}/`
      if (regionPathPrefix !== '' && newPagePath[0] !== '/') {
        pagePath = `/${newPagePath}`
      }
    }

    console.log(`creating post ${pagePath}`)

    createPage({
      path: pagePath,
      tags: edge.node.frontmatter.tags,
      component: path.resolve(
        `src/templates/${String(edge.node.frontmatter.templateKey)}.js`
      ),
      // additional data can be passed via context
      context: {
        id
      }
    })

    // Store posts created so we can skip over creating them in the next part
    // since we want to preserve the markdown generated region overrides
    postSlugsCreated.push(pagePath)
  })


  // Now go through and create region specific pages automatically for root pages that are
  // not manually created via markdown files in region specific directories. This allows newly
  // added regions to have all the core pages without the requirement of making new markdown files.
  rootChannelPosts.forEach(edge => {
    const id = edge.node.id

    for (var i = availableRegions.length - 1; i >= 0; i--) {
      const channel = availableRegions[i]
      const [ regionName, regionLocaleCode, regionPathPrefix, regionCurrency ] = channel.external_id.split('|')
      let newPagePath = `${regionPathPrefix}${edge.node.fields.slug}`
      if (regionPathPrefix !== '' && newPagePath[0] !== '/') {
        newPagePath = `/${newPagePath}`
      }

      if (!postSlugsCreated.includes(newPagePath)) {
        console.log(`creating post ${newPagePath} for channel '${channel.name}'`)

        createPage({
          path: newPagePath,
          tags: edge.node.frontmatter.tags,
          component: path.resolve(
            `src/templates/${String(edge.node.frontmatter.templateKey)}.js`
          ),
          context: {
            id,
            basePath: edge.node.fields.slug,
            channel
          }
        })
      }
    }
  })

  // Tag pages:
  let tags = []
  const tagPagesCreated = []
  // Iterate through each post, putting all found tags into `tags`
  posts.forEach(edge => {
    if (_.get(edge, `node.frontmatter.tags`)) {
      tags = tags.concat(edge.node.frontmatter.tags)
    }
  })
  // Eliminate duplicate tags
  tags = _.uniq(tags)

  // Make tag pages
  tags.forEach(tag => {
    const tagPath = `/tags/${_.kebabCase(tag)}/`

    createPage({
      path: tagPath,
      component: path.resolve(`src/templates/tags.js`),
      context: {
        tag
      }
    })
  })

  // Make region tag pages
  tags.forEach(tag => {
    const tagPath = `/tags/${_.kebabCase(tag)}/`

    for (var i = availableRegions.length - 1; i >= 0; i--) {
      const channel = availableRegions[i]
      const [ regionName, regionLocaleCode, regionPathPrefix, regionCurrency ] = channel.external_id.split('|')
      let newPagePath = `${regionPathPrefix}${tagPath}`
      if (regionPathPrefix !== '' && newPagePath[0] !== '/') {
        newPagePath = `/${newPagePath}`
      }
      
      console.log(`creating tag page ${newPagePath} for channel '${channel.name}'`)

      createPage({
        path: newPagePath,
        component: path.resolve(`src/templates/tags.js`),
        context: {
          tag,
          basePath: tagPath,
          channel
        }
      })
    }
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions
  fmImagesToRelative(node) // convert image paths for gatsby images

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value
    })
  }
}

exports.onCreatePage = ({ page, actions }) => {
  const { createPage, deletePage } = actions
  const componentPath = `src/${page.componentPath.split('/src/')[1]}`
  const replacePath = path => (path === `/` ? path : path.replace(/\/$/, ``))

  deletePage(page)

  for (var i = availableRegions.length - 1; i >= 0; i--) {
    const channel = availableRegions[i]
    const [ regionName, regionLocaleCode, regionPathPrefix, regionCurrency ] = channel.external_id.split('|')
    const newPagePath = `${regionPathPrefix}${page.path}`
    console.log(`creating page ${newPagePath} for channel '${channel.name}'`)

    createPage({
      path: replacePath(newPagePath),
      component: page.componentPath,
      context: {
        ...page.context,
        basePath: replacePath(page.path),
        channel
      },
    })
  }
}
