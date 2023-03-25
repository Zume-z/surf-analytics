import { z } from 'zod'
import React, { useState } from 'react'
import { api } from '@/utils/api'
import { Gender } from '@prisma/client'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import FilterBar from '@/components/FilterBar'
import SubNavbar from '@/components/SubNavbar'
import CardEvent from '@/components/CardEvent'
import { windowSize } from '@/utils/windowSize'
import CardSurfer from '@/components/CardSurfer'
import { useQueryState } from 'next-usequerystate'
import { Country, Event } from '@/utils/interfaces'
import Table, { TableData } from '@/components/Table'
import { SubheaderData } from '@/components/SubHeader'
import { removeById } from '@/utils/format/removeById'
import ButtonSelectX from '@/components/ButtonSelectX'
import { EventSchema } from '@/server/api/routers/event'
import { genderFormat } from '@/utils/format/genderFormat'
import { eventYearSpan } from '@/utils/format/getYearSpan'
import { BREAKPOINT, GENDEROPTIONS } from '@/utils/constants'
import { CardEventStatus } from '@/components/CardEventStatus'
import { countryEventStats } from '@/utils/format/subHeaderStats'
import SubHeaderItem from '@/components/subHeaderComponents/subHeaderItem'
import TableItemEventDate from '@/components/tableComponents/TableEventDate'
import SubHeaderCountry from '@/components/subHeaderComponents/subHeaderCountry'

export default function CountryEvents() {
  const router = useRouter()
  const [statToggle, setStatToggle] = useState(false)

  const countryId = router.query.countryId as string
  const [year, setYear] = useQueryState('year')
  const [gender, setGender] = useQueryState('gender')
  const onSelectEvent = (item: Event) => (item.eventStatus == 'CANCELED' ? '' : router.push({ pathname: '/events/[eventId]/results', query: { eventId: item.slug } }))

  const filters: z.infer<typeof EventSchema> = {
    countrySlug: countryId,
    year: Number(year) || undefined,
    gender: (gender as Gender | undefined) || undefined,
    sortStartDate: 'desc',
    eventStatus: 'COMPLETED',
  }

  const countryQuery = api.country.getOneEvents.useQuery({ ...filters, eventYear: filters.year, eventStaus: 'COMPLETED' }, { enabled: !!countryId })
  const countryEventStatQuery = api.countryEventStat.getCountryEvents.useQuery({ countrySlug: countryId, year: filters.year, gender: filters.gender }, { enabled: !!countryId && !countryQuery.isLoading })
  const countryEventStatAllQuery = api.countryEventStat.getAll.useQuery({ countrySlug: countryId, year: filters.year, gender: filters.gender }, { enabled: !!countryId && statToggle })
  const yearQuery = api.tour.getEventYears.useQuery({ gender: filters.gender, countrySlugEvent: filters.countrySlug, sortYear: 'desc', eventStatus: 'COMPLETED' }, { enabled: !!countryId })
  const yearOptions = yearQuery.data?.map((tour) => ({ label: tour.year.toString(), value: tour.year }))

  const tableData: TableData[] = [
    { name: 'Event', id: 'event', content: (item: Event) => <CardEvent event={item} /> },
    { name: 'Date', id: 'date', content: (item: Event) => <TableItemEventDate event={item} showYear={true} /> },
    { name: 'Winner', id: 'winner', content: (item: Event) => (item.eventResults[0] ? <CardSurfer surfer={item.eventResults[0].surfer} /> : <div> - </div>) },
    { name: '', id: 'link', className: 'w-px', content: (item: Event) => <div>{CardEventStatus(item)}</div> },
  ]
  if (windowSize().width! < BREAKPOINT.lg) removeById(tableData, 'winner')
  if (windowSize().width! < BREAKPOINT.md) tableData.pop()

  const getSubHeaderData = () => {
    if (countryQuery.isLoading) return [{ content: <SubHeaderCountry country={undefined} />, primaryTab: true }, { content: <SubHeaderItem label="year" value={undefined} /> }]
    const subHeaderData: SubheaderData[] = [
      { content: <SubHeaderCountry country={countryQuery.data as Country | undefined} routePath={{ pathname: '/country', query: {} }} />, primaryTab: true },
      { content: <SubHeaderItem className="block sm:hidden" label="country" value={'Country'} active={false} routePath={{ pathname: '/country', query: {} }} /> },
      { content: <SubHeaderItem className="block sm:hidden" label="surfers" value={'Surfers'} active={false} routePath={{ pathname: '/country/[countryId]/surfers', query: { ...router.query } }} /> },
      { content: <SubHeaderItem className="block sm:hidden" label="events" value={'Events'} active={true} routePath={{ pathname: '/country/[countryId]/events', query: { ...router.query } }} /> },
    ]
    if (gender) subHeaderData.push({ content: <SubHeaderItem className="hidden sm:block" label="gender" value={genderFormat(gender)} active={year ? false : true} /> })
    if (year) subHeaderData.push({ content: <SubHeaderItem className="hidden sm:block" label="year" value={year.toString()} active={true} /> })
    if (!gender && !year) subHeaderData.push({ content: <SubHeaderItem className="hidden sm:block" label="events" value={eventYearSpan(countryQuery.data?.events)} subvalue="Events" active={true} /> })
    return subHeaderData
  }

  const subNavItems = [
    { label: 'Country', active: false, router: { pathname: '/country', query: {} } },
    { label: 'Surfers', active: false, router: { pathname: '/country/[countryId]/surfers', query: { countryId: filters.countrySlug } } },
    { label: 'Events', active: true },
  ]

  return (
    <Layout
      title={countryQuery.data?.name}
      subHeader={{
        subHeaderData: getSubHeaderData(),
        stats: countryEventStats(countryEventStatQuery.data, countryEventStatAllQuery.data, statToggle),
        statsLoading: !statToggle ? countryEventStatQuery.isLoading : countryEventStatAllQuery.isLoading,
        statToggle: statToggle,
        setStatToggle: setStatToggle,
      }}
    >
      <SubNavbar items={subNavItems} className="hidden sm:block" />
      <FilterBar className="mt-8 justify-center sm:justify-start">
        <ButtonSelectX className="border-r" placeHolder="Gender" value={gender != null ? gender : undefined} setValue={setGender} options={GENDEROPTIONS} loading={yearOptions ? false : true} loadingText="Gender" />
        <ButtonSelectX placeHolder="Year" value={year ? year : undefined} setValue={setYear} options={yearOptions} loading={yearOptions ? false : true} loadingText="Year" />
      </FilterBar>
      <Table tableData={tableData} items={countryQuery.data?.events || []} loading={countryQuery.isLoading} handleSelection={onSelectEvent} />
    </Layout>
  )
}
