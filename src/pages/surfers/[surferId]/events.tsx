import { api } from '@/utils/api'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import CardEvent from '@/components/CardEvent'
import { BREAKPOINT } from '@/utils/constants'
import { windowSize } from '@/utils/windowSize'
import Table, { TableData } from '@/components/Table'
import { EventResult, Surfer } from '@/utils/interfaces'
import { surferEventStats } from '@/utils/format/subHeaderStats'
import CardEventLoader from '@/components/loaders/CardEventLoader'
import SubHeaderItem from '@/components/subHeaderComponents/subHeaderItem'
import SubHeaderSurfer from '@/components/subHeaderComponents/subHeaderSurfer'
import TableEventResultPlace from '@/components/tableComponents/TableSurferERPlace'
import TableEventResultPoints from '@/components/tableComponents/TableSurferERPoints'
import SubNavbar from '@/components/SubNavbar'
import { useState } from 'react'

export default function SurferEvents() {
  const router = useRouter()
  const [statToggle, setStatToggle] = useState(false)
  const { surferId, year } = router.query as { surferId: string; year: string }
  const surferQuery = api.surfer.getOneHeader.useQuery({ slug: surferId }, { enabled: !!surferId })
  const eventResultQuery = api.eventResult.getManyBySurfer.useQuery({ surferSlug: surferId, year: Number(year), sortStartDate: 'asc' }, { enabled: !!surferId && !!year })
  const tourResultStatQuery = api.tourResultStat.getEvents.useQuery({ surferSlug: surferId, year: Number(year) }, { enabled: !!surferId && !!year && !eventResultQuery.isLoading })
  const tourResultAllStatQuery = api.tourResultStat.getAll.useQuery({ surferSlug: surferId, year: Number(year) }, { enabled: !!surferId && !!year && statToggle })
  const onEventSelect = (item: EventResult) => !item.injured && !item.withdrawn && item.place != 0 && router.replace({ pathname: '/surfers/[surferId]/heats', query: { ...router.query, event: item.eventSlug } })


  const subHeaderData = [
    { content: <SubHeaderSurfer surfer={surferQuery.data as Surfer | undefined} subData={year} flagAlignBottom={true} routePath={{ pathname: '/surfers', query: {} }} />, primaryTab: true },
    { content: <SubHeaderItem label="year" value={year} subvalue="Career" routePath={{ pathname: '/surfers/[surferId]/career', query: { surferId: router.query.surferId } }} loading={surferQuery.isLoading} /> },
    { content: <SubHeaderItem label="events" value="All" subvalue="Events" active={true} loading={surferQuery.isLoading} /> },
    { content: <SubHeaderItem className='sm:hidden block'label="Locations" value={'-'} loading={surferQuery.isLoading} subvalue={'Locations'} active={false} routePath={{ pathname: '/surfers/[surferId]/locations', query: { surferId: surferId,  year: year } }} /> }, //prettier-ignore
  ]

  const subNavItems = [
    { label: 'Career', active: false, router: { pathname: '/surfers/[surferId]/career', query: { surferId: surferId } } },
    { label: 'Events', active: true },
    { label: 'Locations', active: false, router: { pathname: '/surfers/[surferId]/locations', query: { surferId: surferId, year: year } } },
  ]

  const tableData: TableData[] = [
    { name: 'Event', id: 'event', content: (item: EventResult) => <CardEvent event={item.event} />, loader: <CardEventLoader /> },
    { name: 'Place', id: 'place', content: (item: EventResult) => <TableEventResultPlace eventResult={item} /> },
    { name: 'Points', id: 'points', content: (item: EventResult) => <TableEventResultPoints eventResult={item} /> },
    { name: '', id: 'link', className: 'w-px', content: (item: EventResult) => <div className="text-blue-base">View Heats</div> },
    // { name: 'Beaten By', id: 'beaten-by', content: (item: EventResult) => <div className='table-item'>{item.knockedOutBy }</div> },
  ]
  if (windowSize().width! < BREAKPOINT.md) tableData.pop()

  return (
    <Layout
      title={surferQuery.data?.name}
      subHeader={{
        subHeaderData: subHeaderData,
        stats: surferEventStats(tourResultStatQuery.data, tourResultAllStatQuery.data, statToggle),
        statsLoading: !statToggle ? tourResultStatQuery.isLoading : tourResultAllStatQuery.isLoading,
        statToggle: statToggle,
        setStatToggle: setStatToggle,
      }}
    >
      <SubNavbar items={subNavItems} className="hidden sm:block" />
      <Table tableData={tableData} items={eventResultQuery.data || []} handleSelection={onEventSelect} loading={eventResultQuery.isLoading} />
    </Layout>
  )
}
