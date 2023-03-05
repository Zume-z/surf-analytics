import { api } from '@/utils/api'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import { Event } from '@/utils/interfaces'
import TableWaves from '@/components/TableWaves'
import { leadingZero } from '@/utils/format/leadingZero'
import { eventWaveStats } from '@/utils/format/subHeaderStats'
import SubHeaderEvent from '@/components/subHeaderComponents/subHeaderEvent'
import SubHeaderItem from '@/components/subHeaderComponents/subHeaderItem'
import { getWaveTableCol, getWaveTableData } from '@/utils/format/waveTableFormat'

export default function EventWaves() {
  const router = useRouter()
  const { eventId, heatRound, heatNumber } = router.query as { eventId: string; heatRound: string; heatNumber: string }
  const heatQuery = api.heat.getOneByEventHeat.useQuery({ eventSlug: eventId, heatRound: heatRound, heatNumber: Number(heatNumber) }, { enabled: !!eventId && !!heatRound && !!heatNumber })

  const filters = {
    waves: heatQuery.data ? heatQuery.data.waves : [],
    heatSlug: heatQuery.data && (heatQuery.data.slug as string),
    heatResults: heatQuery.data ? heatQuery.data.heatResults : [],
  }

  const heatStatQuery = api.heatStat.getWaves.useQuery({ heatSlug: filters.heatSlug! }, { enabled: !!filters.heatSlug })
  const eventQuery: any = api.event.getOne.useQuery({ slug: eventId }, { enabled: !!eventId })
  const tableColumns = getWaveTableCol(filters.heatResults)
  const tableData = getWaveTableData(filters.heatResults, filters.waves)

  const subHeaderData = [
    { content: <SubHeaderEvent event={eventQuery.data as Event | undefined} routePath={{ pathname: '/events', query: {} }} />, primaryTab: true },
    { content: <SubHeaderItem label="year" value={eventQuery.data?.year} routePath={{ pathname: '/events/[eventId]/results', query: { eventId: eventId } }} loading={eventQuery.isLoading} /> },
    { content: <SubHeaderItem label="round" value={heatRound} routePath={{ pathname: '/events/[eventId]/heats', query: { eventId: eventId } }} loading={eventQuery.isLoading} /> },
    { content: <SubHeaderItem label="heat" value={leadingZero(heatNumber)} subvalue={`Heat ${leadingZero(heatNumber)}`} active={true} loading={eventQuery.isLoading} /> },
  ]

  return (
    <Layout title={eventQuery.data?.name} subHeader={{ subHeaderData: subHeaderData, stats: eventWaveStats(heatStatQuery.data), statsLoading: heatStatQuery.isLoading }}>
      <TableWaves tableData={tableColumns} items={tableData} loading={heatQuery.isLoading} />
    </Layout>
  )
}
