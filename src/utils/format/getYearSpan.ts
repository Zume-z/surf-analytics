import { Event } from '../interfaces'

export const surferYearSpan = (tourResults: any) => {
  if (tourResults === undefined) return
  const tourYears = tourResults.map((item: any) => item.tour.year)
  if (tourYears?.length === 1) return tourYears?.[0].toString()
  else {
    const firstYear = tourYears?.[tourYears.length - 1]
    const lastYear = tourYears?.[0]
    return `${firstYear}-${lastYear}`
  }
}

export const countrySurferYearSpan = (tourResults: any) => {
  if (tourResults === undefined) return
  const tourYears = tourResults.map((item: any) => item.tour.year)
  const uniqueYears = [...new Set(tourYears)]
  if (uniqueYears?.length === 1) return tourYears?.[0].toString()
  else {
    const firstYear = tourYears?.[0]
    if (firstYear < 2010) {
      return `2010-${tourYears?.[tourYears.length - 1]}`
    }
    const lastYear = tourYears?.[tourYears.length - 1]
    return `${firstYear}-${lastYear}`
  }
}

export const eventYearSpan = (events: any) => {
  if (events === undefined) return
  const eventYears = events.map((item: Event) => item.tour.year)
  const uniqueYears = [...new Set(eventYears)]
  if (uniqueYears?.length === 1) return eventYears?.[0].toString()
  else {
    const firstYear = eventYears?.[eventYears.length - 1]
    const lastYear = eventYears?.[0]
    return `${firstYear}-${lastYear}`
  }
}

export const surferYearsArr = (tourResults: any) => {
  if (tourResults === undefined) return
  return tourResults.map((item: any) => item.tour.year)
}
