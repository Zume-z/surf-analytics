import { z } from 'zod'
import React, { useEffect, useRef, useState } from 'react'
import { api } from '@/utils/api'
import { Gender } from '@prisma/client'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import FilterBar from '@/components/FilterBar'
import CardSurfer from '@/components/CardSurfer'
import { windowSize } from '@/utils/windowSize'
import ButtonSelect from '@/components/ButtonSelect'
import Table, { TableData } from '@/components/Table'
import { Country, Surfer, TourResult } from '@/utils/interfaces'
import TableLink from '@/components/tableComponents/TableLink'
import { queryTypes, useQueryState } from 'next-usequerystate'
import { TourResultSchema } from '@/server/api/routers/tourResult'
import CardSurferLoader from '@/components/loaders/CardSurferLoader'
import { BREAKPOINT, GENDEROPTIONS, POPULAR_SURFERBYSLUG, YEAROPTIONS } from '@/utils/constants'
import ButtonSelectSearchCountry from '@/components/ButtonSelectSearchCountry'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'

import { Command } from 'cmdk'
import Image from 'next/legacy/image'
import FilterSearchBar from '@/components/FilterSearchBar'

export default function Surfers() {
  const router = useRouter()
  const [countrySlug, setCountrySlug] = useQueryState('country')
  const [year, setYear] = useQueryState('year', queryTypes.integer.withDefault(new Date().getFullYear()))
  const [gender, setGender] = useQueryState('gender', queryTypes.string.withDefault('MALE'))
  const midSeasonCutLine = year == new Date().getFullYear() && !countrySlug ? (gender == 'FEMALE' ? 10 : 23) : undefined
  const updateYear = React.useCallback(async (value: string) => (await setCountrySlug(null), await setYear(parseInt(value))), [])
  const updateGender = React.useCallback(async (value: string) => (await setCountrySlug(null), await setGender(value)), [])
  const onSelectSurfer = (item: any) => router.push({ pathname: '/surfers/[surferId]/career', query: { surferId: item.surfer.slug } })

  const filters: z.infer<typeof TourResultSchema> = {
    sortSurferRank: 'asc',
    year: year || undefined,
    gender: gender as Gender | undefined,
    countrySlug: countrySlug || undefined,
  }

  const tourResultQuery = api.tourResult.getMany.useQuery(filters)
  const countryQuery = api.country.getOptionsBySurfer.useQuery({ gender: filters.gender, surferYear: filters.year })
  const countryOptions = countryQuery.data?.map((country) => ({ label: country.name, shortLabel: country.iso, value: country.slug, country: country as Country }))

  const tableData: TableData[] = [
    { name: `Championship Tour`, id: 'name', content: (item: TourResult) => <CardSurfer surfer={item.surfer} place={item.surferRank} showFirst={true} />, loader: <CardSurferLoader /> },
    { name: 'Points', id: 'points', content: (item: TourResult) => <div className="table-item">{item.surferPoints.toLocaleString('en-US')}</div> },
    { name: '', id: 'link', className: 'w-px', content: () => <TableLink label="View Surfer" /> },
  ]
  if (windowSize().width! < BREAKPOINT.sm) tableData.pop()

  // SEARCH BAR
  const [showSearch, setShowSearch] = useState(false)

  // Change query
  const surferOptionsQuery = api.surfer.getManyOptions.useQuery({})
  const surferOptions = surferOptionsQuery.data?.map((surfer) => ({ label: surfer.name, value: surfer.slug, surfer: surfer as Surfer }))
  const onSurferSearch = (slug: string) => router.push({ pathname: '/surfers/[surferId]/career', query: { surferId: slug } })

  return (
    <Layout title={'Surfers'}>
      <h1 className="header-1">Surfers</h1>
      <FilterBar className="justify-center">
        <ButtonSelect className="border-r" placeHolder={filters.gender} value={gender} setValue={updateGender} options={GENDEROPTIONS} loading={countryQuery.isLoading} loadingText="Gender" />
        <ButtonSelect className="border-r" placeHolder={year.toString()} value={year} setValue={updateYear} options={YEAROPTIONS} loading={countryQuery.isLoading} loadingText="Year" />
        <ButtonSelectSearchCountry className="border-r" placeHolder="Country" searchPlaceHolder="Search countries" value={countrySlug ?? undefined} setValue={setCountrySlug} options={countryOptions} loading={countryQuery.isLoading} loadingText="Country"/>
        <FilterSearchBar placeHolder='Search surfers' showSearch={showSearch} setShowSearch={setShowSearch} searchOptions={surferOptions} handleSearch={onSurferSearch} popularBySlug={POPULAR_SURFERBYSLUG} loading={surferOptionsQuery.isLoading} searchType={'SURFER'} />
      </FilterBar>
      {showSearch && <div className="absolute left-0 z-20 h-screen w-screen" />}
      <Table className={`${showSearch && 'opacity-50 blur-sm'} transition-200`} tableData={tableData} items={tourResultQuery.data || []} loading={tourResultQuery.isLoading} handleSelection={onSelectSurfer} cutOff={midSeasonCutLine} />
    </Layout> 
  ) // prettier-ignore
}
