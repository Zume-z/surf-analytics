import React from 'react'
import { api } from '@/utils/api'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import CardSurfer from '@/components/CardSurfer'
import Table, { TableData } from '@/components/Table'
import { TourResult, TourWorldTitle } from '@/utils/interfaces'
import CardSurferLoader from '@/components/loaders/CardSurferLoader'

export default function Surfers() {
  const router = useRouter()
  const tourResultQuery = api.tourResult.getMany.useQuery({ worldTitle: true, sortYear: 'desc' })
  const onSelectSurfer = (surferSlug: string, year: number) => year >= 2010 ? router.push({ pathname: '/surfers/[surferId]/events', query: { surferId: surferSlug, year: year } }) : router.push({ pathname: '/surfers/[surferId]/career', query: { surferId: surferSlug, } }) // prettier-ignore

  // EXPORT
  const tourQueryRefactored = tourResultQuery.data?.reduce((acc, tourResult: any) => {
    const year = tourResult.tour.year
    const gender = tourResult.tour.gender
    const tourResultYear = acc.find((tourResult) => tourResult.year === year)
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

  const tableData: TableData[] = [
    {
      name: `Year`,
      id: 'year',
      content: (item: TourWorldTitle) => (
        <div>
          <div className="lg:text-base">{item.year}</div>
          {item.year >= 2015 && (
            <div>
              <div className="hidden text-xs text-gray-500 sm:block">WSL CHAMPIONSHIP TOUR</div>
              <div className="block text-xs text-gray-500 sm:hidden">WSL</div>
            </div>
          )}
          {item.year <= 2014 && item.year >= 1983 && (
            <div>
              <div className="hidden text-xs text-gray-500 sm:block">ASP WORLD TOUR</div>
              <div className="block text-xs text-gray-500 sm:hidden">ASP</div>
            </div>
          )}
          {item.year <= 1982 && (
            <div>
              <div className="hidden text-xs text-gray-500 sm:block">IPS WOLRD CIRCUIT</div>
              <div className="block text-xs text-gray-500 sm:hidden">IPS</div>
            </div>
          )}
        </div>
      ),
    },
    { name: 'Mens CT.', id: 'mens', content: (item: TourWorldTitle) => <div onClick={() => onSelectSurfer(item.mensTourResult.surfer.slug, item.year)}><CardSurfer surfer={item.mensTourResult.surfer} highlightSelect={true} adaptive={true}/></div>, loader: <CardSurferLoader /> }, // prettier-ignore
    { name: 'Womens CT.', id: 'womens', content: (item: TourWorldTitle) => <div>{item.womensTourResult && <div onClick={() => onSelectSurfer(item.womensTourResult.surfer.slug, item.year)}> <CardSurfer surfer={item.womensTourResult.surfer} highlightSelect={true} adaptive={true} /> </div>}</div>, loader: <CardSurferLoader /> }, // prettier-ignore
  ]

  return (
    <Layout title={'World Titles'}>
      <h1 className="header-1">World Titles</h1>
      <Table className='mt-2 sm:mt-4' tableData={tableData} items={tourQueryRefactored || []} loading={tourResultQuery.isLoading} />
    </Layout>
  )
}
