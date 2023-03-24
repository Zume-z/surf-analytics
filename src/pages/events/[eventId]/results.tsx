import { z } from 'zod'
import React, { useState } from 'react'
import { api } from '@/utils/api'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import FilterBar from '@/components/FilterBar'
import SubNavbar from '@/components/SubNavbar'
import { BREAKPOINT } from '@/utils/constants'
import { windowSize } from '@/utils/windowSize'
import CardSurfer from '@/components/CardSurfer'
import { useQueryState } from 'next-usequerystate'
import ButtonSelect from '@/components/ButtonSelect'
import Table, { TableData } from '@/components/Table'
import { Event, EventResult } from '@/utils/interfaces'
import ButtonSelectSearch from '@/components/ButtonSelectSearch'
import { eventResultStats } from '@/utils/format/subHeaderStats'
import CardSurferLoader from '@/components/loaders/CardSurferLoader'
import { EventResultSchema } from '@/server/api/routers/eventResult'
import SubHeaderItem from '@/components/subHeaderComponents/subHeaderItem'
import EventERPoints from '@/components/tableComponents/TableEventERPoints'
import SubHeaderEvent from '@/components/subHeaderComponents/subHeaderEvent'

export default function EventResults() {
  const router = useRouter()
  const { eventId } = router.query as { eventId: string }
  const [statToggle, setStatToggle] = useState(false)
  const [countrySlug, setCountrySlug] = useQueryState('country')

  const filters: z.infer<typeof EventResultSchema> = {
    eventSlug: eventId,
    sortPlace: 'asc',
    excludeNoPlace: true,
    surferCountrySlug: countrySlug || undefined,
  }

  const eventResultQuery = api.eventResult.getMany.useQuery(filters, { enabled: !!eventId })
  const eventQuery = api.event.getOneHeader.useQuery({ slug: eventId }, { enabled: !!eventId })
  const countryQuery = api.country.getOptionsBySurfer.useQuery({ surferEventSlug: eventId }, { enabled: !!eventId })
  const countryOptions = countryQuery.data?.map((country) => ({ label: country.name, value: country.slug }))
  const eventStatQuery = api.eventStat.getResult.useQuery({ eventSlug: eventId }, { enabled: !!eventId && !eventResultQuery.isLoading })
  const eventStatAllQuery = api.eventStat.getAll.useQuery({ eventSlug: eventId }, { enabled: !!eventId && statToggle })
  const onSelectSurfer = (eventResult: EventResult) => router.push({ pathname: '/events/[eventId]/heats', query: { eventId: eventId, surfer: eventResult.surfer.slug } })
  const onGenderSelect = (linkedEventSlug: string) => router.push({ pathname: '/events/[eventId]/results', query: { eventId: linkedEventSlug } })
  const genderOptions = eventQuery.data?.linkedEventSlug && [
    { label: 'Mens', value: eventQuery.data?.tour.gender == 'MALE' ? eventId : eventQuery.data?.linkedEventSlug },
    { label: 'Womens', value: eventQuery.data?.tour.gender == 'FEMALE' ? eventId : eventQuery.data?.linkedEventSlug },
  ]

  const subHeaderData = [
    { content: <SubHeaderEvent event={eventQuery.data as Event | undefined} routePath={{ pathname: '/events', query: {} }} />, primaryTab: true },
    { content: <SubHeaderItem className="hidden sm:block" label="year" value={eventQuery.data?.tour.year} subvalue="Events" routePath={{ pathname: '/events', query: {} }} loading={eventQuery.isLoading} /> },
    { content: <SubHeaderItem label="results" value="All" subvalue="Results" active={true} loading={eventQuery.isLoading} /> },
    { content: <SubHeaderItem className='sm:hidden' label="heats" value="All" subvalue="Heats" active={false} loading={eventQuery.isLoading} routePath={{ pathname: '/events/[eventId]/heats', query: { eventId: filters.eventSlug } }} /> }, //prettier-ignore
    { content: <SubHeaderItem className="sm:hidden" label="Champions" value="All" subvalue="Champions" active={false} loading={eventQuery.isLoading} routePath={{ pathname: '/events/[eventId]/champions', query: { eventId: filters.eventSlug , location: eventQuery.data?.locationSlug } }} /> }, //prettier-ignore
  ]

  const subNavItems = [
    { label: 'Results', active: true },
    { label: 'Heats', active: false, router: { pathname: '/events/[eventId]/heats', query: { eventId: eventId } } },
    { label: 'Champions', active: false, router: { pathname: '/events/[eventId]/champions', query: { eventId: eventId, location: eventQuery.data?.locationSlug } } },
  ]

  const tableData: TableData[] = [
    { name: 'Place', id: 'place', content: (item: EventResult) => <CardSurfer surfer={item.surfer} place={item.place} />, loader: <CardSurferLoader /> },
    { name: 'Points', id: 'points', content: (item: EventResult) => <EventERPoints eventResult={item} /> },
    { name: '', id: 'link', className: 'w-px', content: () => <div className="text-blue-base">View Heats</div> },
  ]
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
      <FilterBar className="my-8 justify-start">
        {eventQuery.data?.linkedEventSlug && <ButtonSelect className="border-r" placeHolder="Mens" value={eventId} setValue={onGenderSelect} options={genderOptions || []} loading={countryQuery.isLoading} loadingText="Gender" />}
        <ButtonSelectSearch placeHolder="Country" searchPlaceHolder="Search countries" value={countrySlug ?? undefined} setValue={setCountrySlug} options={countryOptions} loading={countryQuery.isLoading} loadingText="Country" />
      </FilterBar>
      <Table tableData={tableData} items={eventResultQuery.data || []} handleSelection={onSelectSurfer} loading={eventResultQuery.isLoading} />
    </Layout>
  )
}
