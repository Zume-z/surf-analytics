import { useState } from 'react'
import { api } from '@/utils/api'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import SubNavbar from '@/components/SubNavbar'
import { BREAKPOINT } from '@/utils/constants'
import { windowSize } from '@/utils/windowSize'
import Table, { TableData } from '@/components/Table'
import { Location, Surfer } from '@/utils/interfaces'
import CardEventLocation from '@/components/CardLocation'
import { ordinalSuffix } from '@/utils/format/ordinalSuffix'
import { surferYearSpan } from '@/utils/function/getYearSpan'
import TableLink from '@/components/tableComponents/TableLink'
import { surferCareerStats } from '@/utils/stat/subHeaderStats'
import SubHeaderItem from '@/components/subHeaderComponents/subHeaderItem'
import SubHeaderSurfer from '@/components/subHeaderComponents/subHeaderSurfer'
import { bestResultByLocation, getApperances } from '@/utils/function/getLocationResults'


export default function SurferLocations() {
  const router = useRouter()
  const [statToggle, setStatToggle] = useState(false)
  const { surferId, year } = router.query as { surferId: string; year: string }
  const locationsQuery = api.location.getManyBySurfer.useQuery({ surferSlug: surferId }, { enabled: !!surferId })
  const tourResultQuery = api.tourResult.getMany.useQuery({ surferSlug: surferId, sortYear: 'desc', itemsPerPage: 14 }, { enabled: !!surferId })
  const surferStatQuery = api.surferStat.getCareer.useQuery({ surferSlug: surferId }, { enabled: !!surferId && !locationsQuery.isLoading })
  const surferStatAllQuery = api.surferStat.getAll.useQuery({ surferSlug: surferId }, { enabled: !!surferId && statToggle })
  const onLocationSelect = (item: Location) => router.replace({ pathname: '/surfers/[surferId]/[locationId]', query: { surferId: surferId, locationId: item.slug } })

  const subHeaderData = [
    {
      content: (
        <SubHeaderSurfer surfer={tourResultQuery.data?.[0]?.surfer as Surfer | undefined} flagAlignBottom={true} subData={surferYearSpan(tourResultQuery.data)} routePath={{ pathname: '/surfers/[surferId]/career', query: { surferId: surferId } }} />
      ),
      primaryTab: true,
    },
    { content: <SubHeaderItem label="career" value={surferYearSpan(tourResultQuery.data)} subvalue="Career" active={false} routePath={{ pathname: '/surfers/[surferId]/career', query: { surferId: surferId } }} loading={tourResultQuery.isLoading} /> },
    { content: <SubHeaderItem className='sm:hidden' label="Events" value={surferYearSpan(tourResultQuery.data)} subvalue='Events'active={false} routePath={{ pathname: '/surfers/[surferId]/events', query: { surferId: surferId, year: year ? year : tourResultQuery.data?.map((item: any) => item.tour.year)[0] }}} loading={tourResultQuery.isLoading} /> }, //prettier-ignore
    { content: <SubHeaderItem label="locations" value={'All'} subvalue="Locations" active={true} loading={tourResultQuery.isLoading} /> },
  ]

  const subNavItems = [
    { label: 'Career', active: false, router: { pathname: '/surfers/[surferId]/career', query: { surferId: surferId } } },
    { label: 'Events', active: false, router: { pathname: '/surfers/[surferId]/events', query: { surferId: surferId, year: year ? year : tourResultQuery.data?.map((item: any) => item.tour.year)[0] } } },
    { label: 'Locations', active: true, router: { pathname: '/surfers/[surferId]/locations', query: { surferId: surferId } } },
  ]

  const tableData: TableData[] = [
    { name: 'Location', id: 'location', content: (item: Location) => <CardEventLocation location={item} /> },
    { name: 'Best Result', id: 'bestResult', content: (item: Location) => (<div className='table-item'> {ordinalSuffix(bestResultByLocation(item).bestResult)} · {bestResultByLocation(item).year}</div>) }, // prettier-ignore
    { name: 'Appearances', id: 'appearances', content: (item: Location) => <div className="table-item ml-9">{getApperances(item)}</div> },
    { name: '', id: 'link', className: `w-px`, content: (item: Location) => <TableLink label="View Events" /> },
  ]
  if (windowSize().width! < BREAKPOINT.md) tableData.pop()
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
      <Table tableData={tableData} items={locationsQuery.data || []} handleSelection={onLocationSelect} loading={locationsQuery.isLoading} />
    </Layout>
  )
}
