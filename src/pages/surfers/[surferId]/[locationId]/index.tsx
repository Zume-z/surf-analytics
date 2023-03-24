import { api } from '@/utils/api'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import { BREAKPOINT } from '@/utils/constants'
import { windowSize } from '@/utils/windowSize'
import ButtonBack from '@/components/ButtonBack'
import Table, { TableData } from '@/components/Table'
import { EventResult, Surfer } from '@/utils/interfaces'
import { surferYearSpan } from '@/utils/format/getYearSpan'
import CardLocationResult from '@/components/CardLocationResult'
import { surferLocationStats } from '@/utils/format/subHeaderStats'
import SubHeaderItem from '@/components/subHeaderComponents/subHeaderItem'
import SubHeaderSurfer from '@/components/subHeaderComponents/subHeaderSurfer'
import TableEventResultPlace from '@/components/tableComponents/TableSurferERPlace'
import TableEventResultPoints from '@/components/tableComponents/TableSurferERPoints'
import SubHeaderButtonBack from '@/components/subHeaderComponents/subHeaderButtonBack'
import { useState } from 'react'

export default function SurferLocation() {
  const router = useRouter()
  const [statToggle, setStatToggle] = useState(false)
  const { surferId, locationId } = router.query as { surferId: string; locationId: string }
  const eventResultQuery = api.eventResult.getManyBySurfer.useQuery({ surferSlug: surferId, locationSlug: locationId, sortStartDate: 'desc', excludeNoPlace: true }, { enabled: !!surferId && !!locationId })
  const locationQuery = api.location.getName.useQuery({ slug: locationId }, { enabled: !!locationId })
  const tourResultQuery = api.tourResult.getMany.useQuery({ surferSlug: surferId, sortYear: 'desc', itemsPerPage: 14 }, { enabled: !!surferId })
  const locationStatQuery = api.locationSurferStat.getLocationSurfer.useQuery({ surferSlug: surferId, locationSlug: locationId }, { enabled: !!surferId && !eventResultQuery.isLoading })
  const locationStatAllQuery = api.locationSurferStat.getAll.useQuery({ surferSlug: surferId, locationSlug: locationId }, { enabled: !!surferId && statToggle })

  const onEventSelect = (item: EventResult) => router.replace({ pathname: '/surfers/[surferId]/heats', query: { surferId: surferId, event: item.eventSlug, year: item.event.tour.year } })

  const subHeaderData = [
    { content: <SubHeaderSurfer surfer={tourResultQuery.data?.[0]?.surfer as Surfer | undefined} flagAlignBottom={true} subData={surferYearSpan(tourResultQuery.data)} routePath={{ pathname: '/surfers', query: {} }} />, primaryTab: true },
    { content: <SubHeaderItem className="hidden sm:block" label="career" value={surferYearSpan(tourResultQuery.data)} subvalue="Career" active={false} routePath={{ pathname: '/surfers/[surferId]/career', query: { surferId: surferId } }} loading={tourResultQuery.isLoading} /> }, //prettier-ignore
    { content: <SubHeaderItem label="location" value={locationQuery.data?.eventName} active={true} subInactive={true} loading={locationQuery.isLoading} noBorder={true} /> },
  ]

  const tableData: TableData[] = [
    { name: 'Event', id: 'event', content: (item: EventResult) => <CardLocationResult event={item.event} /> },
    { name: 'Place', id: 'place', content: (item: EventResult) => <TableEventResultPlace eventResult={item} /> },
    { name: 'Points', id: 'points', content: (item: EventResult) => <TableEventResultPoints eventResult={item} showThrowaways={false} /> },
    { name: '', id: 'link', className: 'w-px', content: (item: EventResult) => <div className="text-blue-base">View Heats</div> },
  ]
  if (windowSize().width! < BREAKPOINT.md) tableData.pop()

  return (
    <Layout
      title={tourResultQuery.data?.[0]?.surfer.name}
      subHeader={{
        subHeaderData: subHeaderData,
        stats: surferLocationStats(locationStatQuery.data, locationStatAllQuery.data, statToggle),
        statsLoading: !statToggle ? locationStatQuery.isLoading : locationStatAllQuery.isLoading,
        buttonBack: <SubHeaderButtonBack label="Locations" routePath={{ pathname: '/surfers/[surferId]/locations', query: { surferId: surferId } }} />,
        statToggle: statToggle,
        setStatToggle: setStatToggle,
      }}
    >
      <ButtonBack className="hidden sm:block" label="Locations" routePath={{ pathname: '/surfers/[surferId]/locations', query: { surferId: surferId } }} />
      <Table tableData={tableData} items={eventResultQuery.data || []} handleSelection={onEventSelect} loading={eventResultQuery.isLoading} />
    </Layout>
  )
}
