import React from 'react'
import { api } from '@/utils/api'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import CardSurfer from '@/components/CardSurfer'
import { TourWorldTitle } from '@/utils/interfaces'
import Table, { TableData } from '@/components/Table'
import CardSurferLoader from '@/components/loaders/CardSurferLoader'
import { getWorldTitleFormat } from '@/utils/table/worldTitleTableFormat'
import WorldTitleYear from '@/components/tableComponents/TableWorldTitleYear'

export default function Surfers() {
  const router = useRouter()
  const tourResultQuery = api.tourResult.getMany.useQuery({ worldTitle: true, sortYear: 'desc' })
  const onSelectSurfer = (surferSlug: string, year: number) => year >= 2010 ? router.push({ pathname: '/surfers/[surferId]/events', query: { surferId: surferSlug, year: year } }) : router.push({ pathname: '/surfers/[surferId]/career', query: { surferId: surferSlug, } }) // prettier-ignore

  // EXPORT
  const tableData: TableData[] = [
    { name: `Year`, id: 'year', content: (item: TourWorldTitle) => <WorldTitleYear item={item} /> },
    { name: 'Mens CT.', id: 'mens', content: (item: TourWorldTitle) => <div onClick={() => onSelectSurfer(item.mensTourResult.surfer.slug, item.year)}><CardSurfer surfer={item.mensTourResult.surfer} highlightSelect={true} adaptive={true}/></div>, loader: <CardSurferLoader /> }, // prettier-ignore
    { name: 'Womens CT.', id: 'womens', content: (item: TourWorldTitle) => <div>{item.womensTourResult && <div onClick={() => onSelectSurfer(item.womensTourResult.surfer.slug, item.year)}> <CardSurfer surfer={item.womensTourResult.surfer} highlightSelect={true} adaptive={true} /> </div>}</div>, loader: <CardSurferLoader /> }, // prettier-ignore
  ]

  return (
    <Layout title={'World Titles'}>
      <h1 className="header-1">World Titles</h1>
      <Table className="mt-2 sm:mt-4" tableData={tableData} items={getWorldTitleFormat(tourResultQuery) || []} loading={tourResultQuery.isLoading} />
    </Layout>
  )
}
