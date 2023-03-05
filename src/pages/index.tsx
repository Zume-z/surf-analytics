import { api } from '@/utils/api'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import CardSurfer from '@/components/CardSurfer'
import Table, { TableData } from '@/components/Table'
import CardSurferLoader from '@/components/loaders/CardSurferLoader'

export default function Home() {
  const router = useRouter()
  const currentYear = new Date().getFullYear()
  const events = api.event.getMany.useQuery({ year: currentYear, linkedEvent: 0, sortStartDate: 'asc' })
  const mensTourResults = api.tourResult.getMany.useQuery({ year: currentYear, gender: 'MALE', sortSurferRank: 'asc', itemsPerPage: 10 })
  const womensTourResults = api.tourResult.getMany.useQuery({ year: currentYear, gender: 'FEMALE', sortSurferRank: 'asc', itemsPerPage: 10 })
  const handleSelection = (item: any) => router.replace({ pathname: '/surfers/[surferId]/career', query: { surferId: item.surfer.slug } })

  const tableData = (gender: string) => {
    return [
      { name: `${gender} championship tour`, id: 'name', content: (item: any) => <CardSurfer surfer={item.surfer} place={item.surferRank} />, loader: <CardSurferLoader /> },
      { name: 'Points', id: 'points', content: (item: any) => <div className="table-item">{item.surferPoints.toLocaleString('en-US')}</div> },
    ]
  }

  return (
    <Layout slider={{ events: events.data || [], loading: events.isLoading }}>
      <div className="md:flex md:space-x-8">
        <Table tableData={tableData('Mens')} items={mensTourResults.data || []} loading={mensTourResults.isLoading} handleSelection={handleSelection} />
        <Table  tableData={tableData('Womens')} items={womensTourResults.data || []} loading={womensTourResults.isLoading} handleSelection={handleSelection} />
      </div>
    </Layout>
  )
}
