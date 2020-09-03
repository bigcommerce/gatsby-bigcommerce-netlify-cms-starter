# Gatsby + BigCommerce + Netlify CMS Starter

Note: This starter uses Gatsby v2.

[Demo store](https://bigcommerce-store.netlify.com/)

Accompanying tutorial blog post: [Building a JAMstack Ecommerce Storefront with BigCommerce & Netlify](https://www.netlify.com/blog/2020/02/21/building-a-jamstack-ecommerce-storefront-with-bigcommerce-netlify/)

Accompanying overview video: [Building e-commerce storefronts on the JAMstack](https://www.youtube.com/watch?v=Wnm_ErMrjDM)

This version of the starter is meant to power a simple, single language storefront. If you are looking for something more complex, there is also a branch that supports multiple regions within a single storefront [here](https://github.com/bigcommerce/gatsby-bigcommerce-netlify-cms-starter/tree/multi-channel).

## Prerequisites

- Node (v10.16.3) Recommended
- [Gatsby CLI](https://www.gatsbyjs.org/docs/)
- [Netlify CLI](https://www.netlify.com/docs/cli/)
- [A BigCommerce Instance with API keys](https://developer.bigcommerce.com/api-docs)

## Setting up BigCommerce

The BigCommerce source plugin relies on API Keys. In this starter we are using the node project `dotenv` to access these variables. Make a copy of the `SAMPLE.env` file and fill in the variables from your [BigCommerce API user details](https://developer.bigcommerce.com/api-docs/getting-started/authentication#authentication_getting-api-credentials).

*Note: You can sign up for a free trial on bigcommerce.com, which includes API access, if you don't already have an account. There is also a partner program which includes a sandbox account to play around in.*

Once you have your API keys, do the following:
  * Install dependencies
  	* `yarn`
  * Set up environment variables
    * `cp SAMPLE.env .env` 
    * Enter your API credentials in .env file

## Getting Started (Recommended - Netlify CLI)

Netlify CMS can run in any frontend web environment, but the quickest way to try it out is by running it on a pre-configured starter site with Netlify. Because the app requires credentials for the BigCommerce API, the easiest way to get started with a working deploy is via the Netlify CLI. To do so, run the following commands:

  * Link to your Netlify site
  	* `netlify link`
  * Build
  	* `npm run build`
  * Deploy to Netlify
  	* `netlify deploy`


### "One Click" Deploy
Alternative to the CLI, you can use the deploy button below to build and deploy your own copy of the repository. This is recommended if you have not already forked the repo (as it will make a copy of it). 

*Note: The initial deploy will fail, as you need to set build environment variables for your Netlify site*

To set the variables:
 * Navigate to your Netlify site's "Build & Deploy" settings 
 * Go to "Environment variables" > "Edit variables"
 * Enter the environment variables specified in "SAMPLE.env" and your BC API credentials 

<a href="https://app.netlify.com/start/deploy?repository=https://github.com/bigcommerce/gatsby-bigcommerce-netlify-cms-starter"><img src="https://www.netlify.com/img/deploy/button.svg" alt="Deploy to Netlify"></a>

After clicking that button, you’ll authenticate with GitHub and choose a repository name. Netlify will then automatically create a repository in your GitHub account with a copy of the files from the template. Next, it will build and deploy the new site on Netlify, bringing you to the site dashboard when the build is complete. Next, you’ll need to set up Netlify’s Identity service to authorize users to log in to the CMS.

### Access Locally

```
$ git clone https://github.com/[GITHUB_USERNAME]/[REPO_NAME].git
$ cd [REPO_NAME]
$ yarn
$ npm run start
```

To test the CMS locally, you'll need run a production build of the site:

```
$ npm run build
$ npm run serve
```

### Media Libraries (installed, but optional)

Media Libraries have been included in this starter as a default. If you are not planning to use `Uploadcare` or `Cloudinary` in your project, you **can** remove them from module import and registration in `src/cms/cms.js`. Here is an example of the lines to comment or remove them your project.

```javascript
import CMS from 'netlify-cms-app';
// import uploadcare from 'netlify-cms-media-library-uploadcare'
// import cloudinary from 'netlify-cms-media-library-cloudinary'

import AboutPagePreview from './preview-templates/AboutPagePreview';
import BlogPostPreview from './preview-templates/BlogPostPreview';
import ProductPagePreview from './preview-templates/ProductPagePreview';
import IndexPagePreview from './preview-templates/IndexPagePreview';

// CMS.registerMediaLibrary(uploadcare);
// CMS.registerMediaLibrary(cloudinary);

CMS.registerPreviewTemplate('index', IndexPagePreview);
CMS.registerPreviewTemplate('about', AboutPagePreview);
CMS.registerPreviewTemplate('products', ProductPagePreview);
CMS.registerPreviewTemplate('blog', BlogPostPreview);
```

## Getting Started (Without Netlify)

```
$ gatsby new [SITE_DIRECTORY_NAME] https://github.com/netlify-templates/gatsby-starter-netlify-cms/
$ cd [SITE_DIRECTORY_NAME]
$ npm run build
$ npm run serve
```

### Setting up the CMS

Follow the [Netlify CMS Quick Start Guide](https://www.netlifycms.org/docs/quick-start/#authentication) to set up authentication, and hosting.

## Debugging

Windows users might encounter `node-gyp` errors when trying to npm install.
To resolve, make sure that you have both Python 2.7 and the Visual C++ build environment installed.

```
npm config set python python2.7
npm install --global --production windows-build-tools
```

[Full details here](https://www.npmjs.com/package/node-gyp 'NPM node-gyp page')

## Purgecss

This plugin uses [gatsby-plugin-purgecss](https://www.gatsbyjs.org/packages/gatsby-plugin-purgecss/) and [bulma](https://bulma.io/). The bulma builds are usually ~170K but reduced 90% by purgecss.

# Kudos

This is based on the [Gatsby Netlify CMS Starter](https://github.com/netlify-templates/gatsby-starter-netlify-cms) repo. Major kudos!

Photos in starter from various photographers:
[Aden Ardenrich](https://www.pexels.com/photo/bags-business-commerce-hanging-581344/?utm_content=attributionCopyText&utm_medium=referral&utm_source=pexels)
[Pixabay](https://www.pexels.com/photo/architecture-bar-blur-boutique-264570/?utm_content=attributionCopyText&utm_medium=referral&utm_source=pexels)
[Artem Beliaikin](https://www.pexels.com/photo/multi-colored-hunged-coats-2872879/?utm_content=attributionCopyText&utm_medium=referral&utm_source=pexels)
[Daria Shevtsova](https://www.pexels.com/photo/red-motor-scooter-parking-on-front-of-chez-michele-store-1070981/?utm_content=attributionCopyText&utm_medium=referral&utm_source=pexels)
[Aleksandar Pasaric](https://www.pexels.com/photo/people-walking-on-street-near-buildings-2339009/?utm_content=attributionCopyText&utm_medium=referral&utm_source=pexels)
[Naim Benjelloun](https://www.pexels.com/photo/photo-of-people-walking-in-marketplace-2610817/?utm_content=attributionCopyText&utm_medium=referral&utm_source=pexels)
[Kiara Coll](https://www.pexels.com/photo/close-up-photo-of-assorted-textiles-2928381/?utm_content=attributionCopyText&utm_medium=referral&utm_source=pexels)
[Artem Beliaikin](https://www.pexels.com/photo/white-and-black-floral-cap-sleeved-shirt-994523/?utm_content=attributionCopyText&utm_medium=referral&utm_source=pexels)
[Eric Montanah](https://www.pexels.com/photo/two-assorted-color-padded-chairs-near-side-table-1350789/?utm_content=attributionCopyText&utm_medium=referral&utm_source=pexels)
[Sanketh Rao](https://www.pexels.com/photo/assorted-commemorative-plates-716107/?utm_content=attributionCopyText&utm_medium=referral&utm_source=pexels)
[Artem Beliaikin](https://www.pexels.com/photo/photo-of-beaded-accessories-994515/?utm_content=attributionCopyText&utm_medium=referral&utm_source=pexels)
[Jamie Diaz](https://www.pexels.com/photo/cat-mascot-outdoors-2133243/?utm_content=attributionCopyText&utm_medium=referral&utm_source=pexels)

# CONTRIBUTING

Contributions are always welcome, no matter how large or small.
