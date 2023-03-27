import { api } from '@/utils/api'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import { Event } from '@/utils/interfaces'
import { useEffect, useState } from 'react'
import ButtonBack from '@/components/ButtonBack'
import TableWaves from '@/components/TableWaves'
import { leadingZero } from '@/utils/format/leadingZero'
import { eventWaveStats } from '@/utils/stat/subHeaderStats'
import { redirectPrevPage } from '@/utils/function/redirectPrevPage'
import SubHeaderItem from '@/components/subHeaderComponents/subHeaderItem'
import SubHeaderEvent from '@/components/subHeaderComponents/subHeaderEvent'
import { getWaveTableCol, getWaveTableData } from '@/utils/table/waveTableFormat'
import SubHeaderButtonBack from '@/components/subHeaderComponents/subHeaderButtonBack'

export default function MatchupWaves() {
  const router = useRouter()
  const [statToggle, setStatToggle] = useState(false)
  const { eventId, heatRound, heatNumber, surfera, surferb } = router.query as { eventId: string; heatRound: string; heatNumber: string; surfer: string; surfera: string; surferb: string }
  const heatQuery = api.heat.getOneByEvent.useQuery({ eventSlug: eventId, heatRound: heatRound, heatNumber: Number(heatNumber) }, { enabled: !!eventId && !!heatRound && !!heatNumber })
  useEffect(() => redirectPrevPage(router, { pathname: '/matchups/', query: { surfera: surfera, surferb: surferb } }), [router])

  const filters = {
    waves: heatQuery.data ? heatQuery.data.waves : [],
    heatSlug: heatQuery.data && (heatQuery.data.slug as string),
    heatResults: heatQuery.data ? heatQuery.data.heatResults : [],
  }

  const eventQuery = api.event.getOneHeader.useQuery({ slug: eventId }, { enabled: !!eventId })
  const heatStatQuery = api.heatStat.getWaves.useQuery({ heatSlug: filters.heatSlug as string }, { enabled: !!filters.heatSlug && !heatQuery.isLoading })
  const heatStatQueryAll = api.heatStat.getAll.useQuery({ heatSlug: filters.heatSlug as string }, { enabled: !!filters.heatSlug && statToggle })
  const tableColumns = getWaveTableCol(filters.heatResults, filters.waves)
  const tableData = getWaveTableData(filters.heatResults, filters.waves)

  const subHeaderData = [
    { content: <SubHeaderEvent event={eventQuery.data as Event | undefined} routePath={{ pathname: '/events/[eventId]/results', query: { eventId: eventId } }} />, primaryTab: true },
    { content: <SubHeaderItem className="hidden sm:block" label="year" value={eventQuery.data?.tour.year} routePath={{ pathname: '/events/[eventId]/results', query: { eventId: eventId } }} loading={eventQuery.isLoading} /> },
    { content: <SubHeaderItem className="hidden sm:block" label="round" value={heatRound} routePath={{ pathname: '/events/[eventId]/heats', query: { eventId: eventId } }} loading={eventQuery.isLoading} /> },
    { content: <SubHeaderItem label="heat" value={leadingZero(heatNumber)} subvalue={` ${heatRound} · Heat ${leadingZero(heatNumber)}`} subInactive={true} active={true} noBorder={true} loading={eventQuery.isLoading} /> },
  ]

  return (
    <Layout
      title={eventQuery.data?.name}
      subHeader={{
        subHeaderData: subHeaderData,
        stats: eventWaveStats(heatStatQuery.data, heatStatQueryAll.data, statToggle),
        statsLoading: !statToggle ? heatStatQuery.isLoading : heatStatQueryAll.isLoading,
        buttonBack: <SubHeaderButtonBack label="Matchups" routePath={{ pathname: '/matchups/', query: { surfera: surfera, surferb: surferb } }} />,
        statToggle: statToggle,
        setStatToggle: setStatToggle,
      }}
    >
      <ButtonBack className="hidden sm:block" label="Matchups" routePath={{ pathname: '/matchups/', query: { surfera: surfera, surferb: surferb } }} />
      <TableWaves tableData={tableColumns} items={tableData} loading={heatQuery.isLoading} />
    </Layout>
  )
}
