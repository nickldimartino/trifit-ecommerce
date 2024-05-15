// -------------------------------- Formatters ---------------------------------
// formats the currency to USD
const CURRENCY_FORMATTER = new Intl.NumberFormat("en-US", {
  currency: "USD",
  style: "currency",
  minimumFractionDigits: 0,
});

// formats the received number
export function formatCurrency(amount: number) {
  return CURRENCY_FORMATTER.format(amount);
}

// formats the number
const NUMBER_FORMATTER = new Intl.NumberFormat("en-US");

// formats the received number
export function formatNumber(number: number) {
  return NUMBER_FORMATTER.format(number);
}
