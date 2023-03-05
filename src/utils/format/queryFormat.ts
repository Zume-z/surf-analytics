import { getMoneyFormat } from './moneyFormat'
import { ordinalSuffix } from './ordinalSuffix'
import { getPerc } from './percFormat'
import { twoDec } from './roundTwoDec'

export const queryRound = (query: number | string | undefined) => (query !== undefined ? twoDec(query) : '-')
export const queryMoney = (query: number | string | undefined) => (query !== undefined ? getMoneyFormat(query) : '-')
export const queryFormat = (query: number | string | undefined) => (query !== undefined ? query.toLocaleString('en-US') : '-')
export const querySuffix = (query: number | string | undefined) => (query !== undefined ? ordinalSuffix(Math.round(Number(query))) : '-')
// export const queryPerc = (query: number | string | undefined) => (query !== undefined ? getPerc(query) : '-')

export const queryPerc = (valueA: number | string | undefined, valueB: number | string | undefined) => {
  if (valueA === '0' || valueA === 0) return '-'
  if (valueA !== undefined && valueB !== undefined) {
    const perc = Number(valueA) / Number(valueB)
    return getPerc(perc)
  }
  return '-'
}
