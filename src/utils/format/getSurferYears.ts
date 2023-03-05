export const surferYears = (tourResults: any) => {
  if (tourResults === undefined) return
  const tourYears = tourResults.map((item: any) => item.tour.year)
  if (tourYears?.length === 1) return tourYears?.[0].toString()
  else {
    const firstYear = tourYears?.[tourYears.length - 1]
    const lastYear = tourYears?.[0]
    return `${firstYear}-${lastYear}`
  }
}

export const surferYearsArr = (tourResults: any) => {
  if (tourResults === undefined) return
  return tourResults.map((item: any) => item.tour.year)
}
