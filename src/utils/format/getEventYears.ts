import { Event } from "../interfaces";

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

