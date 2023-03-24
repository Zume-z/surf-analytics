import { useState } from 'react'
import { api } from '@/utils/api'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import { Surfer, Wave } from '@/utils/interfaces'
import TableWaves from '@/components/TableWaves'
import { leadingZero } from '@/utils/format/leadingZero'
import ButtonBack from '@/components/ButtonBack'
import { surferWaveStats } from '@/utils/format/subHeaderStats'
import SubHeaderItem from '@/components/subHeaderComponents/subHeaderItem'
import SubHeaderSurfer from '@/components/subHeaderComponents/subHeaderSurfer'
import { getWaveTableCol, getWaveTableData } from '@/utils/format/waveTableFormat'
import SubHeaderButtonBack from '@/components/subHeaderComponents/subHeaderButtonBack'

export default function SurferWaves() {
  const router = useRouter()
  const [statToggle, setStatToggle] = useState(false)
  const { surferId, event, heatRound, heatNumber, year } = router.query as { surferId: string; event: string; heatRound: string; heatNumber: string; year: string }
  const heatQuery = api.heat.getOneByEvent.useQuery({ eventSlug: event, heatRound: heatRound, heatNumber: Number(heatNumber) }, { enabled: !!event && !!heatRound && !!heatNumber })

  const filters = {
    waves: heatQuery.data ? heatQuery.data.waves : [],
    heatSlug: heatQuery.data && (heatQuery.data.slug as string),
    heatResults: heatQuery.data ? heatQuery.data.heatResults : [],
    eventName: heatQuery.data ? heatQuery.data.event.name : undefined,
  }

  const surferQuery = api.surfer.getOneHeader.useQuery({ slug: surferId }, { enabled: !!surferId })
  const heatResultStatQuery = api.heatResultStat.getWaves.useQuery({ surferSlug: surferId, heatSlug: filters.heatSlug! }, { enabled: !!filters.heatSlug && !!surferId && !heatQuery.isLoading })
  const heatResultAllStatQuery = api.heatResultStat.getAll.useQuery({ surferSlug: surferId, heatSlug: filters.heatSlug! }, { enabled: !!filters.heatSlug && !!surferId && statToggle })
  const tableColumns = getWaveTableCol(filters.heatResults)
  const tableData = getWaveTableData(filters.heatResults, filters.waves)

  const subHeaderData = [
    { content: <SubHeaderSurfer surfer={surferQuery.data as Surfer | undefined} subData={`${year} ${filters.eventName}`} routePath={{ pathname: '/surfers', query: {} }} />, primaryTab: true }, //prettier-ignore
    { content: <SubHeaderItem className="hidden sm:block" label="year" value={year} routePath={{ pathname: '/surfers/[surferId]/career', query: { surferId: router.query.surferId } }} loading={surferQuery.isLoading} /> },
    { content: <SubHeaderItem className="hidden sm:block"label="event" value={filters.eventName} routePath={{ pathname: '/surfers/[surferId]/events', query: { surferId: surferId, year: year }  }}  loading={surferQuery.isLoading}/> }, //prettier-ignore
    { content: <SubHeaderItem className="hidden sm:block" label="round" value={heatRound} routePath={{ pathname: '/surfers/[surferId]/heats', query: { surferId: surferId, year: year, event: event } }}  loading={surferQuery.isLoading}/> }, //prettier-ignore
    { content: <SubHeaderItem label="heat" value={leadingZero(heatNumber)} subvalue={` ${heatRound} · Heat ${leadingZero(heatNumber)}`} active={true} subInactive={true} noBorder={true} loading={surferQuery.isLoading} /> },
  ]

  return (
    <Layout
      title={surferQuery.data?.name}
      subHeader={{
        subHeaderData: subHeaderData,
        stats: surferWaveStats(heatResultStatQuery.data, heatResultAllStatQuery.data, statToggle),
        statsLoading: !statToggle ? heatResultStatQuery.isLoading : heatResultAllStatQuery.isLoading,
        buttonBack: <SubHeaderButtonBack label="Heats" routePath={{ pathname: '/surfers/[surferId]/heats', query: { surferId: surferId, year: year, event: event } }} />,
        statToggle: statToggle,
        setStatToggle: setStatToggle,
      }}
    >
      <ButtonBack className="hidden sm:block" label={filters.eventName} routePath={{ pathname: '/surfers/[surferId]/heats', query: { surferId: surferId, year: year, event: event } }} />
      <TableWaves tableData={tableColumns} items={tableData} loading={heatQuery.isLoading} />
    </Layout>
  )
}
