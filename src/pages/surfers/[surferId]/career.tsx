import { api } from '@/utils/api'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import { BREAKPOINT } from '@/utils/constants'
import SubNavbar from '@/components/SubNavbar'
import { windowSize } from '@/utils/windowSize'
import Table, { TableData } from '@/components/Table'
import { Surfer, TourResult } from '@/utils/interfaces'
import { surferYearSpan } from '@/utils/format/getYearSpan'
import TableLink from '@/components/tableComponents/TableLink'
import { surferCareerStats } from '@/utils/format/subHeaderStats'
import SubHeaderItem from '@/components/subHeaderComponents/subHeaderItem'
import TourResultRank from '@/components/tableComponents/TableTourResultRank'
import SubHeaderSurfer from '@/components/subHeaderComponents/subHeaderSurfer'
import TourResultPoints from '@/components/tableComponents/TableTourResultPoints'
import { useState } from 'react'

export default function SurferCareer() {
  const router = useRouter()
  const [statToggle, setStatToggle] = useState(false)
  const { surferId } = router.query as { surferId: string }
  const tourResultQuery = api.tourResult.getMany.useQuery({ surferSlug: surferId, sortYear: 'desc', itemsPerPage: 14 }, { enabled: !!surferId })
  const surferStatQuery = api.surferStat.getCareer.useQuery({ surferSlug: surferId }, { enabled: !!surferId && !tourResultQuery.isLoading })
  const surferStatAllQuery = api.surferStat.getAll.useQuery({ surferSlug: surferId }, { enabled: !!surferId && statToggle })
  const onYearSelect = (item: TourResult) => !item.tour.canceled && item.tour.year >= 2010 && router.replace({ pathname: '/surfers/[surferId]/events', query: { ...router.query, year: item.tour.year } })

  const subHeaderData = [
    { content: <SubHeaderSurfer surfer={tourResultQuery.data?.[0]?.surfer as Surfer | undefined} flagAlignBottom={true} subData={surferYearSpan(tourResultQuery.data)} />, primaryTab: true },
    { content: <SubHeaderItem label="career" value={surferYearSpan(tourResultQuery.data)} subvalue={'Career'} active={true} /> },
    { content: <SubHeaderItem className='sm:hidden block' label="Events" value={'-'} subvalue={'Events'} active={false} loading={tourResultQuery.isLoading} routePath={{ pathname: '/surfers/[surferId]/events', query: { surferId: surferId, year: tourResultQuery.data?.map((item: any) => item.tour.year)[0] } }}  /> }, //prettier-ignore
    { content: <SubHeaderItem className='sm:hidden block'label="Locations" value={'-'} subvalue={'Locations'} active={false} loading={tourResultQuery.isLoading} routePath={{ pathname: '/surfers/[surferId]/locations', query: { surferId: surferId } }} /> }, //prettier-ignore
  ]

  const subNavItems = [
    { label: 'Career', active: true },
    { label: 'Events', active: false, router: { pathname: '/surfers/[surferId]/events', query: { surferId: surferId, year: tourResultQuery.data?.map((item: any) => item.tour.year)[0] } } },
    { label: 'Locations', active: false, router: { pathname: '/surfers/[surferId]/locations', query: { surferId: surferId } } },
  ]

  const tableData: TableData[] = [
    { name: 'Year', id: 'year', content: (item: TourResult) => <div className={`${item.tour.canceled && 'text-gray-500'}`}>{item.tour.year}</div> },
    { name: 'Rank', id: 'rank', content: (item: TourResult) => <TourResultRank tourResult={item} /> },
    { name: 'Points', id: 'points', className: 'sm:w-auto w-px', content: (item: TourResult) => <TourResultPoints tourResult={item} /> },
    { name: '', id: 'link', className: `w-px`, content: (item: TourResult) => <TableLink label="View Events" canceled={item.tour.canceled} nolinkParam={item.tour.year < 2010} /> },
  ]
  if (windowSize().width! < BREAKPOINT.sm) tableData.pop()

  return (
    <Layout
      title={tourResultQuery.data?.[0]?.surfer.name}
      subHeader={{
        subHeaderData: subHeaderData,
        stats: surferCareerStats(surferStatQuery.data, surferStatAllQuery.data, tourResultQuery.data?.[0]?.surfer as Surfer | undefined, statToggle),
        statsLoading: !statToggle ? surferStatQuery.isLoading : surferStatAllQuery.isLoading,
        statToggle: statToggle,
        setStatToggle: setStatToggle,
      }}
    >
      <SubNavbar items={subNavItems} className="hidden sm:block" />
      <Table tableData={tableData} items={tourResultQuery.data || []} handleSelection={onYearSelect} loading={tourResultQuery.isLoading} />
    </Layout>
  )
}
