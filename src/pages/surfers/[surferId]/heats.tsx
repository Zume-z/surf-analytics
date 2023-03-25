import { api } from '@/utils/api'
import Table from '@/components/Table'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import { useEffect, useState } from 'react'
import TableHeat from '@/components/TableHeat'
import SubNavbar from '@/components/SubNavbar'
import { Heat, Surfer } from '@/utils/interfaces'
import { surferHeatStats } from '@/utils/format/subHeaderStats'
import { redirectPrevPage } from '@/utils/format/redirectPrevPage'
import SubHeaderItem from '@/components/subHeaderComponents/subHeaderItem'
import SubHeaderSurfer from '@/components/subHeaderComponents/subHeaderSurfer'
import { getHeatTableRows, getHeatTableBlocks } from '@/utils/format/heatTableFormat'

export default function SurferHeats() {
  const router = useRouter()
  const [statToggle, setStatToggle] = useState(false)
  const { surferId, event, year } = router.query as { surferId: string; event: string; year: string }
  const heatQuery = api.heat.getMany.useQuery({ surferSlug: surferId, eventSlug: event, sortRoundNumber: 'asc' }, { enabled: !!surferId && !!event })
  const surferQuery = api.surfer.getOneHeader.useQuery({ slug: surferId }, { enabled: !!surferId })
  const eventQuery: any = api.event.getOneHeats.useQuery({ slug: event }, { enabled: !!event })
  const eventResultStatQuery = api.eventResultStat.getHeats.useQuery({ surferSlug: surferId, eventSlug: event }, { enabled: !!surferId && !!event && !heatQuery.isLoading })
  const eventResultAllStatQuery = api.eventResultStat.getAll.useQuery({ surferSlug: surferId, eventSlug: event }, { enabled: !!surferId && !!event && statToggle })
  const tableDataRows = getHeatTableRows(heatQuery.data as Heat[] | undefined)
  const tableDataBlocks = getHeatTableBlocks(heatQuery.data as Heat[] | undefined, eventQuery.data?.wavePoolEvent)
  const onSelectHeat = (item: Heat) => {item.heatStatus != 'CANCELED' && router.replace({ pathname: '/surfers/[surferId]/waves', query: { ...router.query, heatRound: item.heatRound, heatNumber: item.heatNumber } })} //prettier-ignore
  useEffect(() => redirectPrevPage(router, { pathname: '/surfers/[surferId]/events', query: { surferId: surferId, year: year } }), [router])

  const subHeaderData = [
    { content: <SubHeaderSurfer surfer={surferQuery.data as Surfer | undefined} subData={`${year} ${!eventQuery.isLoading ? eventQuery.data?.name : ''}`} routePath={{ pathname: '/surfers/[surferId]/career', query: { surferId: surferId } }} />, primaryTab: true }, //prettier-ignore
    { content: <SubHeaderItem className="hidden sm:block" label="year" value={year} routePath={{ pathname: '/surfers/[surferId]/career', query: { surferId: router.query.surferId } }} loading={eventQuery.isLoading} /> },
    { content: <SubHeaderItem className="block sm:hidden" label="career" value={'-'} subvalue="Career" active={false} routePath={{ pathname: '/surfers/[surferId]/career', query: { surferId: surferId } }} loading={eventQuery.isLoading} /> },
    { content: <SubHeaderItem label="event" value={eventQuery.data?.name} subvalue={'Events'} routePath={{ pathname: '/surfers/[surferId]/events', query: { surferId: surferId, year: year } }}  loading={eventQuery.isLoading} /> }, //prettier-ignore
    { content: <SubHeaderItem label="heats" value="All" subvalue="Heats" active={true} loading={eventQuery.isLoading} /> },
    { content: <SubHeaderItem className="block sm:hidden" label="Locations" value={'-'} subvalue={'Locations'} active={false} routePath={{ pathname: '/surfers/[surferId]/locations', query: { surferId: surferId } }} loading={eventQuery.isLoading} /> }, //prettier-ignore
  ]

  const subNavItems = [
    { label: 'Career', active: false, router: { pathname: '/surfers/[surferId]/career', query: { surferId: surferId } } },
    { label: 'Events', active: false, router: { pathname: '/surfers/[surferId]/events', query: { surferId: surferId, year: year } } },
    { label: 'Heats', active: true },
    { label: 'Locations', active: false, router: { pathname: '/surfers/[surferId]/locations', query: { surferId: surferId } } },
  ]

  return (
    <Layout
      title={surferQuery.data?.name}
      subHeader={{
        subHeaderData: subHeaderData,
        stats: surferHeatStats(eventResultStatQuery.data, eventResultAllStatQuery.data, statToggle),
        statsLoading: !statToggle ? eventResultStatQuery.isLoading : eventResultAllStatQuery.isLoading,
        statToggle: statToggle,
        setStatToggle: setStatToggle,
      }}
    >
      <SubNavbar items={subNavItems} className="hidden sm:block" />
      {!eventQuery.data?.wavePoolEvent && <Table className="hidden lg:block" tableData={tableDataRows} items={heatQuery.data || []} handleSelection={onSelectHeat} loading={heatQuery.isLoading} />}
      {!eventQuery.data?.wavePoolEvent && <TableHeat className="block lg:hidden" tableData={tableDataBlocks} items={heatQuery.data || []} handleSelection={onSelectHeat} loading={heatQuery.isLoading} />}
      {eventQuery.data?.wavePoolEvent && <TableHeat tableData={tableDataBlocks} items={heatQuery.data || []} handleSelection={onSelectHeat} loading={heatQuery.isLoading} />}
    </Layout>
  )
}
