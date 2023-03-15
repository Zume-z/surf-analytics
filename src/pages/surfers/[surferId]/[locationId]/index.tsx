import { api } from '@/utils/api'
import Image from 'next/legacy/image'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import SubNavbar from '@/components/SubNavbar'
import { breakPoint } from '@/utils/constants'
import { windowSize } from '@/utils/windowSize'
import Table, { TableData } from '@/components/Table'
import { surferYearSpan } from '@/utils/format/getYearSpan'
import { ordinalSuffix } from '@/utils/format/ordinalSuffix'
import CardEventLocation from '@/components/CardLocation'
import TableLink from '@/components/tableComponents/TableLink'
import { surferCareerStats } from '@/utils/format/subHeaderStats'
import { EventResult, Location, Surfer, TourResult } from '@/utils/interfaces'
import { shortEventAddress } from '@/utils/format/shortEventAddress'
import SubHeaderItem from '@/components/subHeaderComponents/subHeaderItem'
import SubHeaderSurfer from '@/components/subHeaderComponents/subHeaderSurfer'
import TableEventResultPlace from '@/components/tableComponents/TableSurferERPlace'
import TableEventResultPoints from '@/components/tableComponents/TableSurferERPoints'

import CardLocationResult from '@/components/CardLocationResult'

export default function SurferLocation() {
  const router = useRouter()
  const { surferId, locationId } = router.query as { surferId: string; locationId: string }
  const eventResultQuery = api.eventResult.getMany.useQuery({ surferSlug: surferId, locationSlug: locationId, sortStartDate: 'desc', excludeNoPlace: true }, { enabled: !!surferId && !!locationId })
  const onEventSelect = (item: EventResult) => router.replace({ pathname: '/surfers/[surferId]/heats', query: { surferId: surferId, event: item.eventSlug, year: item.event.tour.year } })
  
  const locationQuery = api.location.getName.useQuery({ slug: locationId }, { enabled: !!locationId })
  const tourResultQuery = api.tourResult.getMany.useQuery({ surferSlug: surferId, sortYear: 'desc', itemsPerPage: 14 }, { enabled: !!surferId })
  const surferStatQuery = api.surferStat.getCareer.useQuery({ surferSlug: surferId }, { enabled: !!surferId })

  const subHeaderData = [
    { content: <SubHeaderSurfer surfer={tourResultQuery.data?.[0]?.surfer as Surfer | undefined} routePath={{ pathname: '/surfers', query: {} }} />, primaryTab: true },
    { content: <SubHeaderItem label="career" value={surferYearSpan(tourResultQuery.data)} subvalue='Career' active={false} routePath={{ pathname: '/surfers/[surferId]/career', query: { surferId: surferId } }} loading={tourResultQuery.isLoading} /> },
    { content: <SubHeaderItem className='sm:hidden' label="Events" value={surferYearSpan(tourResultQuery.data)} subvalue='Events'active={false} routePath={{ pathname: '/surfers/[surferId]/career', query: { surferId: surferId } }} loading={tourResultQuery.isLoading} /> },
    { content: <SubHeaderItem label="location" value={locationQuery.data?.name} active={true} subvalue='Locations' /> },
  ]


  const tableData: TableData[] = [
    { name: 'Event', id: 'event', content: (item: EventResult) => <CardLocationResult event={item.event} /> },
    { name: 'Place', id: 'place', content: (item: EventResult) => <TableEventResultPlace eventResult={item} /> },
    { name: 'Points', id: 'points', content: (item: EventResult) => <TableEventResultPoints eventResult={item} showThrowaways={false} /> },
    { name: '', id: 'link', className: 'w-px', content: (item: EventResult) => <div className="text-blue-base">View Event</div> },
  ]
  if (windowSize().width! < breakPoint.md) tableData.pop()

  const subNavItems = [
    { label: 'Career', active: false, router: { pathname: '/surfers/[surferId]/career', query: { surferId: surferId } } },
    { label: 'Events', active: false, router: { pathname: '/surfers/[surferId]/events', query: { surferId: surferId, year: tourResultQuery.data?.map((item: any) => item.tour.year)[0] } } },
    { label: 'Locations', active: true, router: { pathname: '/surfers/[surferId]/locations', query: { surferId: surferId } } },
  ]

  return (
    <Layout title={tourResultQuery.data?.[0]?.surfer.name} subHeader={{ subHeaderData: subHeaderData, stats: surferCareerStats(surferStatQuery.data, tourResultQuery.data?.[0]?.surfer as Surfer | undefined), statsLoading: surferStatQuery.isLoading }}>
      <div className='text-center sm:hidden block mt-8'>{locationQuery.data?.name}</div>
      <Table tableData={tableData} items={eventResultQuery.data || []} handleSelection={onEventSelect} loading={eventResultQuery.isLoading} />
    </Layout>
  )
}
