import { api } from '@/utils/api'
import Table from '@/components/Table'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import TableHeat from '@/components/TableHeat'
import { Heat, HeatResult, Surfer } from '@/utils/interfaces'
import { surferHeatStats } from '@/utils/format/subHeaderStats'
import SubHeaderItem from '@/components/subHeaderComponents/subHeaderItem'
import SubHeaderSurfer from '@/components/subHeaderComponents/subHeaderSurfer'
import { getHeatTableRows, getHeatTableBlocks } from '@/utils/format/heatTableFormat'

export default function SurferHeats() {
  const router = useRouter()
  const { surferId, event, year } = router.query as { surferId: string; event: string; year: string }
  const heatQuery = api.heat.getMany.useQuery({ surferSlug: surferId, eventSlug: event, sortRoundNumber: 'asc' }, { enabled: !!surferId && !!event })
  const surferQuery = api.surfer.getOne.useQuery({ slug: surferId }, { enabled: !!surferId })
  const eventQuery: any = api.event.getOne.useQuery({ slug: event }, { enabled: !!event })
  const eventResultStatQuery = api.eventResultStat.getHeats.useQuery({ surferSlug: surferId, eventSlug: event }, { enabled: !!surferId && !!event })
  const tableDataRows = getHeatTableRows(heatQuery.data as Heat[] | undefined)
  const tableDataBlocks = getHeatTableBlocks(heatQuery.data as Heat[] | undefined, eventQuery.data?.wavePoolEvent)
  const onSelectHeat = (item: Heat) => {item.heatStatus != 'CANCELED' && router.replace({ pathname: '/surfers/[surferId]/waves', query: { ...router.query, heatRound: item.heatRound, heatNumber: item.heatNumber } })} //prettier-ignore

  const subHeaderData = [
    { content: <SubHeaderSurfer surfer={surferQuery.data as Surfer | undefined} routePath={{ pathname: '/surfers', query: {} }} />, primaryTab: true }, //prettier-ignore
    { content: <SubHeaderItem label="year" value={year} routePath={{ pathname: '/surfers/[surferId]/career', query: { surferId: router.query.surferId } }} loading={eventQuery.isLoading} /> },
    { content: <SubHeaderItem label="event" value={eventQuery.data?.name} routePath={{ pathname: '/surfers/[surferId]/events', query: { surferId: surferId, year: year } }}  loading={eventQuery.isLoading} /> }, //prettier-ignore
    { content: <SubHeaderItem label="heats" value="All" subvalue="Heats" active={true} loading={eventQuery.isLoading} /> },
  ]

  return (
    <Layout title={surferQuery.data?.name} subHeader={{ subHeaderData: subHeaderData, stats: surferHeatStats(eventResultStatQuery.data), statsLoading: eventResultStatQuery.isLoading }}>
      {!eventQuery.data?.wavePoolEvent && <Table className="hidden lg:block" tableData={tableDataRows} items={heatQuery.data || []} handleSelection={onSelectHeat} loading={heatQuery.isLoading} />}
      {!eventQuery.data?.wavePoolEvent && <TableHeat className="block lg:hidden" tableData={tableDataBlocks} items={heatQuery.data || []} handleSelection={onSelectHeat} loading={heatQuery.isLoading} />}
      {eventQuery.data?.wavePoolEvent && <TableHeat tableData={tableDataBlocks} items={heatQuery.data || []} handleSelection={onSelectHeat} loading={heatQuery.isLoading} />}
    </Layout>
  )
}
