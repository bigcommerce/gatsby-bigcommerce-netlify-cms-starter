require('dotenv').config()
const axios = require("axios")
const cookie = require('cookie')
const setCookie = require('set-cookie-parser')

export function handler(event, context, callback) {
  console.log(" ")
  console.log(" ")
  console.log(" ")
  console.log("-----------------------")
  console.log("----- New Request -----")
  console.log("-----------------------")
  // console.log("Event: ", event)

  // Get env var values we need to speak to the BC API
  const API_STORE_HASH = process.env.API_STORE_HASH
  const API_CLIENT_ID = process.env.API_CLIENT_ID
  const API_TOKEN = process.env.API_TOKEN
  const API_SECRET = process.env.API_SECRET
  const CORS_ORIGIN = process.env.CORS_ORIGIN
  // Set up headers
  const REQUEST_HEADERS = {
    'X-Auth-Client': API_CLIENT_ID,
    'X-Auth-Token': API_TOKEN,
    'X-Client-Type': 'Gatsby',
    'X-Client-Name': 'gatsby-bigcommerce-netlify-cms-starter',
    'X-Plugin-Version': '1.0.0',
    'Accept': 'application/json',
  }
  const CORS_HEADERS = {
    'Access-Control-Allow-Headers': 'Content-Type, Accept',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Origin': CORS_ORIGIN,
    'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE, OPTIONS',
  }
  // Get endpoint value from query string
  const ENDPOINT_QUERY_STRING = event.queryStringParameters.endpoint

  // Parse out cookies and change endpoint to include cartId for certain cart requests
  const cookies = setCookie.parse(event.headers.cookie, {
    decodeValues: true,  // default: true
    map: true // default: false
  })
  const hasCartIdCookie = (cookies.hasOwnProperty('cartId'))
  console.log(`- hasCartIdCookie? ${hasCartIdCookie.toString()} -`)

  // Assemble BC API URL we are going to hit
  let ROOT_URL = `https://api.bigcommerce.com/stores/${API_STORE_HASH}/v3/`
  let URL = ''

  if (ENDPOINT_QUERY_STRING == 'carts/items') {
    if (hasCartIdCookie) {
      if (typeof event.queryStringParameters.itemId != 'undefined') {
        URL = `${ROOT_URL}carts/${cookies.cartId.value}/items/${event.queryStringParameters.itemId}?include=redirect_urls`
      } else {
        URL = `${ROOT_URL}carts/${cookies.cartId.value}/items?include=redirect_urls`
      }
    } else {
      // If there is no cartId cookie when adding cart items, resort to creating the cart
      URL = `${ROOT_URL}carts?include=redirect_urls`
    }
  } else if (ENDPOINT_QUERY_STRING == 'carts') {
    if (hasCartIdCookie) {
      URL = `${ROOT_URL}carts/${cookies.cartId.value}?include=redirect_urls`
    } else {
      URL = `${ROOT_URL}carts?include=redirect_urls`
    }
  } else {
    URL = ROOT_URL + ENDPOINT_QUERY_STRING;
  }
  console.log("Constructed URL: ", URL)

  // Function to determine return cookie header that should be returned with response
  const setCookieHeader = (responseType, response) => {
    let cookieHeader = null;

    console.log('(in setCookieHeader function) responseType: ', responseType)
    console.log('(in setCookieHeader function) ENDPOINT_QUERY_STRING: ', ENDPOINT_QUERY_STRING)
    // console.log('(in setCookieHeader function) response: ', response)

    const statusCode = response.status
    const body = response.data

    if (ENDPOINT_QUERY_STRING == 'carts' && statusCode == 404) {
      cookieHeader = {
        'Set-Cookie': cookie.serialize('cartId', '', {
          maxAge: -1
        })
      }
      console.log("- Expiring cardId cookieHeader: -")
      console.log(cookieHeader)
    } else if (responseType == 'response') {
        if (!hasCartIdCookie && body.data.id) {
          cookieHeader = {
            'Set-Cookie': cookie.serialize('cartId', body.data.id, {
              maxAge: 60 * 60 * 24 * 28 // 4 weeks
            })
          }
          console.log("- Assigning cookieHeader: -")
          console.log(cookieHeader)
        }
    }

    return cookieHeader;
  }

  // Here's a function we'll use to define how our response will look like when we callback
  const pass = (response, cookieHeader) => {
    const statusCode = response.status
    const body = response.data
    const headers = {...CORS_HEADERS, ...cookieHeader }

    callback( null, {
      statusCode: statusCode,
      body: JSON.stringify(body),
      headers: headers
    }
  )}

  // Process POST
  const post = (body) => {
    axios.post(URL, body, { headers: REQUEST_HEADERS })
    .then((response) =>
      {
        const cookieHeader = setCookieHeader('response', response);

        pass(response, cookieHeader)
      }
    )
    .catch(err => pass(err.response))
  }
  if(event.httpMethod == 'POST'){
    console.log("--------")
    console.log("- POST -")
    console.log("--------")
    post(JSON.parse(event.body))
  };

  // Process GET
  const get = () => {
    axios.get(URL, { headers: REQUEST_HEADERS })
    .then((response) =>
      {
        const cookieHeader = setCookieHeader('response', response)

        pass(response, cookieHeader)
      }
    )
    .catch(err => {
        const cookieHeader = setCookieHeader('error', err.response)

        pass(err.response, cookieHeader)
    })
  }
  if(event.httpMethod == 'GET'){
    console.log("-------")
    console.log("- GET -")
    console.log("-------")
    get()
  };

  // Process PUT
  const put = (body) => {
    axios.put(URL, body, { headers: REQUEST_HEADERS })
    .then((response) =>
      {
        pass(response)
      }
    )
    .catch(err => pass(err.response))
  }
  if(event.httpMethod == 'PUT'){
    console.log("-------")
    console.log("- PUT -")
    console.log("-------")
    put(JSON.parse(event.body))
  };

  // Process DELETE
  const del = () => {
    axios.delete(URL, { headers: REQUEST_HEADERS })
    .then((response) =>
      {
        pass(response)
      }
    )
    .catch(err => pass(err.response))
  }
  if(event.httpMethod == 'DELETE'){
    console.log("----------")
    console.log("- DELETE -")
    console.log("----------")
    del()
  };
};
