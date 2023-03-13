import { z } from 'zod'
import React from 'react'
import { api } from '@/utils/api'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import FilterBar from '@/components/FilterBar'
import SubNavbar from '@/components/SubNavbar'
import { breakPoint } from '@/utils/constants'
import { windowSize } from '@/utils/windowSize'
import CardSurfer from '@/components/CardSurfer'
import { useQueryState } from 'next-usequerystate'
import ButtonSelect from '@/components/ButtonSelect'
import Table, { TableData } from '@/components/Table'

import { eventResultStats } from '@/utils/format/subHeaderStats'
import { Event, EventResult, TourResult } from '@/utils/interfaces'
import CardSurferLoader from '@/components/loaders/CardSurferLoader'
import { EventResultSchema } from '@/server/api/routers/eventResult'
import SubHeaderItem from '@/components/subHeaderComponents/subHeaderItem'
import EventERPoints from '@/components/tableComponents/TableEventERPoints'
import SubHeaderEvent from '@/components/subHeaderComponents/subHeaderEvent'

import ButtonSelectSearch from '@/components/ButtonSelectSearch'

export default function EventResults() {
  const router = useRouter()
  const eventId = router.query.eventId as string
  const [countrySlug, setCountrySlug] = useQueryState('country')

  const filters: z.infer<typeof EventResultSchema> = {
    eventSlug: eventId,
    sortPlace: 'asc',
    excludeNoPlace: true,
    surferCountrySlug: countrySlug || undefined,
  }
  const eventResultQuery = api.eventResult.getMany.useQuery(filters, { enabled: !!eventId })
  const eventQuery = api.event.getOne.useQuery({ slug: eventId }, { enabled: !!eventId })
  const countryQuery = api.country.getManyBySurfer.useQuery({ surferEventSlug: eventId }, { enabled: !!eventId })
  const countryOptions = countryQuery.data?.map((country) => ({ label: country.name, value: country.slug }))
  const eventStatQuery = api.eventStat.getResult.useQuery({ eventSlug: eventId }, { enabled: !!eventId })
  const onSelectSurfer = (tourResult: TourResult) => router.push({ pathname: '/events/[eventId]/heats', query: { eventId: eventId, surfer: tourResult.surfer.slug } })
  const onGenderSelect = (linkedEventSlug: string) => router.push({ pathname: '/events/[eventId]/results', query: { eventId: linkedEventSlug } })
  const genderOptions = eventQuery.data?.linkedEventSlug && [
    { label: 'Mens', value: eventQuery.data?.tour.gender == 'MALE' ? eventId : eventQuery.data?.linkedEventSlug },
    { label: 'Womens', value: eventQuery.data?.tour.gender == 'FEMALE' ? eventId : eventQuery.data?.linkedEventSlug },
  ]

  const tableData: TableData[] = [
    { name: 'Place', id: 'place', content: (item: EventResult) => <CardSurfer surfer={item.surfer} place={item.place} />, loader: <CardSurferLoader /> },
    { name: 'Points', id: 'points', content: (item: EventResult) => <EventERPoints eventResult={item} /> },
    { name: '', id: 'link', className: 'w-px', content: () => <div className="text-blue-base">View Heats</div> },
  ]
  if (windowSize().width! < breakPoint.sm) tableData.pop()

  const subHeaderData = [
    { content: <SubHeaderEvent event={eventQuery.data as Event | undefined} routePath={{ pathname: '/events', query: {} }} />, primaryTab: true },
    { content: <SubHeaderItem label="year" value={eventQuery.data?.tour.year} subvalue="Events" routePath={{ pathname: '/events', query: {} }} loading={eventQuery.isLoading} /> },
    { content: <SubHeaderItem label="results" value="All" subvalue="Results" active={true} loading={eventQuery.isLoading} /> },
    { content: <SubHeaderItem className='sm:hidden' label="heats" value="All" subvalue="Heats" active={false} loading={eventQuery.isLoading} routePath={{ pathname: '/events/[eventId]/heats', query: { eventId: filters.eventSlug } }} /> }, //prettier-ignore
  ]

  const subNavItems = [
    { label: 'Events', active: false, router: { pathname: '/events', query: {} } },
    { label: 'Results', active: true },
    { label: 'Heats', active: false, router: { pathname: '/events/[eventId]/heats', query: { eventId: eventId } } },
  ]

  return (
    <Layout title={eventQuery.data?.name} subHeader={{ subHeaderData: subHeaderData, stats: eventResultStats(eventStatQuery.data), statsLoading: eventStatQuery.isLoading }}>
      <SubNavbar items={subNavItems} className="hidden sm:block" />
      <FilterBar className="my-8 justify-center sm:justify-start">
        {eventQuery.data?.linkedEventSlug && <ButtonSelect className="border-r" placeHolder="Mens" value={eventId} setValue={onGenderSelect} options={genderOptions || []} loading={countryQuery.isLoading} loadingText="Gender" />}
        <ButtonSelectSearch placeHolder="Country" searchPlaceHolder="Search countries" value={countrySlug ?? undefined} setValue={setCountrySlug} options={countryOptions} loading={countryQuery.isLoading} loadingText="Country" />
      </FilterBar>
      <Table tableData={tableData} items={eventResultQuery.data || []} handleSelection={onSelectSurfer} loading={eventResultQuery.isLoading} />
    </Layout>
  )
}
