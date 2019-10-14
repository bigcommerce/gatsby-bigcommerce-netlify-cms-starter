
const CurrencyFormatter = props => {
  const currency = props.currency;
  const amount = props.amount;
  const languageCode =
    typeof window !== 'undefined'
      ? window.navigator.language || 'en-US'
      : 'en-US';
  const formattedPrice = new Intl.NumberFormat(languageCode, {
    style: 'currency',
    currency
  }).format(amount);
  return formattedPrice;
};

export default CurrencyFormatter;
