import { z } from 'zod'
import { api } from '@/utils/api'
import React, { useState } from 'react'
import { Gender } from '@prisma/client'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import SubNavbar from '@/components/SubNavbar'
import FilterBar from '@/components/FilterBar'
import { windowSize } from '@/utils/windowSize'
import CardSurfer from '@/components/CardSurfer'
import Table, { TableData } from '@/components/Table'
import { SubheaderData } from '@/components/SubHeader'
import ButtonSelectX from '@/components/ButtonSelectX'
import { Country, Surfer } from '@/utils/interfaces'
import { genderFormat } from '@/utils/format/genderFormat'
import { BREAKPOINT, GENDER_OPTIONS } from '@/utils/constants'
import { queryTypes, useQueryState } from 'next-usequerystate'
import TableLink from '@/components/tableComponents/TableLink'
import { countrySurferStats } from '@/utils/stat/subHeaderStats'
import { surfersOrderBy } from '@/utils/function/getSurferSorted'
import { TourResultSchema } from '@/server/api/routers/tourResult'
import SubHeaderItem from '@/components/subHeaderComponents/subHeaderItem'
import SubHeaderCountry from '@/components/subHeaderComponents/subHeaderCountry'

export default function CountrySurfers() {
  const router = useRouter()
  const [statToggle, setStatToggle] = useState(false)
  const countryId = router.query.countryId as string
  const [year, setYear] = useQueryState('year', queryTypes.integer)
  const [gender, setGender] = useQueryState('gender')
  const handleSetYear = (value: string | null) => (value == null ? setYear(null) : setYear(Number(value)))
  const onSelectSurfer = (item: any) => router.push({ pathname: '/surfers/[surferId]/career', query: { surferId: item.slug } })

  const filters: z.infer<typeof TourResultSchema> = {
    countrySlug: countryId,
    year: Number(year) || undefined,
    gender: (gender as Gender | undefined) || undefined,
  }

  const surferQuery = api.surfer.getManyCountries.useQuery(filters, { enabled: !!countryId })
  const surferSorted = surfersOrderBy(surferQuery.isLoading ? undefined : (surferQuery.data as Surfer[]))
  const countryQuery = api.country.getOne.useQuery({ ...filters, eventStaus: 'COMPLETED' }, { enabled: !!countryId })
  const countrySurferStatQuery = api.countrySurferStat.getCountrySurfer.useQuery(filters, { enabled: !!countryId && !surferQuery.isLoading })
  const countrySurferStatAllQuery = api.countrySurferStat.getAll.useQuery(filters, { enabled: !!countryId && statToggle })
  const eventYearQuery = api.tour.getEventYears.useQuery({ gender: filters.gender, countrySlugEvent: filters.countrySlug, sortYear: 'desc' }, { enabled: !!countryId })
  const yearQuery = api.tour.getSurferYears.useQuery({ gender: filters.gender, countrySlugSurfer: filters.countrySlug, sortYear: 'desc' }, { enabled: !!countryId })
  const yearOptions = yearQuery.data?.map((tour) => ({ label: tour.year.toString(), value: tour.year }))

  const getSubHeaderData = () => {
    if (surferQuery.isLoading) return [{ content: <SubHeaderCountry country={undefined} />, primaryTab: true }, { content: <SubHeaderItem label="year" value={undefined} /> }]
    const subHeaderData: SubheaderData[] = [
      { content: <SubHeaderCountry country={countryQuery.data as Country | undefined} routePath={{ pathname: '/country', query: {} }} />, primaryTab: true },
      { content: <SubHeaderItem className="block sm:hidden" label="country" value={'Country'} active={false} routePath={{ pathname: '/country', query: {} }} /> },
      { content: <SubHeaderItem className="block sm:hidden" label="surfers" value={'Surfers'} active={true} /> },
    ]
    if (eventYearQuery.data?.length)
      subHeaderData.push({ content: <SubHeaderItem className="block sm:hidden" label="events" value={'Events'} active={false} routePath={{ pathname: '/country/[countryId]/events', query: { countryId: countryId } }} /> })
    if (gender) subHeaderData.push({ content: <SubHeaderItem className="hidden sm:block" label="gender" value={genderFormat(gender)} active={year ? false : true} /> })
    if (year) subHeaderData.push({ content: <SubHeaderItem className="hidden sm:block" label="year" value={year.toString()} active={true} /> })
    if (!gender && !year) subHeaderData.push({ content: <SubHeaderItem className="hidden sm:block" label="surfers" value={'All'} subvalue="Surfers" active={true} /> })
    return subHeaderData
  }

  const subNavItems = [
    { label: 'Country', active: false, router: { pathname: '/country', query: {} } },
    { label: 'Surfers', active: true },
  ]
  if (eventYearQuery.data?.length) subNavItems.push({ label: 'Events', active: false, router: { pathname: '/country/[countryId]/events', query: { countryId: countryId } } })

  const tableData: TableData[] = [
    { name: 'Surfer', id: 'surfer', content: (item: Surfer) => <CardSurfer surfer={item} /> },
    { name: 'World Titles', id: 'worldTitles', content: (item: Surfer) => <div className="table-item">{item.tourResults.length ? item.tourResults.length : '-'}</div> },
    { name: 'Event Wins', id: 'eventWins', content: (item: Surfer) => <div className="table-item">{item.eventResults.length ? item.eventResults.length : '-'}</div> },
    { name: '', id: 'link', className: 'w-px', content: () => <TableLink label="View Surfer" /> },
  ]
  if (windowSize().width! < BREAKPOINT.sm) tableData.pop()

  return (
    <Layout
      title={countryQuery.data?.name}
      subHeader={{
        subHeaderData: getSubHeaderData(),
        stats: countrySurferStats(countrySurferStatQuery.data, countrySurferStatAllQuery.data, statToggle),
        statsLoading: !statToggle ? countrySurferStatQuery.isLoading : countrySurferStatAllQuery.isLoading,
        statToggle: statToggle,
        setStatToggle: setStatToggle,
      }}
    >
      <SubNavbar items={subNavItems} className="hidden sm:block" />
      <FilterBar className="mt-8 justify-center sm:justify-start">
        <ButtonSelectX className="border-r" placeHolder="Gender" value={gender != null ? gender : undefined} setValue={setGender} options={GENDER_OPTIONS} loading={yearOptions ? false : true} loadingText="GENDER" />
        <ButtonSelectX placeHolder="Year" value={year ? year : undefined} setValue={handleSetYear} options={yearOptions} loading={yearOptions ? false : true} loadingText="YEAR" />
      </FilterBar>
      <Table tableData={tableData} items={surferSorted || []} loading={surferQuery.isLoading} handleSelection={onSelectSurfer} />
    </Layout>
  )
}
