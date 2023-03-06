import { z } from 'zod'
import { api } from '@/utils/api'
import Table from '@/components/Table'
import { Gender } from '@prisma/client'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import React, { useEffect } from 'react'
import SubNavbar from '@/components/SubNavbar'
import FilterBar from '@/components/FilterBar'
import { windowSize } from '@/utils/windowSize'
import CardSurfer from '@/components/CardSurfer'
import { SubheaderData } from '@/components/SubHeader'
import ButtonSelectX from '@/components/ButtonSelectX'
import { Country, TourResult } from '@/utils/interfaces'
import { genderFormat } from '@/utils/format/genderFormat'
import { breakPoint, genderOptions } from '@/utils/constants'
import { queryTypes, useQueryState } from 'next-usequerystate'
import { TourResultSchema } from '@/server/api/routers/tourResult'
import { countrySurferStats } from '@/utils/format/subHeaderStats'
import SubHeaderItem from '@/components/subHeaderComponents/subHeaderItem'
import SubHeaderCountry from '@/components/subHeaderComponents/subHeaderCountry'

export default function CountrySurfers() {
  const router = useRouter()
  const countryId = router.query.countryId as string
  const [year, setYear] = useQueryState('year', queryTypes.integer)
  const [gender, setGender] = useQueryState('gender')
  const handleSetYear = (value: string | null) => setYear(Number(value))
  const onSelectSurfer = (item: any) => router.push({ pathname: '/surfers/[surferId]/career', query: { surferId: item.surfer.slug } })
  useEffect(() => void setYear(year || new Date().getFullYear()), [])


  const filters: z.infer<typeof TourResultSchema> = {
    countrySlug: countryId,
    year: Number(year) || undefined,
    gender: (gender as Gender | undefined) || undefined,
  }
  const tourResultQuery = api.tourResult.getManyDistinct.useQuery({ ...filters, sortSurferRank: 'asc' }, { enabled: !!countryId })
  const countryQuery = api.country.getOne.useQuery({ ...filters, eventStaus: 'COMPLETED' }, { enabled: !!countryId })
  const countrySurferStatQuery = api.countrySurferStat.getCountrySurfer.useQuery(filters, { enabled: !!countryId })
  const yearQuery = api.tour.getYears.useQuery({ gender: filters.gender, countrySlugSurfer: filters.countrySlug, sortYear: 'desc' }, { enabled: !!countryId })
  const eventYearQuery = api.tour.getYears.useQuery({ gender: filters.gender, countrySlugEvent: filters.countrySlug, sortYear: 'desc' }, { enabled: !!countryId })
  const yearOptions = yearQuery.data?.map((tour) => ({ label: tour.year.toString(), value: tour.year }))
  if (tourResultQuery.data?.length === 0) setYear(year && yearQuery.data ? yearQuery.data[0]?.year! : null)

  const subNavItems = [
    { label: 'Country', active: false, router: { pathname: '/country', query: {} } },
    { label: 'Surfers', active: true },
  ]
  if (eventYearQuery.data?.length) subNavItems.push({ label: 'Events', active: false, router: { pathname: '/country/[countryId]/events', query: { countryId: countryId } } })

  const tableData = [
    { name: 'Surfer', id: 'surfer', content: (item: TourResult) => <CardSurfer surfer={item.surfer} /> },
    { name: 'Rank', id: 'rank', content: (item: TourResult) => <div className="table-item">{year ? item.surferRank : '-'}</div> },
    { name: 'Points', id: 'points', content: (item: TourResult) => <div className="table-item">{year && item.surferPoints ? item.surferPoints.toLocaleString('en-US') : '-'}</div> },
    { name: '', id: 'link', width: 'w-px', content: () => <div className="text-blue-base">View Surfer</div> },
  ]
  if (windowSize().width! < breakPoint.sm) tableData.pop()

  const getSubHeaderData = () => {
    if (tourResultQuery.isLoading) return [{ content: <SubHeaderCountry country={undefined} />, primaryTab: true }, { content: <SubHeaderItem label="year" value={undefined} /> }]
    const subHeaderData: SubheaderData[] = [
      { content: <SubHeaderCountry country={countryQuery.data as Country | undefined} routePath={{ pathname: '/country', query: {} }} />, primaryTab: true },
      { content: <SubHeaderItem className="block sm:hidden" label="country" value={'Country'} active={false} routePath={{ pathname: '/country', query: {} }} /> },
      { content: <SubHeaderItem className="block sm:hidden" label="surfers" value={'Surfers'} active={true} /> },
    ]
    if (eventYearQuery.data?.length)
      subHeaderData.push({ content: <SubHeaderItem className="block sm:hidden" label="events" value={'Events'} active={false} routePath={{ pathname: '/country/[countryId]/events', query: { countryId: countryId } }} /> })
    if (gender) subHeaderData.push({ content: <SubHeaderItem className="hidden sm:block" label="gender" value={genderFormat(gender)} active={year ? false : true} /> })
    if (year) subHeaderData.push({ content: <SubHeaderItem className="hidden sm:block" label="year" value={year.toString()} active={true} /> })
    if (!gender && !year) subHeaderData.push({ content: <SubHeaderItem className="hidden sm:block" label="surfers" value="All" subvalue="Surfers" active={true} /> })
    return subHeaderData
  }

  return (
    <Layout title={countryQuery.data?.name} subHeader={{ subHeaderData: getSubHeaderData(), stats: countrySurferStats(countrySurferStatQuery.data), statsLoading: countrySurferStatQuery.isLoading }}>
      <SubNavbar items={subNavItems} className="hidden sm:block" />
      <FilterBar className="mt-8 justify-center sm:justify-start">
        <ButtonSelectX placeHolder="GENDER" value={gender != null ? gender : undefined} setValue={setGender} options={genderOptions} loading={yearOptions ? false : true} loadingText="GENDER" />
        <ButtonSelectX placeHolder="YEAR" value={year ? year : undefined} setValue={handleSetYear} options={yearOptions} loading={yearOptions ? false : true} loadingText="YEAR" />
      </FilterBar>
      <Table tableData={tableData} items={tourResultQuery.data || []} loading={tourResultQuery.isLoading} handleSelection={onSelectSurfer} />
    </Layout>
  )
}
