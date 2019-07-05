const axios = require("axios")
const qs = require("qs")

export function handler(event, context, callback) {
  // apply our function to the queryStringParameters and assign it to a variable
  const API_PARAMS = qs.stringify(event.queryStringParameters)
  // Get env var values defined in our Netlify site UI
  const { API_STORE_HASH, API_CLIENT_ID, API_TOKEN, API_SECRET } = process.env
  // In this example, the API Key needs to be passed in the params with a key of key.
  // We're assuming that the ApiParams var will contain the initial ?
  const URL = `https://api.bigcommerce.com/stores/${API_STORE_HASH}/v3/channels`
  const HEADERS = {
    'X-Auth-Client': API_CLIENT_ID,
    'X-Auth-Token': API_TOKEN,
    'Accept': 'application/json'
  }

  // Let's log some stuff we already have.
  console.log("logging event.....", event)
  console.log("Constructed URL is ...", URL)


// axios.post(URL, PARAM, { headers })
// .catch((error) => {
// console.log('error ' + error);
// });



   // Here's a function we'll use to define how our response will look like when we call callback
  const pass = (body) => {callback( null, {
    statusCode: 200,
    body: JSON.stringify(body)
  })}

  // Perform the API call.
  const get = () => {
    axios.get(URL, { headers: HEADERS })
    .then((response) =>
      {
        console.log(response.data)
        pass(response.data)
      }
    )
    .catch(err => pass(err))
  }
  if(event.httpMethod == 'GET'){
    get()
  };
};