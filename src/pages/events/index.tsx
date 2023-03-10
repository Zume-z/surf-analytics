import { z } from 'zod'
import React from 'react'
import { api } from '@/utils/api'
import { useRouter } from 'next/router'
import { Gender } from '@prisma/client'
import Layout from '@/components/Layout'
import { Event } from '@/utils/interfaces'
import CardEvent from '@/components/CardEvent'
import FilterBar from '@/components/FilterBar'
import { windowSize } from '@/utils/windowSize'
import CardSurfer from '@/components/CardSurfer'
import ButtonSelect from '@/components/ButtonSelect'
import Table, { TableData } from '@/components/Table'
import { removeById } from '@/utils/format/removeById'
import { EventSchema } from '@/server/api/routers/event'
import { breakPoint, genderOptions } from '@/utils/constants'
import { CardEventStatus } from '@/components/CardEventStatus'
import { queryTypes, useQueryState } from 'next-usequerystate'
import ButtonSelectSearch from '@/components/ButtonSelectSearch'
import CardEventLoader from '@/components/loaders/CardEventLoader'
import TableItemEventDate from '@/components/tableComponents/TableEventDate'

export default function Events() {
  const router = useRouter()
  const [countrySlug, setCountrySlug] = useQueryState('country')
  const [year, setYear] = useQueryState('year', queryTypes.integer.withDefault(new Date().getFullYear()))
  const [gender, setGender] = useQueryState('gender', queryTypes.string.withDefault('MALE'))
  const onSelectEvent = (item: Event) => item.eventStatus == 'COMPLETED' && router.push({ pathname: '/events/[eventId]/results', query: { eventId: item.slug } })
  const updateYear = React.useCallback(async (value: string) => {
    await setYear(parseInt(value))
    await setCountrySlug(null)
  }, [])
  const updateGender = React.useCallback(async (value: string) => {
    await setCountrySlug(null)
    await setGender(value)
  }, [])

  const filters: z.infer<typeof EventSchema> = {
    sortStartDate: 'asc',
    year: year || undefined,
    countrySlug: countrySlug || undefined,
    gender: gender as Gender | undefined,
  }

  const eventQuery = api.event.getMany.useQuery(filters)
  const countryQuery = api.country.getManyByEvent.useQuery({ gender: filters.gender, eventYear: filters.year })
  const countryOptions = countryQuery.data?.map((country) => ({ label: country.name, value: country.slug }))
  const yearQuery = api.tour.getYears.useQuery({ gender: filters.gender, sortYear: 'desc' })
  const yearOptions = yearQuery.data?.map((year: any) => ({ label: year.year.toString(), value: year.year }))

  const tableData: TableData[] = [
    { name: 'Event', id: 'event', content: (item: Event) => <CardEvent event={item} />, loader: <CardEventLoader /> },
    { name: 'Date', id: 'date', content: (item: Event) => <TableItemEventDate event={item} /> },
    { name: 'Winner', id: 'winner', content: (item: Event) => (item.eventResults[0] ? <CardSurfer surfer={item.eventResults[0].surfer} /> : <div> - </div>) },
    { name: '', id: 'link', className: 'w-px', content: (item: Event) => <div>{CardEventStatus(item)}</div> },
  ]
  if (windowSize().width! < breakPoint.lg) removeById(tableData, 'winner')
  if (windowSize().width! < breakPoint.md) tableData.pop()

  return (
    <Layout title={'Events'}>
      <h1 className="py-8 text-center text-3xl font-bold">Events</h1>
      <FilterBar className="justify-center">
        <ButtonSelect className='border-r' placeHolder={gender} value={gender} setValue={updateGender} options={genderOptions} loading={yearQuery.isLoading} loadingText="Gender" />
        <ButtonSelect className='border-r' placeHolder={year.toString()} value={year} setValue={updateYear} options={yearOptions} loading={yearQuery.isLoading} loadingText="Year" />
        <ButtonSelectSearch placeHolder="Country" searchPlaceHolder="Search Countries" value={countrySlug ?? undefined} setValue={setCountrySlug} options={countryOptions} loading={countryQuery.isLoading} loadingText="Country" />
      </FilterBar>
      <Table tableData={tableData} items={eventQuery.data || []} handleSelection={onSelectEvent} loading={eventQuery.isLoading} />
    </Layout>
  )
}
