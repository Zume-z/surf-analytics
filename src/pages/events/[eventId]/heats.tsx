import { z } from 'zod'
import React, { useState } from 'react'
import { api } from '@/utils/api'
import Table from '@/components/Table'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import FilterBar from '@/components/FilterBar'
import SubNavbar from '@/components/SubNavbar'
import TableHeat from '@/components/TableHeat'
import { Event, Heat } from '@/utils/interfaces'
import { useQueryState } from 'next-usequerystate'
import { HeatSchema } from '@/server/api/routers/heat'
import ButtonSelectSearch from '@/components/ButtonSelectSearch'
import { eventResultStats } from '@/utils/format/subHeaderStats'
import SubHeaderItem from '@/components/subHeaderComponents/subHeaderItem'
import SubHeaderEvent from '@/components/subHeaderComponents/subHeaderEvent'
import { getHeatTableRows, getHeatTableBlocks } from '@/utils/format/heatTableFormat'

export default function EventHeats() {
  const router = useRouter()
  const [statToggle, setStatToggle] = useState(false)
  const [surferSlug, setSurferSlug] = useQueryState('surfer')
  const [heatRound, setHeatRound] = useQueryState('heatRound')
  const updateSurfer = React.useCallback(async (value: string | null) => (await setSurferSlug(value), await setHeatRound(null)), [])

  const filters: z.infer<typeof HeatSchema> = {
    sortRoundNumber: 'asc',
    sortHeatNumber: 'asc',
    surferSlug: surferSlug || undefined,
    heatRound: heatRound || undefined,
    eventSlug: router.query.eventId as string,
  }

  const heatQuery = api.heat.getMany.useQuery(filters)
  const eventQuery: any = api.event.getSurferOptionsByEvent.useQuery({ slug: filters.eventSlug as string }, { enabled: !!filters.eventSlug })
  const surferQuery = api.surfer.getName.useQuery({ slug: filters.surferSlug }, { enabled: !!filters.surferSlug })
  const eventStatQuery = api.eventStat.getResult.useQuery({ eventSlug: filters.eventSlug as string }, { enabled: !!filters.eventSlug && !heatQuery.isLoading })
  const eventStatAllQuery = api.eventStat.getAll.useQuery({ eventSlug: filters.eventSlug as string }, { enabled: !!filters.eventSlug && statToggle })
  const tableDataRows = getHeatTableRows(heatQuery.data as Heat[] | undefined)
  const tableDataBlocks = getHeatTableBlocks(heatQuery.data as Heat[] | undefined, eventQuery.data?.wavePoolEvent)
  const onSelectHeat = (item: Heat) => {item.heatStatus != 'CANCELED' && router.replace({ pathname: '/events/[eventId]/waves', query: { ...router.query, heatRound: item.heatRound, heatNumber: item.heatNumber } })} //prettier-ignore

  const surferOptions =
    eventQuery.data?.eventResults &&
    eventQuery.data?.eventResults.map((eventResult: any) => {
      return { label: eventResult.surfer.name, value: eventResult.surfer.slug }
    })

  // Export to utils
  const getHeatRoundOptions = () => {
    if (heatQuery.isLoading) return undefined
    const heatRounds = heatQuery.data?.map((heat: any) => heat.heatRound)
    const uniqueHeatRounds = [...new Set(heatRounds)]
    return uniqueHeatRounds.map((heatRound: any) => ({ label: heatRound, value: heatRound }))
  }
  const heatRoundOptions = getHeatRoundOptions() || undefined

  const getSubheaderData = () => {
    if (heatQuery.isLoading) return [{ content: <SubHeaderEvent event={undefined} />, primaryTab: true }, { content: <SubHeaderItem label="year" value={undefined} /> }, { content: <SubHeaderItem label="heats" value={undefined} /> }, { content: <SubHeaderItem className='sm:hidden' label="champions" value={undefined} /> }] //prettier-ignore
    const subHeaderData = [
      { content: <SubHeaderEvent event={eventQuery.data as Event | undefined} routePath={{ pathname: '/events/[eventId]/results', query: { eventId: filters.eventSlug } }} />, primaryTab: true },
      { content: <SubHeaderItem className="hidden sm:block" label="year" value={eventQuery.data?.tour.year} subvalue="Events" routePath={{ pathname: '/events', query: {} }} loading={eventQuery.isLoading} /> },
      { content: <SubHeaderItem className='sm:hidden' label="results" value="All" subvalue="Results" active={false} routePath={{ pathname: '/events/[eventId]/results', query: { eventId: filters.eventSlug } }} /> }, //prettier-ignore
      { content: <SubHeaderItem className="sm:hidden" label="heats" value="All" subvalue="Heats" active={true} /> },
      { content: <SubHeaderItem className="sm:hidden" label="Past Champions" value="All" subvalue="Past Champions" active={false} loading={eventQuery.isLoading} routePath={{ pathname: '/events/[eventId]/champions', query: { eventId: filters.eventSlug , location: eventQuery.data?.locationSlug } }} /> }, //prettier-ignore
    ]
    if (surferSlug) subHeaderData.push({ content: <SubHeaderItem className="hidden sm:block" label="surfer" value={surferQuery.data?.name} active={heatRound ? false : true} /> })
    if (heatRound) subHeaderData.push({ content: <SubHeaderItem className="hidden sm:block" label="round" value={heatRound} active={true} /> })
    if (!surferSlug && !heatRound) subHeaderData.push({ content: <SubHeaderItem className="hidden sm:block" label="heats" value="All" subvalue="Heats" active={true} /> })
    return subHeaderData
  }

  const subNavItems = [
    { label: 'Results', active: false, router: { pathname: '/events/[eventId]/results', query: { eventId: filters.eventSlug } } },
    { label: 'Heats', active: true },
    { label: 'Past Champions', active: false, router: { pathname: '/events/[eventId]/champions', query: { eventId: filters.eventSlug, location: eventQuery.data?.locationSlug } } },
  ]

  return (
    <Layout
      title={eventQuery.data?.name}
      subHeader={{
        subHeaderData: getSubheaderData(),
        stats: eventResultStats(eventStatQuery.data, eventStatAllQuery.data, statToggle),
        statsLoading: !statToggle ? eventStatQuery.isLoading : eventStatAllQuery.isLoading,
        statToggle: statToggle,
        setStatToggle: setStatToggle,
      }}
    >
      <SubNavbar items={subNavItems} className="hidden sm:block" />
      <FilterBar className="scrollbar-none mt-8 justify-start overflow-auto">
        <ButtonSelectSearch className="border-r" searchPlaceHolder="Search surfers" placeHolder="Surfer" value={filters.surferSlug} setValue={updateSurfer} options={surferOptions} loading={surferOptions ? false : true} loadingText="Surfer" />
        <ButtonSelectSearch placeHolder="Round" searchPlaceHolder="Search rounds" value={filters.heatRound} setValue={setHeatRound} options={heatRoundOptions} loading={heatRoundOptions ? false : true} loadingText="Round" />
      </FilterBar>
      {!eventQuery.data?.wavePoolEvent && <Table className="hidden lg:block" tableData={tableDataRows} items={heatQuery.data || []} handleSelection={onSelectHeat} loading={heatQuery.isLoading} />}
      {!eventQuery.data?.wavePoolEvent && <TableHeat className="block lg:hidden" tableData={tableDataBlocks} items={heatQuery.data || []} handleSelection={onSelectHeat} loading={heatQuery.isLoading} />}
      {eventQuery.data?.wavePoolEvent && <TableHeat tableData={tableDataBlocks} items={heatQuery.data || []} handleSelection={onSelectHeat} loading={heatQuery.isLoading} />}
    </Layout>
  )
}
