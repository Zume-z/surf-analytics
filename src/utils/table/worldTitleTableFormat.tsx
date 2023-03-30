import { TourResult } from '@/utils/interfaces'

export const getWorldTitleFormat = (tourResultQuery: any) => {
  const worldTitleFormat = tourResultQuery.data?.reduce((acc: { year: any; mensTourResult: any; womensTourResult: any }[], tourResult: any) => {
    const year = tourResult.tour.year
    const gender = tourResult.tour.gender
    const tourResultYear = acc.find((tourResult: { year: any }) => tourResult.year === year)
    if (tourResultYear) {
      if (gender === 'MALE') {
        tourResultYear.mensTourResult = tourResult
      }
      if (gender === 'FEMALE') {
        tourResultYear.womensTourResult = tourResult
      }
    } else {
      acc.push({ year, mensTourResult: tourResult.tour.gender === 'MALE' ? tourResult : undefined, womensTourResult: tourResult.tour.gender === 'FEMALE' ? tourResult : undefined })
    }
    return acc
  }, [] as { year: number; mensTourResult: TourResult; womensTourResult: TourResult }[])
  return worldTitleFormat
}
