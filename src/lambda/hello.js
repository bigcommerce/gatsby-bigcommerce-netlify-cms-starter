const axios = require("axios")
const qs = require("qs")
const cookie = require('cookie');
const setCookie = require('set-cookie-parser')

export function handler(event, context, callback) {
  // apply our function to the queryStringParameters and assign it to a variable
  const API_PARAMS = qs.stringify(event.queryStringParameters)
  // Get env var values defined in our Netlify site UI
  const { API_STORE_HASH, API_CLIENT_ID, API_TOKEN, API_SECRET, CORS_ORIGIN } = process.env
  // In this example, the API Key needs to be passed in the params with a key of key.
  // We're assuming that the ApiParams var will contain the initial ?
  const URL = `https://api.bigcommerce.com/stores/${API_STORE_HASH}/v3/${event.queryStringParameters.endpoint}`
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

  // Let's log some stuff we already have.
  console.log("logging event.....", event)
  console.log("Constructed URL is ...", URL)


// axios.post(URL, PARAM, { headers })
// .catch((error) => {
// console.log('error ' + error);
// });



   // Here's a function we'll use to define how our response will look like when we call callback
  const pass = (body, cookieHeader) => {callback( null, {
    statusCode: 200,
    body: JSON.stringify(body),
    headers: {...CORS_HEADERS, ...cookieHeader }
  })}

  // Process GET
  const get = () => {
    axios.get(URL, { headers: REQUEST_HEADERS })
    .then((response) =>
      {
        console.log(response.data)

        var cookies = setCookie.parse(event.headers.cookie, {
          decodeValues: true,  // default: true
          map: true // default: false
        });
       
        cookies.forEach(console.log);

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
        console.log(response.data)

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
};

// def httpfunction(request):
//     # OPTIONS route
//     if request.method == 'OPTIONS':
//         return cors_route()
    
//     # GET route
//     if request.method == 'GET':
//         cart_id = request.cookies.get('bc_cart_id')
//         if cart_id:
//             return cors_route(get_cart(cart_id))
//         else:
//             return cors_route(jsonify("Not Found"), 404)
    
//     # Since this isn't GET or OPTIONS, look for a body
//     request_json = request.get_json()
    
//     # POST handler for new cart
//     if (request.method == 'POST') and ('action' in request_json):
//         if request_json['action'] == 'create' and ('cart' in request_json):
//         	return cors_route(create_cart(request_json['cart']))
//     return cors_route(jsonify(request_json))

// def create_cart(new_cart_data):
//     print('attempting to create cart')
//     cart = v3client.post('/carts', new_cart_data)['data']
//     resp = make_response(jsonify(cart))
//     resp.set_cookie('bc_cart_id', cart['id'])
//     return resp

// def get_cart(cart_id):
//     print('Getting cart by ID...')
//     cart_response = v3client.get('/carts', cart_id)
//     print(cart_response)
//     if ['data'] in cart_response:
//         cart = cart_response['data']
//         resp = make_response(jsonify(cart))
//         return resp
//     else:
//         return jsonify("Not Found"), 404
    
// def cors_route(resp=None):
//     if not resp:
//     	resp = make_response('ok')
//     resp.headers.set('Access-Control-Allow-Headers', 'Content-Type, Accept')
//     resp.headers.set('Access-Control-Allow-Credentials', 'true')
//     resp.headers.set('Access-Control-Allow-Origin', cors_origin)
//     resp.headers.set('Access-Control-Allow-Methods', 'GET, PUT, POST')
//     return resp