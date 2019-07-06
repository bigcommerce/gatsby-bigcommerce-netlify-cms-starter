// Require the serverless API framework and instantiate it
const api = require('lambda-api')()

// Require axios HTTP helper library and instantiate it
const axios = require("axios")

// Get environment variables
const { API_STORE_HASH, API_CLIENT_ID, API_TOKEN, API_SECRET, CORS_ORIGIN } = process.env

// Configure BigCommerce API headers
const HEADERS = {
  'X-Auth-Client': API_CLIENT_ID,
  'X-Auth-Token': API_TOKEN,
  'Accept': 'application/json'
}

// Set CORS headers
api.options('/*', (req,res) => {
  res.header('Access-Control-Allow-Origin', CORS_ORIGIN);
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.status(200).send({});
})
 
// -----------
// API Routes
// -----------
api.get('/status', async (req,res) => {
  return { status: 'ok' }
})

// Define a route
api.get('/channels', async (req,res) => {
  // const URL = `https://api.bigcommerce.com/stores/${API_STORE_HASH}/v3/${API_PARAMS.endpoint}`
  console.log("- Req -", req)
  console.log("- Res -", res)
  return { channel: 'ok', data: res };
})
 
// Declare your Lambda handler
exports.handler = async (event, context) => {
  // Log the request
  console.log("---------- Event ----------", event)

  // Run the request
  return await api.run(event, context)
}
