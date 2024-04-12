import { z } from 'zod'
import { api } from '@/utils/api'
import React, { useState } from 'react'
import { Gender } from '@prisma/client'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import FilterBar from '@/components/FilterBar'
import { windowSize } from '@/utils/windowSize'
import CardCountry from '@/components/CardCountry'
import { useQueryState } from 'next-usequerystate'
import { Country, Surfer } from '@/utils/interfaces'
import Table, { TableData } from '@/components/Table'
import ButtonSelectX from '@/components/ButtonSelectX'
import FilterSearchBar from '@/components/FilterSearchBar'
import { CountrySchema } from '@/server/api/routers/country'
import TableLink from '@/components/tableComponents/TableLink'
import CardCountryLoader from '@/components/loaders/CardCountryLoader'
import { BREAKPOINT, GENDEROPTIONS, YEAROPTIONS } from '@/utils/constants'

export default function CountryIndex() {
  const router = useRouter()
  const [year, setYear] = useQueryState('year')
  const [gender, setGender] = useQueryState('gender')
  const onSelectCountry = (item: Country) => router.push({ pathname: '/country/[countryId]/surfers', query: { countryId: item.slug } })
  const filters: z.infer<typeof CountrySchema> = {
    surferYear: Number(year) || undefined,
    gender: (gender as Gender | undefined) || undefined,
    eventStaus: 'COMPLETED',
  }

  const countryQuery = api.country.getManyIncSurfers.useQuery(filters)
  const getEventWins = (country: Country) => country.surfers.map((surfer: Surfer) => surfer.eventResults.length).reduce((a: number, b: any) => a + b, 0)
  const getWorldTitles = (country: Country) => country.surfers.map((surfer: Surfer) => surfer.tourResults.length).reduce((a: number, b: any) => a + b, 0)
  countryQuery.data?.sort((a: any, b: any) => getEventWins(b) - getEventWins(a))
  countryQuery.data?.sort((a: any, b: any) => getWorldTitles(b) - getWorldTitles(a))

  const tableData: TableData[] = [
    { name: 'Country', id: 'country', content: (item: Country) => <CardCountry country={item} />, loader: <CardCountryLoader /> },
    { name: 'World Titles', id: 'worldTitles', className: 'flex sm:table-cell ml-10 sm:ml-0 ', content: (item: Country) => <div className="table-item">{getWorldTitles(item)}</div> }, //{getWorldTitles(item)}
    { name: 'CT. Event Wins', id: 'eventWins', content: (item: Country) => <div className="table-item">{getEventWins(item)}</div> },
    { name: '', id: 'link', className: 'w-px', content: () => <TableLink label="View Country" /> },
  ]
  if (windowSize().width! < BREAKPOINT.md) tableData.pop()
  if (windowSize().width! < BREAKPOINT.sm) tableData.pop()

  // SEARCH BAR
  const [showSearch, setShowSearch] = useState(false)
  const countryOptions = countryQuery.data?.map((country) => ({ label: country.name, value: country.slug, country: country }))
  const onCountrySearch = (slug: string) => router.push({ pathname: '/country/[countryId]/surfers', query: { countryId: slug } })

  return (
    <Layout title={'Country'}>
      <h1 className="header-1">Country</h1>
      <FilterBar className="justify-center">
        <ButtonSelectX className="border-r" placeHolder="Gender" value={gender != null ? gender : undefined} setValue={setGender} options={GENDEROPTIONS} loadingText="Gender" />
        <ButtonSelectX className="border-r" placeHolder="Year" value={year ? year : undefined} setValue={setYear} options={YEAROPTIONS} loadingText="Year" />
        <FilterSearchBar placeHolder="Search countries" showSearch={showSearch} setShowSearch={setShowSearch} searchOptions={countryOptions} handleSearch={onCountrySearch} loading={countryQuery.isLoading} searchType={'COUNTRY'} />
      </FilterBar>
      {showSearch && <div className="absolute left-0 z-20 h-screen w-screen" />}
      <Table className={`${showSearch && 'opacity-50 blur-sm'} transition-200`} tableData={tableData} items={countryQuery.data || []} loading={countryQuery.isLoading} handleSelection={onSelectCountry} />
    </Layout>
  )
}
