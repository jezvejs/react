export const formatDecimalValue = (val: string | number) => val.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');

export const formatAsUSD = (value: string | number) => `$ ${formatDecimalValue(value)}`;
