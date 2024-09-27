export function convertDate(date: Date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`
}

export const NBP_URL_TABLES = 'https://api.nbp.pl/api/exchangerates/tables/A/'
export const NBP_URL_RATES = 'https://api.nbp.pl/api/exchangerates/rates/A/'