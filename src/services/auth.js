
export const isBrowser = () => typeof window !== "undefined"

export const getUser = () =>
  isBrowser() && window.localStorage.getItem("bigcommerceCustomer")
    ? JSON.parse(window.localStorage.getItem("bigcommerceCustomer"))
    : {}

const setUser = user =>
  window.localStorage.setItem("bigcommerceCustomer", JSON.stringify(user))

export const handleLogin = async ({ username, password }) => {
  let didLoginSucceed = false

  await fetch(`/.netlify/functions/bigcommerce_customer_login`, {
    headers: {
      credentials: 'same-origin',
      mode: 'same-origin',
      method: 'POST'
    },
    body: JSON.stringify({
      email: username,
      pass: password
    }),
    method: 'POST'
  })
  .then(async res => await res.json())
  .then(response => {
    console.log('response')
    console.log(response)
    if (!response.error) {
      setUser({
        name: response.data.customer.firstName,
        email: response.data.customer.email,
        secureData: response.data.customer.secureData
      })

      didLoginSucceed = true
    }
  })
  .catch(error => {
    console.log('error')
    console.log(error)
  })

  return didLoginSucceed
}

export const isLoggedIn = () => {
  const user = getUser()
  return !!user.email
}

export const logout = callback => {
  setUser({})
  callback()
}