require('dotenv').config()
const axios = require('axios')
const jwt = require('jsonwebtoken')
const {v4: uuidv4} = require('uuid')

// only log in development mode
const devModeLog = str => process.env !== 'production' && console.log(str)

export function handler(event, context, callback) {
  devModeLog(' ')
  devModeLog(' ')
  devModeLog(' ')
  devModeLog('-----------------------')
  devModeLog('----- New Request -----')
  devModeLog('-----------------------')

  // Get env var values we need to speak to the BC API
  const API_STORE_HASH = process.env.API_STORE_HASH
  const API_CLIENT_ID = process.env.API_CLIENT_ID
  const API_TOKEN = process.env.API_TOKEN
  const API_SECRET = process.env.API_SECRET
  const CORS_ORIGIN = process.env.CORS_ORIGIN
  const JWT_SECRET = process.env.JWT_SECRET
  const STOREFRONT_API_TOKEN = process.env.STOREFRONT_API_TOKEN
  // Set up headers
  const REQUEST_HEADERS = {
    'X-Auth-Client': API_CLIENT_ID,
    'X-Auth-Token': API_TOKEN,
    'X-Client-Type': 'Gatsby',
    'X-Client-Name': 'gatsby-bigcommerce-netlify-cms-starter',
    'X-Plugin-Version': '1.5.0',
    Accept: 'application/json'
  }
  const CORS_HEADERS = {
    'Access-Control-Allow-Headers': 'Content-Type, Accept',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Origin': CORS_ORIGIN,
    'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE, OPTIONS'
  }
  const STOREFRONTAPI_HEADERS = {
   'Content-Type': 'application/json',
   'Authorization': `Bearer ${STOREFRONT_API_TOKEN}`
  }
  const STOREFRONTAPI_ENDPOINT = 'https://channel-override-test-store.mybigcommerce.com/graphql'
  // Get endpoint value from query string
  const ENDPOINT_QUERY_STRING = event.queryStringParameters.endpoint
  const ENDPOINT_VERSION_NUMBER = event.queryStringParameters.api_version || 'v3'

  // Here's a function we'll use to define how our response will look like when we callback
  const pass = (response) =>
    callback(null, {
      statusCode: response.status,
      body: JSON.stringify(response.data),
      headers: { ...CORS_HEADERS }
    })

  // Process GET
  const get = requestBody => {
    try {
      const loggedInCustomerData = jwt.verify(event.queryStringParameters.customer, JWT_SECRET);
      const storeUrl = `https://store-${API_STORE_HASH}.mybigcommerce.com`;

      const dateCreated = Math. round((new Date()). getTime() / 1000);
      const  payload = {
          "iss": API_CLIENT_ID,
          "iat": dateCreated,
          "jti": uuidv4(),
          "operation": "customer_login",
          "store_hash": API_STORE_HASH,
          "customer_id": loggedInCustomerData.id,
          "redirect_to": event.queryStringParameters.redirect,
      }
      let token = jwt.sign(payload, API_SECRET, {algorithm:'HS256'});
      const loginUrl = `${storeUrl}/login/token/${token}`;

      const response = {
        status: 200,
        data: {
          url: loginUrl
        }
      }

      pass(response)
    } catch(err) {
      const response = {
        status: 500,
        data: {
          error: err
        }
      }

      pass(response)
    }
  }
  if (event.httpMethod === 'GET') {
    devModeLog('--------')
    devModeLog('- GET -')
    devModeLog('--------')
    get()
  }

  // Process POST
  const post = requestBody => {
    if (requestBody.email && requestBody.pass) {
      const query = `
      mutation Login($email: String!, $pass: String!) {
        login(email: $email, password: $pass) {
          result
        }
      }`
      const variables = {
        email: requestBody.email,
        pass: requestBody.pass
      }

      axios
        .post(STOREFRONTAPI_ENDPOINT, { query, variables }, { headers: STOREFRONTAPI_HEADERS })
        .then(function(response) {
          if (response.data.error) {
            // Could not validate email and password, so send unauthorized status back
            devModeLog('password not correct');
            pass({
              status: 401,
              data: ''
            })
          } else {
            const headersWithCookie = Object.assign({}, STOREFRONTAPI_HEADERS, { Cookie: response.headers['set-cookie'][0] })
            const query = `
            query {
              customer {
                firstName
                lastName
                email
                id: entityId
                groupId: customerGroupId
              }
            }`

            axios
              .post(STOREFRONTAPI_ENDPOINT, { query }, { headers: headersWithCookie })
              .then(response => {
                devModeLog('after graphql customer query')
                devModeLog(response.status)
                devModeLog(response.data.data)
                if (response.status !== 200 || (response.data.data && response.data.data.customer === null)) {
                  // Response failed or customer data object is null, so send unauthorized status back
                  devModeLog('customer lookup failed');
                  pass({
                    status: response.status,
                    data: ''
                  })
                } else {
                  devModeLog('customer lookup succeeded');
                  response.data.data.customer.id = jwt.sign({
                    id: response.data.data.customer.id,
                    groupId: response.data.data.customer.groupId
                  }, JWT_SECRET);

                  pass(response)
                }
              }).catch(err => {
                devModeLog('inner catch')
                const errorResponse = {
                  status: 400,
                  data: {
                    error: err.toString()
                  }
                }

                pass(errorResponse)
              })
          }
      }).catch(err => {
        devModeLog('outer catch')
        devModeLog(err.response.data)
        const errorResponse = {
          status: 400,
          data: {
            error: err.toString()
          }
        }

        pass(errorResponse)
      })
    } else {
      const response = {
        status: 400,
        data: {
          error: "email and pass fields not passed"
        }
      }

      devModeLog('email and pass fields not passed')
      pass(response)
    }
  }
  if (event.httpMethod === 'POST') {
    devModeLog('--------')
    devModeLog('- POST -')
    devModeLog('--------')
    post(JSON.parse(event.body))
  }
}
