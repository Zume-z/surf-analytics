import { z } from 'zod'
import { api } from '@/utils/api'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import Layout from '@/components/Layout'
import { Event } from '@/utils/interfaces'
import SubNavbar from '@/components/SubNavbar'
import { BREAKPOINT } from '@/utils/constants'
import { windowSize } from '@/utils/windowSize'
import CardSurfer from '@/components/CardSurfer'
import Table, { TableData } from '@/components/Table'
import { EventSchema } from '@/server/api/routers/event'
import CardEventChampion from '@/components/CardLocationResult'
import { eventResultStats } from '@/utils/format/subHeaderStats'
import CardEventLoader from '@/components/loaders/CardEventLoader'
import SubHeaderItem from '@/components/subHeaderComponents/subHeaderItem'
import SubHeaderEvent from '@/components/subHeaderComponents/subHeaderEvent'
import { filterERByPlace, findERByPlace } from '@/utils/format/getEventResultByPlace'

export default function Champions() {
  const router = useRouter()
  const eventId = router.query.eventId as string
  const [statToggle, setStatToggle] = useState(false)
  const locationSlug = router.query.location as string

  const filters: z.infer<typeof EventSchema> = {
    slug: eventId,
    locationSlug: locationSlug,
    sortStartDate: 'desc',
    eventStatus: 'COMPLETED',
  }

  const eventQuery = api.event.getOneHeader.useQuery({ slug: eventId }, { enabled: !!eventId })
  const eventsQuery = api.event.getManyByLocation.useQuery({ locationSlug: filters.locationSlug, gender: eventQuery.data?.tour.gender, sortStartDate: filters.sortStartDate, eventStatus: filters.eventStatus }, { enabled: !!eventQuery.data?.tour.gender }) // prettier-ignore
  const eventStatQuery = api.eventStat.getResult.useQuery({ eventSlug: eventId }, { enabled: !!eventId && !eventsQuery.isLoading })
  const eventStatAllQuery = api.eventStat.getAll.useQuery({ eventSlug: eventId }, { enabled: !!eventId && statToggle })
  const onSelectEvent = (event: Event) => router.push({ pathname: '/events/[eventId]/results', query: { eventId: event.slug } })

  const subHeaderData = [
    { content: <SubHeaderEvent event={eventQuery.data as Event | undefined} routePath={{ pathname: '/events/[eventId]/results', query: { eventId: filters.slug } }} />, primaryTab: true },
    { content: <SubHeaderItem className="hidden sm:block" label="year" value={eventQuery.data?.tour.year} subvalue="Events" routePath={{ pathname: '/events', query: {} }} loading={eventQuery.isLoading} /> },
    { content: <SubHeaderItem className="sm:hidden" label="results" value="All" subvalue="Results" active={false} loading={eventQuery.isLoading} routePath={{ pathname: '/events/[eventId]/results', query: { eventId: filters.slug } }} /> },
    { content: <SubHeaderItem className='sm:hidden' label="heats" value="All" subvalue="Heats" active={false} loading={eventQuery.isLoading} routePath={{ pathname: '/events/[eventId]/heats', query: { eventId: filters.slug } }} /> }, //prettier-ignore
    { content: <SubHeaderItem label="Champions" value="All" subvalue="Past Champions" active={true} loading={eventQuery.isLoading} /> },
  ]

  const subNavItems = [
    { label: 'Results', active: false, router: { pathname: '/events/[eventId]/results', query: { eventId: filters.slug } } },
    { label: 'Heats', active: false, router: { pathname: '/events/[eventId]/heats', query: { eventId: eventId } } },
    { label: 'Past Champions', active: true, router: { pathname: '/events', query: {} } },
  ]

  const tableData: TableData[] = [
    { name: 'Event', id: 'event', content: (item: Event) => <CardEventChampion event={item} showYear={true} />, loader: <CardEventLoader /> },
    { name: 'Winner', id: 'winner', content: (item: Event) => <div>{filterERByPlace(item.eventResults, 1).length == 1 ? <CardSurfer surfer={findERByPlace(item.eventResults, 1)!.surfer} /> : <div className='text-gray-500'>-</div>}</div> }, //prettier-ignore
    { name: 'Runner Up', id: 'runnerup', content: (item: Event) =>  <div>{filterERByPlace(item.eventResults, 2).length == 1 ? <CardSurfer surfer={findERByPlace(item.eventResults, 2)!.surfer} /> : <div className='text-gray-500'>-</div>}</div> }, //prettier-ignore
    { name: '', id: 'link', className: 'w-px', content: () => <div className="text-blue-base">View Event</div> },
  ]
  if (windowSize().width! < BREAKPOINT.lg) tableData.pop()
  if (windowSize().width! < BREAKPOINT.sm) tableData.pop()

  return (
    <Layout
      title={eventQuery.data?.name}
      subHeader={{
        subHeaderData: subHeaderData,
        stats: eventResultStats(eventStatQuery.data, eventStatAllQuery.data, statToggle),
        statsLoading: !statToggle ? eventStatQuery.isLoading : eventStatAllQuery.isLoading,
        statToggle: statToggle,
        setStatToggle: setStatToggle,
      }}
    >
      <SubNavbar items={subNavItems} className="hidden sm:block" />
      <Table tableData={tableData} items={eventsQuery.data || []} handleSelection={onSelectEvent} loading={eventsQuery.isLoading} />
    </Layout>
  )
}
