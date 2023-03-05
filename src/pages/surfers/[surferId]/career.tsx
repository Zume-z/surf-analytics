import { api } from '@/utils/api'
import Layout from '@/components/Layout'
import { breakPoint } from '@/utils/constants'
import { windowSize } from '@/utils/windowSize'
import { useRouter } from 'next/router'
import Table, { TableData } from '@/components/Table'
import { Surfer, TourResult } from '@/utils/interfaces'
import { surferYears } from '@/utils/format/getSurferYears'
import TableLink from '@/components/tableComponents/TableLink'
import { surferCareerStats } from '@/utils/format/subHeaderStats'
import SubHeaderItem from '@/components/subHeaderComponents/subHeaderItem'
import TourResultRank from '@/components/tableComponents/TableTourResultRank'
import SubHeaderSurfer from '@/components/subHeaderComponents/subHeaderSurfer'
import TourResultPoints from '@/components/tableComponents/TableTourResultPoints'

export default function SurfersCareer() {
  const router = useRouter()
  const { surferId } = router.query as { surferId: string }
  const tourResultQuery = api.tourResult.getMany.useQuery({ surferSlug: surferId, sortYear: 'desc' }, { enabled: !!surferId })
  const surferStatQuery = api.surferStat.getCareer.useQuery({ surferSlug: surferId }, { enabled: !!surferId })
  const onYearSelect = (item: TourResult) => !item.tour.canceled && router.replace({ pathname: '/surfers/[surferId]/events', query: { ...router.query, year: item.tour.year } })

  const subHeaderData = [
    { content: <SubHeaderSurfer surfer={tourResultQuery.data?.[0]?.surfer as Surfer | undefined} routePath={{ pathname: '/surfers', query: {} }} />, primaryTab: true },
    { content: <SubHeaderItem label="career" value={surferYears(tourResultQuery.data)} active={true} noBorder={true} /> },
  ]

  const tableData: TableData[] = [
    { name: 'Year', id: 'year', content: (item: TourResult) => <div className={`${item.tour.canceled && 'text-gray-500'}`}>{item.tour.year}</div> },
    { name: 'Rank', id: 'rank', content: (item: TourResult) => <TourResultRank tourResult={item} /> },
    { name: 'Points', id: 'points', className: 'sm:w-auto w-px', content: (item: TourResult) => <TourResultPoints tourResult={item} /> },
    { name: '', id: 'link', className: `w-px`, content: (item: TourResult) => <TableLink label="View Events" canceled={item.tour.canceled} /> },
  ]
  if (windowSize().width! < breakPoint.sm) tableData.pop()

  return (
    <Layout
      title={tourResultQuery.data?.[0]?.surfer.name}
      subHeader={{ subHeaderData: subHeaderData, stats: surferCareerStats(surferStatQuery.data, tourResultQuery.data?.[0]?.surfer as Surfer | undefined), statsLoading: surferStatQuery.isLoading }}
    >
      <Table tableData={tableData} items={tourResultQuery.data || []} handleSelection={onYearSelect} loading={tourResultQuery.isLoading} />
    </Layout>
  )
}
