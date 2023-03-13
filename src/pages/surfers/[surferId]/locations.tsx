import { api } from '@/utils/api'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import { breakPoint } from '@/utils/constants'
import { windowSize } from '@/utils/windowSize'
import Table, { TableData } from '@/components/Table'
import { Location, Surfer, TourResult } from '@/utils/interfaces'
import { surferYearSpan } from '@/utils/format/getYearSpan'
import TableLink from '@/components/tableComponents/TableLink'
import { surferCareerStats } from '@/utils/format/subHeaderStats'
import SubHeaderItem from '@/components/subHeaderComponents/subHeaderItem'
import TourResultRank from '@/components/tableComponents/TableTourResultRank'
import SubHeaderSurfer from '@/components/subHeaderComponents/subHeaderSurfer'
import TourResultPoints from '@/components/tableComponents/TableTourResultPoints'
import SubNavbar from '@/components/SubNavbar'
import { ordinalSuffix } from '@/utils/format/ordinalSuffix'

export default function SurfersCareer() {
  const router = useRouter()
  const { surferId } = router.query as { surferId: string }
  const tourResultQuery = api.tourResult.getMany.useQuery({ surferSlug: surferId, sortYear: 'desc', itemsPerPage: 14 }, { enabled: !!surferId })
  const surferStatQuery = api.surferStat.getCareer.useQuery({ surferSlug: surferId }, { enabled: !!surferId })
  const onYearSelect = (item: TourResult) => !item.tour.canceled && item.tour.year >= 2010 && router.replace({ pathname: '/surfers/[surferId]/events', query: { ...router.query, year: item.tour.year } })

  const subHeaderData = [
    { content: <SubHeaderSurfer surfer={tourResultQuery.data?.[0]?.surfer as Surfer | undefined} routePath={{ pathname: '/surfers', query: {} }} />, primaryTab: true },
    { content: <SubHeaderItem label="career" value={surferYearSpan(tourResultQuery.data)} active={true} noBorder={true} /> },
  ]

  // TEST CHANGE
  const locationsQuery = api.surfer.getLocations.useQuery({ surferId: surferId }, { enabled: !!surferId })

  const bestResultByLocation = (item: Location) => {
    const bestResult = item.events.map((event: any) => event.eventResults[0]?.place).sort((a: number, b: number) => a - b)[0]
    const yearofBestResult = item.events.filter((event: any) => event.eventResults[0]?.place === bestResult)[0]?.tour.year
    return { bestResult: bestResult, year: yearofBestResult }
  }

  const getApperances = (item: Location) => {
    return item.events.map((event: any) => event.eventResults[0]?.place).filter((place: number) => place > 0).length
  }
  const tableData: TableData[] = [
    {
      name: 'Location',
      id: 'location',
      content: (item: Location) => (
        <div>
          <div>{item.name}</div>
          <div>{item.country.name}</div>
        </div>
      ),
    },
    { name: 'Best Result', id: 'bestResult', content: (item: Location) => <div>{ordinalSuffix(bestResultByLocation(item).bestResult) + ' · ' + bestResultByLocation(item).year + ''}</div> },
    { name: 'Appearances', id: 'appearances', content: (item: Location) => <div className="ml-10">{getApperances(item)}</div> },
    { name: '', id: 'link', className: `w-px`, content: (item: Location) => <TableLink label="View Events" /> },
  ]
  if (windowSize().width! < breakPoint.sm) tableData.pop()

  const subNavItems = [
    { label: 'Career', active: false, router: { pathname: '/surfers/[surferId]/career', query: { surferId: surferId } } },
    { label: 'Events', active: false, router: { pathname: '/surfers/[surferId]/events', query: { surferId: surferId, year: tourResultQuery.data?.map((item: any) => item.tour.year)[0] } } },
    { label: 'Locations', active: true, router: { pathname: '/surfers/[surferId]/locations', query: { surferId: surferId } } },
  ]

  return (
    <Layout title={tourResultQuery.data?.[0]?.surfer.name} subHeader={{ subHeaderData: subHeaderData, stats: surferCareerStats(surferStatQuery.data, tourResultQuery.data?.[0]?.surfer as Surfer | undefined), statsLoading: surferStatQuery.isLoading }}>
      <SubNavbar items={subNavItems} className="hidden sm:block" />

      <Table tableData={tableData} items={locationsQuery.data || []} handleSelection={onYearSelect} loading={locationsQuery.isLoading} />
    </Layout>
  )
}
