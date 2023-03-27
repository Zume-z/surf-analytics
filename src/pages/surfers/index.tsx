import { z } from 'zod'
import React from 'react'
import { api } from '@/utils/api'
import { Gender } from '@prisma/client'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import FilterBar from '@/components/FilterBar'
import { Country, TourResult } from '@/utils/interfaces'
import CardSurfer from '@/components/CardSurfer'
import { windowSize } from '@/utils/windowSize'
import ButtonSelect from '@/components/ButtonSelect'
import Table, { TableData } from '@/components/Table'
import { queryTypes, useQueryState } from 'next-usequerystate'
import ButtonSelectSearch from '@/components/ButtonSelectSearch'
import { TourResultSchema } from '@/server/api/routers/tourResult'
import CardSurferLoader from '@/components/loaders/CardSurferLoader'
import { BREAKPOINT, GENDEROPTIONS, YEAROPTIONS } from '@/utils/constants'
import TableLink from '@/components/tableComponents/TableLink'
import ButtonSelectSearchCountry from '@/components/ButtonSelectSearchCountry'

export default function Surfers() {
  const router = useRouter()
  const [countrySlug, setCountrySlug] = useQueryState('country')
  const [year, setYear] = useQueryState('year', queryTypes.integer.withDefault(new Date().getFullYear()))
  const [gender, setGender] = useQueryState('gender', queryTypes.string.withDefault('MALE'))
  const midSeasonCutLine = year == new Date().getFullYear() && !countrySlug ? (gender == 'FEMALE' ? 10 : 23) : undefined

  const updateYear = React.useCallback(async (value: string) => {
    await setCountrySlug(null)
    await setYear(parseInt(value))
  }, [])
  const updateGender = React.useCallback(async (value: string) => {
    await setCountrySlug(null)
    await setGender(value)
  }, [])

  const filters: z.infer<typeof TourResultSchema> = {
    sortSurferRank: 'asc',
    year: year || undefined,
    gender: gender as Gender | undefined,
    countrySlug: countrySlug || undefined,
  }

  const tourResultQuery = api.tourResult.getMany.useQuery(filters)
  const countryQuery = api.country.getOptionsBySurfer.useQuery({ gender: filters.gender, surferYear: filters.year })
  const countryOptions = countryQuery.data?.map((country) => ({ label: country.name, value: country.slug, country: country as Country }))
  const onSelectSurfer = (item: any) => router.push({ pathname: '/surfers/[surferId]/career', query: { surferId: item.surfer.slug } })

  const tableData: TableData[] = [
    { name: `Championship Tour`, id: 'name', content: (item: TourResult) => <CardSurfer surfer={item.surfer} place={item.surferRank} showFirst={true} />, loader: <CardSurferLoader /> },
    { name: 'Points', id: 'points', content: (item: TourResult) => <div className="table-item">{item.surferPoints.toLocaleString('en-US')}</div> },
    { name: '', id: 'link', className: 'w-px', content: () => <TableLink label="View Surfer" /> },
  ]
  if (windowSize().width! < BREAKPOINT.sm) tableData.pop()

  return (
    <Layout title={'Surfers'}>
      <h1 className="header-1">Surfers</h1>
      <FilterBar className=" justify-center">
        <ButtonSelect className="border-r" placeHolder={filters.gender} value={gender} setValue={updateGender} options={GENDEROPTIONS} loading={countryQuery.isLoading} loadingText="Gender" />
        <ButtonSelect className="border-r" placeHolder={year.toString()} value={year} setValue={updateYear} options={YEAROPTIONS} loading={countryQuery.isLoading} loadingText="Year" />
        <ButtonSelectSearchCountry placeHolder="Country" searchPlaceHolder="Search countries" value={countrySlug ?? undefined} setValue={setCountrySlug} options={countryOptions} loading={countryQuery.isLoading} loadingText="Country" />
      </FilterBar>

      <Table tableData={tableData} items={tourResultQuery.data || []} loading={tourResultQuery.isLoading} handleSelection={onSelectSurfer} cutOff={midSeasonCutLine} />
    </Layout>
  )
}
