import { z } from 'zod'
import React from 'react'
import { api } from '@/utils/api'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import { Event, EventResult } from '@/utils/interfaces'
import SubNavbar from '@/components/SubNavbar'
import { breakPoint } from '@/utils/constants'
import { windowSize } from '@/utils/windowSize'
import CardSurfer from '@/components/CardSurfer'
import Table, { TableData } from '@/components/Table'
import { EventSchema } from '@/server/api/routers/event'
import CardEventLocation from '@/components/CardEventLocation'
import { eventResultStats } from '@/utils/format/subHeaderStats'
import CardEventLoader from '@/components/loaders/CardEventLoader'
import SubHeaderItem from '@/components/subHeaderComponents/subHeaderItem'
import SubHeaderEvent from '@/components/subHeaderComponents/subHeaderEvent'
import { filterERByPlace, findERByPlace } from '@/utils/format/getEventResultByPlace'

export default function EventResults() {
  const router = useRouter()
  const eventId = router.query.eventId as string
  const locationSlug = router.query.location as string

  const filters: z.infer<typeof EventSchema> = {
    slug: eventId,
    locationSlug: locationSlug,
    sortStartDate: 'desc',
    eventStatus: 'COMPLETED',
  }

  const eventQuery = api.event.getOne.useQuery({ slug: eventId }, { enabled: !!eventId })
  const eventGender = eventQuery.data?.tour.gender
  const eventsQuery = api.event.getManyLocation.useQuery({ locationSlug: filters.locationSlug, gender: eventGender, sortStartDate: filters.sortStartDate, eventStatus: filters.eventStatus }, { enabled: !!eventGender })
  const eventStatQuery = api.eventStat.getResult.useQuery({ eventSlug: eventId }, { enabled: !!eventId })
  const onSelectEvent = (event: Event) => router.push({ pathname: '/events/[eventId]/results', query: { eventId: event.slug } })

  const tableData: TableData[] = [
    { name: 'Event', id: 'event', content: (item: Event) => <CardEventLocation event={item} showYear={true} />, loader: <CardEventLoader /> },
    { name: 'Winner', id: 'winner', content: (item: Event) => <div>{filterERByPlace(item.eventResults, 1).length == 1 ? <CardSurfer surfer={findERByPlace(item.eventResults, 1)!.surfer} /> : <div className='text-gray-500'>-</div>}</div> }, //prettier-ignore
    { name: 'Runner Up', id: 'runnerup', content: (item: Event) =>  <div>{filterERByPlace(item.eventResults, 2).length == 1 ? <CardSurfer surfer={findERByPlace(item.eventResults, 2)!.surfer} /> : <div className='text-gray-500'>-</div>}</div> }, //prettier-ignore
    { name: '', id: 'link', className: 'w-px', content: () => <div className="text-blue-base">View Event</div> },
  ]
  if (windowSize().width! < breakPoint.lg) tableData.pop()
  if (windowSize().width! < breakPoint.sm) tableData.pop()

  const subNavItems = [
    { label: 'Events', active: false, router: { pathname: '/events', query: {} } },
    { label: 'Results', active: false, router: { pathname: '/events/[eventId]/results', query: { eventId: filters.slug } } },
    { label: 'Heats', active: false, router: { pathname: '/events/[eventId]/heats', query: { eventId: eventId } } },
    { label: 'Champions', active: true, router: { pathname: '/events', query: {} } },
  ]

  const subHeaderData = [
    { content: <SubHeaderEvent event={eventQuery.data as Event | undefined} routePath={{ pathname: '/events', query: {} }} />, primaryTab: true },
    { content: <SubHeaderItem label="year" value={eventQuery.data?.tour.year} subvalue="Events" routePath={{ pathname: '/events', query: {} }} loading={eventQuery.isLoading} /> },
    { content: <SubHeaderItem className="sm:hidden" label="results" value="All" subvalue="Results" active={false} loading={eventQuery.isLoading} routePath={{ pathname: '/events/[eventId]/results', query: { eventId: filters.slug } }} /> },
    { content: <SubHeaderItem className='sm:hidden' label="heats" value="All" subvalue="Heats" active={false} loading={eventQuery.isLoading} routePath={{ pathname: '/events/[eventId]/heats', query: { eventId: filters.slug } }} /> }, //prettier-ignore
    { content: <SubHeaderItem label="Champions" value="All" subvalue="Champions" active={true} loading={eventQuery.isLoading} /> },
  ]

  return (
    <Layout title={eventQuery.data?.name} subHeader={{ subHeaderData: subHeaderData, stats: eventResultStats(eventStatQuery.data), statsLoading: eventStatQuery.isLoading }}>
      <SubNavbar items={subNavItems} className="hidden sm:block" />
      <Table tableData={tableData} items={eventsQuery.data || []} handleSelection={onSelectEvent} loading={eventsQuery.isLoading} />
    </Layout>
  )
}
