import { z } from 'zod'
import { api } from '@/utils/api'
import { useRouter } from 'next/router'
import { Gender } from '@prisma/client'
import Layout from '@/components/Layout'
import React, { useEffect } from 'react'
import CardEvent from '@/components/CardEvent'
import FilterBar from '@/components/FilterBar'
import { windowSize } from '@/utils/windowSize'
import CardSurfer from '@/components/CardSurfer'
import { Country, Event, Tour } from '@/utils/interfaces'
import ButtonSelect from '@/components/ButtonSelect'
import Table, { TableData } from '@/components/Table'
import { removeById } from '@/utils/format/removeById'
import { EventSchema } from '@/server/api/routers/event'
import { CardEventStatus } from '@/components/CardEventStatus'
import { queryTypes, useQueryState } from 'next-usequerystate'
import CardEventLoader from '@/components/loaders/CardEventLoader'
import ButtonSelectSearch from '@/components/ButtonSelectSearch'
import { BREAKPOINT, GENDEROPTIONS, YEAROPTIONS } from '@/utils/constants'
import TableItemEventDate from '@/components/tableComponents/TableEventDate'
import ButtonSelectSearchCountry from '@/components/ButtonSelectSearchCountry'

export default function Events() {
  const router = useRouter()
  const [countrySlug, setCountrySlug] = useQueryState('country')
  const [year, setYear] = useQueryState('year', queryTypes.integer)
  const [gender, setGender] = useQueryState('gender', queryTypes.string.withDefault('MALE'))
  const [locationSlug, setLocationSlug] = useQueryState('location')
  const updateYear = React.useCallback(async (value: string | null) => await setYear(value ? parseInt(value) : null), [])
  const updateGender = React.useCallback(async (value: string) => (await setCountrySlug(null), await setLocationSlug(null), await setGender(value)), [])
  const updateLocation = React.useCallback(async (value: string | null) => await setLocationSlug(value), [])
  const onSelectEvent = (item: Event) => item.eventStatus == 'COMPLETED' && router.push({ pathname: '/events/[eventId]/results', query: { eventId: item.slug } })

  const filters: z.infer<typeof EventSchema> = {
    year: year || undefined,
    sortStartDate: year ? 'asc' : 'desc',
    countrySlug: countrySlug || undefined,
    locationSlug: locationSlug || undefined,
    gender: gender as Gender | undefined,
  }

  const eventQuery = api.event.getMany.useQuery({ ...filters })
  const locationQuery = api.location.getMany.useQuery({ gender: filters.gender, sortName: 'asc', countrySlug: filters.countrySlug, year: filters.year })
  const locationOptions = locationQuery.data?.map((location) => ({ label: location.eventName!, value: location.slug }))
  const countryQuery = api.country.getOptionByEvent.useQuery({ gender: filters.gender, eventYear: filters.year, eventLocationSlug: filters.locationSlug })
  const countryOptions = countryQuery.data?.map((country) => ({ label: country.name, value: country.slug, country: country as Country }))
  const yearQuery = api.tour.getEventYears.useQuery({ locationSlugEvent: filters.locationSlug, countrySlugEvent: filters.countrySlug, sortYear: 'desc', gender: filters.gender })
  const yearOptions = yearQuery.data?.map((tour: any) => ({ label: tour.year.toString(), value: tour.year.toString() }))

  const tableData: TableData[] = [
    { name: 'Event', id: 'event', content: (item: Event) => <CardEvent event={item} />, loader: <CardEventLoader /> },
    { name: 'Date', id: 'date', content: (item: Event) => <TableItemEventDate event={item} showYear={!year} /> },
    { name: 'Winner', id: 'winner', content: (item: Event) => (item.eventResults[0] ? <CardSurfer surfer={item.eventResults[0].surfer} /> : <div> - </div>) },
    { name: '', id: 'link', className: 'w-px', content: (item: Event) => <div>{CardEventStatus(item)}</div> },
  ]
  if (windowSize().width! < BREAKPOINT.lg) removeById(tableData, 'winner')
  if (windowSize().width! < BREAKPOINT.md) tableData.pop()

  return (
    <Layout title={'Events'}>
      <h1 className="header-1">Events</h1>
      <FilterBar className="justify-center">
        <ButtonSelect className="border-r" placeHolder={gender} value={gender} setValue={updateGender} options={GENDEROPTIONS} loading={countryQuery.isLoading} loadingText="Gender" />
        <ButtonSelectSearch className="border-r" placeHolder="Year" searchPlaceHolder="Search years" value={year ?? undefined} setValue={updateYear} options={yearOptions} loading={yearQuery.isLoading} loadingText="Year" />
        <ButtonSelectSearchCountry className="border-r" placeHolder="Country" searchPlaceHolder="Search countries" value={countrySlug ?? undefined} setValue={setCountrySlug} options={countryOptions} loading={countryQuery.isLoading} loadingText="Country"/> 
        <ButtonSelectSearch placeHolder="Location" searchPlaceHolder="Search locations" value={locationSlug ?? undefined} setValue={updateLocation} options={locationOptions} loading={locationQuery.isLoading} loadingText="Location" />
      </FilterBar>
      <Table tableData={tableData} items={eventQuery.data || []} handleSelection={onSelectEvent} loading={eventQuery.isLoading} />
    </Layout>
  ) // prettier-ignore
}
