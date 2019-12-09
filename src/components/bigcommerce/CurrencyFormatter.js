import React from 'react'

const CurrencyFormatter = ({ currency, amount }) => {
  if (!amount) {
    return <span dangerouslySetInnerHTML={{ __html: "&nbsp;" }} />
  }
  const languageCode =
    typeof window !== 'undefined'
      ? window.navigator.language || 'en-US'
      : 'en-US'
  const formattedPrice = new Intl.NumberFormat(languageCode, {
    style: 'currency',
    currency
  }).format(amount)
  return amount && formattedPrice
}

export default CurrencyFormatter
