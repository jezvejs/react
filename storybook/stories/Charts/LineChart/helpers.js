export const formatDecimalValue = (val) => val.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');

export const formatAsUSD = (value) => `$ ${formatDecimalValue(value)}`;
