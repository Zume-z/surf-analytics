import React from 'react'
import { api } from '@/utils/api'
import Table from '@/components/Table'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import FilterBar from '@/components/FilterBar'
import SubNavbar from '@/components/SubNavbar'
import TableHeat from '@/components/TableHeat'
import { Event, Heat } from '@/utils/interfaces'
import { useQueryState } from 'next-usequerystate'
import ButtonSelectX from '@/components/ButtonSelectX'
import { eventResultStats } from '@/utils/format/subHeaderStats'
import SubHeaderItem from '@/components/subHeaderComponents/subHeaderItem'
import SubHeaderEvent from '@/components/subHeaderComponents/subHeaderEvent'
import { getHeatTableRows, getHeatTableBlocks } from '@/utils/format/heatTableFormat'
import { z } from 'zod'
import { HeatSchema } from '@/server/api/routers/heat'

export default function EventHeats() {
  const router = useRouter()
  const [surferSlug, setSurferSlug] = useQueryState('surfer')
  const [heatRound, setHeatRound] = useQueryState('heatRound')
  const updateSurfer = React.useCallback(async (value: string | null) => {
    await setSurferSlug(value)
    await setHeatRound(null)
  }, [])

  const filters: z.infer<typeof HeatSchema> = {
    sortRoundNumber: 'asc',
    sortHeatNumber: 'asc',
    surferSlug: surferSlug || undefined,
    heatRound: heatRound || undefined,
    eventSlug: router.query.eventId as string,
  }

  const heatQuery = api.heat.getMany.useQuery(filters)
  const eventQuery: any = api.event.getOne.useQuery({ slug: filters.eventSlug as string }, { enabled: !!filters.eventSlug })
  const surferQuery = api.surfer.getName.useQuery({ slug: filters.surferSlug }, { enabled: !!filters.surferSlug })
  const eventStatQuery = api.eventStat.getResult.useQuery({ eventSlug: filters.eventSlug as string }, { enabled: !!filters.eventSlug })
  const tableDataRows = getHeatTableRows(heatQuery.data as Heat[] | undefined)
  const tableDataBlocks = getHeatTableBlocks(heatQuery.data as Heat[] | undefined, eventQuery.data?.wavePoolEvent)
  const onSelectHeat = (item: Heat) => {item.heatStatus != 'CANCELED' && router.replace({ pathname: '/events/[eventId]/waves', query: { ...router.query, heatRound: item.heatRound, heatNumber: item.heatNumber } })} //prettier-ignore

  const subNavItems = [
    { label: 'Events', active: false, router: { pathname: '/events/', query: {} } },
    { label: 'Results', active: false, router: { pathname: '/events/[eventId]/results', query: { eventId: filters.eventSlug } } },
    { label: 'Heats', active: true },
  ]

  const surferOptions =
    eventQuery.data?.eventResults &&
    eventQuery.data?.eventResults.map((eventResult: any) => {
      return { label: eventResult.surfer.name, value: eventResult.surfer.slug }
    })

  const getHeatRoundOptions = () => {
    if (heatQuery.isLoading) return undefined
    const heatRounds = heatQuery.data?.map((heat: any) => heat.heatRound)
    const uniqueHeatRounds = [...new Set(heatRounds)]
    return uniqueHeatRounds.map((heatRound: any) => ({ label: heatRound, value: heatRound }))
  }
  const heatRoundOptions = getHeatRoundOptions() || undefined

  const getSubheaderData = () => {
    if (heatQuery.isLoading) return [{ content: <SubHeaderEvent event={undefined} />, primaryTab: true }, { content: <SubHeaderItem label="year" value={undefined} /> }, { content: <SubHeaderItem label="heats" value={undefined} /> }]
    const subHeaderData = [
      { content: <SubHeaderEvent event={eventQuery.data as Event | undefined} routePath={{ pathname: '/events', query: {} }} />, primaryTab: true },
      { content: <SubHeaderItem label="year" value={eventQuery.data?.tour.year} subvalue="Events" routePath={{ pathname: '/events', query: {} }} loading={eventQuery.isLoading} /> },
      { content: <SubHeaderItem className='sm:hidden' label="results" value="All" subvalue="Results" active={false} routePath={{ pathname: '/events/[eventId]/results', query: { eventId: filters.eventSlug } }} /> }, //prettier-ignore
      { content: <SubHeaderItem className="sm:hidden" label="heats" value="All" subvalue="Heats" active={true} /> },
    ]
    if (surferSlug) subHeaderData.push({ content: <SubHeaderItem className="hidden sm:block" label="surfer" value={surferQuery.data?.name} active={heatRound ? false : true} /> })
    if (heatRound) subHeaderData.push({ content: <SubHeaderItem className="hidden sm:block" label="round" value={heatRound} active={true} /> })
    if (!surferSlug && !heatRound) subHeaderData.push({ content: <SubHeaderItem className="hidden sm:block" label="heats" value="All" subvalue="Heats" active={true} /> })
    return subHeaderData
  }

  return (
    <Layout title={eventQuery.data?.name} subHeader={{ subHeaderData: getSubheaderData(), stats: eventResultStats(eventStatQuery.data), statsLoading: eventStatQuery.isLoading }}>
      <SubNavbar items={subNavItems} className="hidden sm:block" />
      <FilterBar className="mt-8 justify-start overflow-auto">
        <ButtonSelectX placeHolder="Surfer" value={filters.surferSlug} setValue={updateSurfer} options={surferOptions} loading={surferOptions ? false : true} loadingText="Surfer" />
        <ButtonSelectX placeHolder="Round" value={filters.heatRound} setValue={setHeatRound} options={heatRoundOptions} loading={heatRoundOptions ? false : true} loadingText="Round" />
      </FilterBar>
      {!eventQuery.data?.wavePoolEvent && <Table className="hidden lg:block" tableData={tableDataRows} items={heatQuery.data || []} handleSelection={onSelectHeat} loading={heatQuery.isLoading} />}
      {!eventQuery.data?.wavePoolEvent && <TableHeat className="block lg:hidden" tableData={tableDataBlocks} items={heatQuery.data || []} handleSelection={onSelectHeat} loading={heatQuery.isLoading} />}
      {eventQuery.data?.wavePoolEvent && <TableHeat tableData={tableDataBlocks} items={heatQuery.data || []} handleSelection={onSelectHeat} loading={heatQuery.isLoading} />}
    </Layout>
  )
}
