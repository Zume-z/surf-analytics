import React from 'react'
import { api } from '@/utils/api'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import CardSurfer from '@/components/CardSurfer'
import Table, { TableData } from '@/components/Table'
import { TourResult, TourWorldTitle } from '@/utils/interfaces'
import CardSurferLoader from '@/components/loaders/CardSurferLoader'
import { windowSize } from '@/utils/windowSize'
import { BREAKPOINT } from '@/utils/constants'
import CardSurferSmall from '@/components/CardSurferSmall'

export default function Surfers() {
  const router = useRouter()
  const tourResultQuery = api.tourResult.getMany.useQuery({ worldTitle: true, sortYear: 'desc' })
  const onSelectSurfer = (surferSlug: string, year: number) => year >= 2010 ? router.push({ pathname: '/surfers/[surferId]/events', query: { surferId: surferSlug, year: year } }) : router.push({ pathname: '/surfers/[surferId]/career', query: { surferId: surferSlug, } }) // prettier-ignore

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
    { name: `Year`, id: 'year', content: (item: TourWorldTitle) => <div className="lg:text-base">{item.year}</div> },
    { name: 'Mens CT.', id: 'mens', content: (item: TourWorldTitle) => <div onClick={() => onSelectSurfer(item.mensTourResult.surfer.slug, item.year)}><CardSurfer surfer={item.mensTourResult.surfer} highlightSelect={true} adaptive={true}/></div>, loader: <CardSurferLoader /> }, // prettier-ignore
    { name: 'Womens CT.', id: 'womens', content: (item: TourWorldTitle) => <div>{item.womensTourResult && <div onClick={() => onSelectSurfer(item.womensTourResult.surfer.slug, item.year)}> <CardSurfer surfer={item.womensTourResult.surfer} highlightSelect={true} adaptive={true} /> </div>}</div>, loader: <CardSurferLoader /> }, // prettier-ignore
  ]
  // if (windowSize().width! < BREAKPOINT.sm) tableData.pop(), tableData.pop()

  // if (windowSize().width! < BREAKPOINT.sm)
  //   tableData.push({
  //     name: 'Championship Tour',
  //     id: 'ct',
  //     content: (item: TourWorldTitle) => (
  //       <div className="space-y-2">
  //         <CardSurferSmall surfer={item.mensTourResult.surfer} highlightSelect={true} />
  //         {item.womensTourResult && <CardSurferSmall surfer={item.womensTourResult.surfer} highlightSelect={true} />}{' '}
  //       </div>
  //     ),
  //   })

  return (
    <Layout title={'World Titles'}>
      <h1 className="py-8 text-center text-3xl font-semibold">World Titles</h1>
      <Table tableData={tableData} items={tourQueryRefactored || []} loading={tourResultQuery.isLoading} />
    </Layout>
  )
}
