import { getMoneyFormat } from './moneyFormat'
import { ordinalSuffix } from './ordinalSuffix'
import { getPerc } from './percFormat'
import { twoDec } from './roundTwoDec'

export const queryRound = (query: number | string | undefined | null) => (query != undefined ? twoDec(query) : '-')
export const queryMoney = (query: number | string | undefined | null) => (query != undefined ? getMoneyFormat(query) : '-')
export const queryFormat = (query: number | string | undefined | null) => (query != undefined ? query.toLocaleString('en-US') : '-')
export const querySuffix = (query: number | string | undefined | null) => (query != undefined ? ordinalSuffix(Math.round(Number(query))) : '-')
export const queryDifferential = (query: number | string | undefined | null) => (query != undefined ? (query > 0 ? '+' + twoDec(query) : twoDec(query)) : '-')

export const queryDivide = (valueA: number | string | undefined, valueB: number | string | undefined) => {
  if (valueA === '0' || valueA === 0) return '-'
  if (valueA !== undefined && valueB !== undefined) {
    valueA = valueA.toString().replaceAll(',', '')
    valueB = valueB.toString().replaceAll(',', '')
    const div = Number(valueA) / Number(valueB)
    return twoDec(div)
  }
  return '-'
}

export const queryDivideRound = (valueA: number | string | undefined, valueB: number | string | undefined) => {
  if (valueA === '0' || valueA === 0) return '-'
  if (valueA !== undefined && valueB !== undefined) {
    valueA = valueA.toString().replaceAll(',', '')
    valueB = valueB.toString().replaceAll(',', '')
    const perc = Number(valueA) / Number(valueB)
    return Math.round(perc)
  }
  return '-'
}

export const queryDivideTime = (valueA: number | string | undefined, valueB: number | string | undefined) => {
  if (valueA === '0' || valueA === 0) return '-'
  if (valueA !== undefined && valueB !== undefined) {
    valueA = valueA.toString().replaceAll(',', '')
    valueB = valueB.toString().replaceAll(',', '')
    const minutesDec = Number(valueA) / Number(valueB)
    const minutes = Math.floor(minutesDec)
    const seconds = Math.round((minutesDec - minutes) * 60)
    return `${minutes}m ${seconds}s`
  }
  return '-'
}

export const queryPerc = (valueA: number | string | undefined, valueB: number | string | undefined) => {
  if (valueA === '0' || valueA === 0) return '-'
  if (valueA !== undefined && valueB !== undefined) {
    valueA = valueA.toString().replaceAll(',', '')
    valueB = valueB.toString().replaceAll(',', '')
    const perc = Number(valueA) / Number(valueB)
    return getPerc(perc)
  }
  return '-'
}
