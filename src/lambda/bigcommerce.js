const axios = require("axios")
const cookie = require('cookie');
const setCookie = require('set-cookie-parser')

export function handler(event, context, callback) {
  // Get env var values defined in our Netlify site UI
  const { API_STORE_HASH, API_CLIENT_ID, API_TOKEN, API_SECRET, CORS_ORIGIN } = process.env
  // Set up headers
  const REQUEST_HEADERS = {
    'X-Auth-Client': API_CLIENT_ID,
    'X-Auth-Token': API_TOKEN,
    'Accept': 'application/json'
  }
  const CORS_HEADERS = {
    'Access-Control-Allow-Headers': 'Content-Type, Accept',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Origin': CORS_ORIGIN,
    'Access-Control-Allow-Methods': 'GET, PUT, POST',
  }
  // Get endpoint value from query string
  const ENDPOINT_QUERY_STRING = event.queryStringParameters.endpoint

  // Parse out cookies and change endpoint to include cartId for certain cart requests
  var cookies = setCookie.parse(event.headers.cookie, {
    decodeValues: true,  // default: true
    map: true // default: false
  })

  // Assemble BC API URL we are going to hit
  let URL = `https://api.bigcommerce.com/stores/${API_STORE_HASH}/v3/`
  if (ENDPOINT_QUERY_STRING === 'carts/items') {
    URL = `${URL}carts/${cookies.cartId.value}/items?include=redirect_urls`
  } else if (ENDPOINT_QUERY_STRING === 'carts') {
    URL = `${URL}carts/${cookies.cartId.value}?include=redirect_urls`
  } else {
    URL += ENDPOINT_QUERY_STRING;
  }

  // Let's log some stuff we already have
  console.log("logging event.....", event)
  console.log("Constructed URL is ...", URL)

  // Here's a function we'll use to define how our response will look like when we call callback
  const pass = (body, cookieHeader) => {
    console.log(body)
    callback( null, {
      statusCode: 200,
      body: JSON.stringify(body),
      headers: {...CORS_HEADERS, ...cookieHeader }
    }
  )}

  // Process GET
  const get = () => {
    axios.get(URL, { headers: REQUEST_HEADERS })
    .then((response) =>
      {
        pass(response.data, null)
      }
    )
    .catch(err => pass(err))
  }
  if(event.httpMethod == 'GET'){
    get()
  };

  // Process POST
  const post = (body) => {
    axios.post(URL, body, { headers: REQUEST_HEADERS })
    .then((response) =>
      {
        let cookieHeader = null;
        if (event.queryStringParameters.endpoint == 'carts' && response.data.data.id) {
          cookieHeader = {
            'Set-Cookie': cookie.serialize('cartId', response.data.data.id, {
              maxAge: 60 * 60 * 24 * 28 // 4 weeks
            })
          }
        }

        pass(response.data, cookieHeader)
      }
    )
    .catch(err => pass(err))
  }
  if(event.httpMethod == 'POST'){
    post(JSON.parse(event.body))
  };

  // Process PUT
  const put = (body) => {
    axios.put(URL, body, { headers: REQUEST_HEADERS })
    .then((response) =>
      {
        pass(response.data)
      }
    )
    .catch(err => pass(err))
  }
  if(event.httpMethod == 'POST'){
    put(JSON.parse(event.body))
  };
};
