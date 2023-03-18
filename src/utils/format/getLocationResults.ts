import { Location } from '../interfaces'

export const bestResultByLocation = (item: Location) => {
  const bestResult = item.events.map((event: any) => event.eventResults[0]?.place).sort((a: number, b: number) => a - b)[0]
  const yearofBestResult = item.events.filter((event: any) => event.eventResults[0]?.place === bestResult)[0]?.tour.year
  const eventName = item.events.filter((event: any) => event.eventResults[0]?.place === bestResult)[0]?.name
  return { bestResult: bestResult, year: yearofBestResult, eventName: eventName }
}

export const getApperances = (item: Location) => {
  return item.events.map((event: any) => event.eventResults[0]?.place).filter((place: number) => place > 0).length
}
