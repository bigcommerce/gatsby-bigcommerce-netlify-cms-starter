import { navigate } from "gatsby"

export const isBrowser = () => typeof window !== "undefined"
export const getUser = () =>
  isBrowser() && window.localStorage.getItem("bigcommerceCustomer")
    ? JSON.parse(window.localStorage.getItem("bigcommerceCustomer"))
    : {}
const setUser = user =>
  window.localStorage.setItem("bigcommerceCustomer", JSON.stringify(user))
export const handleLogin = ({ username, password }) => {
  fetch(`/.netlify/functions/bigcommerce_customer_login`, {
    "headers": {
      credentials: 'same-origin',
      mode: 'same-origin',
      method: 'POST'
    },
    "body": JSON.stringify({
      email: username,
      pass: password
    }),
    "method": "POST"
  })
  .then(res => res.json())
  .then(response => {
    setUser({
      username: response.data.customer.id,
      name: response.data.customer.firstName,
      email: response.data.customer.email,
      customer: response.data.customer.id
    })

    navigate(`/app/profile`)
    return true
  })
  .catch(error => {
    console.log(error)
    return false
  })
}
export const isLoggedIn = () => {
  const user = getUser()
  return !!user.username
}
export const logout = callback => {
  setUser({})
  callback()
}