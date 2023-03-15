import { api } from '@/utils/api'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import SubNavbar from '@/components/SubNavbar'
import { breakPoint } from '@/utils/constants'
import { windowSize } from '@/utils/windowSize'
import Table, { TableData } from '@/components/Table'
import { Location, Surfer } from '@/utils/interfaces'
import CardEventLocation from '@/components/CardLocation'
import { surferYearSpan } from '@/utils/format/getYearSpan'
import { ordinalSuffix } from '@/utils/format/ordinalSuffix'
import TableLink from '@/components/tableComponents/TableLink'
import { surferCareerStats } from '@/utils/format/subHeaderStats'
import SubHeaderItem from '@/components/subHeaderComponents/subHeaderItem'
import SubHeaderSurfer from '@/components/subHeaderComponents/subHeaderSurfer'

export default function SurferLocations() {
  const router = useRouter()
  const { surferId } = router.query as { surferId: string }
  const tourResultQuery = api.tourResult.getMany.useQuery({ surferSlug: surferId, sortYear: 'desc', itemsPerPage: 14 }, { enabled: !!surferId })
  const locationsQuery = api.location.getManyBySurfer.useQuery({ surferSlug: surferId }, { enabled: !!surferId })
  const surferStatQuery = api.surferStat.getCareer.useQuery({ surferSlug: surferId }, { enabled: !!surferId })
  const onLocationSelect = (item: Location) => router.replace({ pathname: '/surfers/[surferId]/[locationId]', query: { surferId: surferId, locationId: item.slug } })

  const subHeaderData = [
    { content: <SubHeaderSurfer surfer={tourResultQuery.data?.[0]?.surfer as Surfer | undefined} routePath={{ pathname: '/surfers', query: {} }} />, primaryTab: true },
    { content: <SubHeaderItem label="career" value={surferYearSpan(tourResultQuery.data)} subvalue="Career" active={false} routePath={{ pathname: '/surfers/[surferId]/career', query: { surferId: surferId } }} loading={tourResultQuery.isLoading} /> },
    { content: <SubHeaderItem className='sm:hidden' label="Events" value={surferYearSpan(tourResultQuery.data)} subvalue='Events'active={false} routePath={{ pathname: '/surfers/[surferId]/events', query: { surferId: surferId, year: tourResultQuery.data?.map((item: any) => item.tour.year)[0] } }} loading={tourResultQuery.isLoading} /> }, //prettier-ignore
    { content: <SubHeaderItem label="locations" value={'All'} subvalue="Locations" active={true} /> },
  ]

  // EXPORT FUNCTIONS
  const bestResultByLocation = (item: Location) => {
    const bestResult = item.events.map((event: any) => event.eventResults[0]?.place).sort((a: number, b: number) => a - b)[0]
    const yearofBestResult = item.events.filter((event: any) => event.eventResults[0]?.place === bestResult)[0]?.tour.year
    const eventName = item.events.filter((event: any) => event.eventResults[0]?.place === bestResult)[0]?.name
    return { bestResult: bestResult, year: yearofBestResult, eventName: eventName }
  }

  // EXPORT FUNCTIONS
  const getApperances = (item: Location) => {
    return item.events.map((event: any) => event.eventResults[0]?.place).filter((place: number) => place > 0).length
  }

  const tableData: TableData[] = [
    { name: 'Location', id: 'location', content: (item: Location) => <CardEventLocation location={item} /> },
    { name: 'Best Result', id: 'bestResult', content: (item: Location) => (<div className='table-item'> {ordinalSuffix(bestResultByLocation(item).bestResult)} · {bestResultByLocation(item).year}</div>) }, // prettier-ignore
    { name: 'Appearances', id: 'appearances', content: (item: Location) => <div className="table-item ml-9">{getApperances(item)}</div> },
    { name: '', id: 'link', className: `w-px`, content: (item: Location) => <TableLink label="View Events" /> },
  ]
  if (windowSize().width! < breakPoint.md) tableData.pop()
  if (windowSize().width! < breakPoint.sm) tableData.pop()

  const subNavItems = [
    { label: 'Career', active: false, router: { pathname: '/surfers/[surferId]/career', query: { surferId: surferId } } },
    { label: 'Events', active: false, router: { pathname: '/surfers/[surferId]/events', query: { surferId: surferId, year: tourResultQuery.data?.map((item: any) => item.tour.year)[0] } } },
    { label: 'Locations', active: true, router: { pathname: '/surfers/[surferId]/locations', query: { surferId: surferId } } },
  ]

  return (
    <Layout title={tourResultQuery.data?.[0]?.surfer.name} subHeader={{ subHeaderData: subHeaderData, stats: surferCareerStats(surferStatQuery.data, tourResultQuery.data?.[0]?.surfer as Surfer | undefined), statsLoading: surferStatQuery.isLoading }}>
      <SubNavbar items={subNavItems} className="hidden sm:block" />
      <Table tableData={tableData} items={locationsQuery.data || []} handleSelection={onLocationSelect} loading={locationsQuery.isLoading} />
    </Layout>
  )
}
