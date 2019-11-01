const CurrencyFormatter = ({ currency, amount }) => {
  const languageCode =
    typeof window !== 'undefined'
      ? window.navigator.language || 'en-US'
      : 'en-US';
  const formattedPrice = new Intl.NumberFormat(languageCode, {
    style: 'currency',
    currency
  }).format(amount);
  return amount && formattedPrice;
};

export default CurrencyFormatter;
