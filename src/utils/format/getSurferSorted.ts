import { Surfer } from "../interfaces";

export const surfersOrderBy = (surferQuery?: Surfer[]) => {
  if(!surferQuery) return undefined
  return surferQuery?.sort((a: { tourResults: string | any[]; eventResults: string | any[] }, b: { tourResults: string | any[]; eventResults: string | any[] }) => {
    if (a.tourResults.length > b.tourResults.length) return -1
    if (a.tourResults.length < b.tourResults.length) return 1
    if (a.tourResults.length === b.tourResults.length) {
      if (a.eventResults.length > b.eventResults.length) return -1
      if (a.eventResults.length < b.eventResults.length) return 1
    }
    return 0
  })
}
