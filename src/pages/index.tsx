import { api } from '@/utils/api'
import { useRouter } from 'next/router'
import Table from '@/components/Table'
import Layout from '@/components/Layout'
import CardSurfer from '@/components/CardSurfer'
import CardSurferLoader from '@/components/loaders/CardSurferLoader'

export default function Home() {
  const router = useRouter()
  const currentYear = new Date().getFullYear()
  const events = api.event.getManyHome.useQuery({ year: currentYear, linkedEvent: 0, sortStartDate: 'asc' })
  const mensTourResults = api.tourResult.getManyHome.useQuery({ year: currentYear, gender: 'MALE', sortSurferRank: 'asc', itemsPerPage: 10 })
  const womensTourResults = api.tourResult.getManyHome.useQuery({ year: currentYear, gender: 'FEMALE', sortSurferRank: 'asc', itemsPerPage: 10 })
  const handleSelection = (item: any) => router.replace({ pathname: '/surfers/[surferId]/career', query: { surferId: item.surfer.slug } })

  const tableData = (gender: string) => {
    return [
      { name: `${gender} championship tour`, id: 'name', content: (item: any) => <CardSurfer surfer={item.surfer} place={item.surferRank} showFirst={true} />, loader: <CardSurferLoader /> },
      { name: 'Points', id: 'points', content: (item: any) => <div className="table-item">{item.surferPoints.toLocaleString('en-US')}</div> },
    ]
  }
  return (
    <Layout slider={{ events: events.data || [], loading: events.isLoading }}>
      <div className="lg:flex lg:space-x-8">
        <Table tableData={tableData('Mens')} items={mensTourResults.data || []} loading={mensTourResults.isLoading} handleSelection={handleSelection} />
        <Table tableData={tableData('Womens')} items={womensTourResults.data || []} loading={womensTourResults.isLoading} handleSelection={handleSelection} />
      </div>
    </Layout>
  )
}
