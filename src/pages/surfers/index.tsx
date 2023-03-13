import { z } from 'zod'
import React from 'react'
import { api } from '@/utils/api'
import { Gender } from '@prisma/client'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import FilterBar from '@/components/FilterBar'
import { TourResult } from '@/utils/interfaces'
import CardSurfer from '@/components/CardSurfer'
import { windowSize } from '@/utils/windowSize'
import ButtonSelect from '@/components/ButtonSelect'
import Table, { TableData } from '@/components/Table'
import { breakPoint, genderOptions } from '@/utils/constants'
import { queryTypes, useQueryState } from 'next-usequerystate'
import ButtonSelectSearch from '@/components/ButtonSelectSearch'
import { TourResultSchema } from '@/server/api/routers/tourResult'
import CardSurferLoader from '@/components/loaders/CardSurferLoader'

export default function Surfers() {
  const router = useRouter()
  const [countrySlug, setCountrySlug] = useQueryState('country')
  const [year, setYear] = useQueryState('year', queryTypes.integer.withDefault(new Date().getFullYear()))
  const [gender, setGender] = useQueryState('gender', queryTypes.string.withDefault('MALE'))

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
  const countryQuery = api.country.getManyBySurfer.useQuery({ gender: filters.gender, surferYear: filters.year })
  const countryOptions = countryQuery.data?.map((country) => ({ label: country.name, value: country.slug }))
  const yearQuery = api.tour.getYears.useQuery({ gender: filters.gender, sortYear: 'desc' })
  const yearOptions = yearQuery.data?.map((tour) => ({ label: tour.year.toString(), value: tour.year }))
  const onSelectSurfer = (item: any) => router.push({ pathname: '/surfers/[surferId]/career', query: { surferId: item.surfer.slug } })
  const tableData: TableData[] = [
    { name: `Championship Tour`, id: 'name', content: (item: TourResult) => <CardSurfer surfer={item.surfer} place={item.surferRank} />, loader: <CardSurferLoader /> },
    { name: 'Points', id: 'points', content: (item: TourResult) => <div className="table-item">{item.surferPoints.toLocaleString('en-US')}</div> },
    { name: '', id: 'link', className: 'w-px', content: () => <div className="text-blue-base">View Surfer</div> },
  ]
  if (windowSize().width! < breakPoint.sm) tableData.pop()

  return (
    <Layout title={'Surfers'}>
      <h1 className="py-8 text-center text-3xl font-bold">Surfers</h1>
      <FilterBar className=" justify-center">
        <ButtonSelect className="border-r" placeHolder={filters.gender} value={gender} setValue={updateGender} options={genderOptions} loading={yearQuery.isLoading} loadingText="Gender" />
        <ButtonSelect className="border-r" placeHolder={year.toString()} value={year} setValue={updateYear} options={yearOptions} loading={yearQuery.isLoading} loadingText="Year" />
        <ButtonSelectSearch placeHolder="Country" searchPlaceHolder="Search countries" value={countrySlug ?? undefined} setValue={setCountrySlug} options={countryOptions} loading={countryQuery.isLoading} loadingText="Country" />
      </FilterBar>

      <Table tableData={tableData} items={tourResultQuery.data || []} loading={tourResultQuery.isLoading} handleSelection={onSelectSurfer} />
    </Layout>
  )
}
