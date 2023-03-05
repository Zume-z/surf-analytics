import { z } from 'zod'
import React from 'react'
import { api } from '@/utils/api'
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
import { CountrySchema } from '@/server/api/routers/country'
import { breakPoint, genderOptions } from '@/utils/constants'
import CardCountryLoader from '@/components/loaders/CardCountryLoader'


export default function CountryIndex() {
  const router = useRouter()
  const [year, setYear] = useQueryState('year')
  const [gender, setGender] = useQueryState('gender')
  const onSelectCountry = (item: any) => router.push({ pathname: '/country/[countryId]/surfers', query: { countryId: item.slug } })
  const filters: z.infer<typeof CountrySchema> = {
    surferYear: Number(year) || undefined,
    gender: (gender as Gender | undefined) || undefined,
    eventStaus: 'COMPLETED'
  }

  const countryQuery = api.country.getManyIncSurfers.useQuery(filters)
  const yearQuery = api.tour.getYears.useQuery({ gender: filters.gender, sortYear: 'desc' })
  const yearOptions = yearQuery.data?.map((tour) => ({ label: tour.year.toString(), value: tour.year }))
  const getEventWins = (country: Country) => country.surfers.map((surfer: Surfer) => surfer.eventResults.length).reduce((a: number, b: any) => a + b, 0)
  const getWorldTitles = (country: Country) => country.surfers.map((surfer: Surfer) => surfer.tourResults.length).reduce((a: number, b: any) => a + b, 0)

  const tableData: TableData[] = [
    { name: 'Country', id: 'country', content: (item: Country) => <CardCountry country={item} />, loader: <CardCountryLoader /> },
    { name: 'World Titles', id: 'worldTitles', className: 'flex sm:table-cell  ml-10 sm:ml-0 ', content: (item: Country) => <div className="table-item">{getWorldTitles(item)}</div> }, //{getWorldTitles(item)}
    { name: 'CT. Event Wins', id: 'eventWins', content: (item: Country) => <div className="table-item">{getEventWins(item)}</div> },
    { name: '', id: 'link', className: 'w-px', content: () => <div className="text-blue-base">View Country</div> },
  ]
  if (windowSize().width! < breakPoint.md) tableData.pop()
  if (windowSize().width! < breakPoint.sm) tableData.pop()

  return (
    <Layout title={'Country'}>
      <h1 className="py-8 text-center text-3xl font-bold">Country</h1>
      <FilterBar className="justify-center">
        <ButtonSelectX placeHolder="Gender" value={gender != null ? gender : undefined} setValue={setGender} options={genderOptions} loading={yearOptions ? false : true} loadingText="Gender" />
        <ButtonSelectX placeHolder="Year" value={year ? year : undefined} setValue={setYear} options={yearOptions} loading={yearOptions ? false : true} loadingText="Year" />
      </FilterBar>
      <Table tableData={tableData} items={countryQuery.data || []} loading={countryQuery.isLoading} handleSelection={onSelectCountry} />
    </Layout>
  )
}
