import { useState } from 'react'
import Layout from '@/components/Layout'
import TableAnalytics from '@/components/TableAnalytics'
import { api } from '@/utils/api'
import TableAnalyticsTest from '@/components/TableAnalyticsTEST'
import { surferYearsArr } from '@/utils/format/getYearSpan'
import { useRouter } from 'next/router'
import { useQueryState } from 'next-usequerystate'
import { createHooksInternalProxy } from '@trpc/react-query/dist/createTRPCReact'

export default function Analytics() {
  // const router = useRouter()
  // const [surferSlug, setSurferSlug] = useQueryState('surferId')

  const filters = {
    surferId: 'filipe-toledo',
    year: 2022,
  }

  // // Surfer Career
  // const tourResultQuery = api.tourResult.getMany.useQuery({ surferId: filters.surferId, sortYear: 'desc' })
  // const tourYears =  tourResultQuery.data?.map((tourResult) => tourResult.tour.year)
  // const tourResultStatQuery = api.tourResultStat.getAnalytics.useQuery({ surferId: filters.surferId, yearsArr: tourYears! }, { enabled: !!tourYears && !!filters.surferId })

  // const tableData: any = []
  // const getTableData = (query: any) => {
  //   if (!query) return
  //   Object.keys(query).forEach(function (key) {
  //     tableData.push({ name: query[key].label, id: key, content: (item: any) => <div>{item[key].value}</div> })
  //   })
  // }
  // getTableData(tourResultStatQuery.data ? tourResultStatQuery.data[0] : [])

  // // Surfer Events
  // const eventResultQuery = api.eventResult.getMany.useQuery({ surferId: filters.surferId, year: filters.year }, { enabled: !!filters.surferId && !!filters.year })
  // const events = eventResultQuery.data?.map((event) => event.eventId)
  // const eventResultStatQuery = api.eventResultStat.getAnalytics.useQuery({ surferId: filters.surferId, eventArr: events! }, { enabled: !!events && !!filters.surferId && !!filters.year })

  //  const tableData: any = []
  // const getTableData = (query: any) => {
  //   if (!query) return
  //   Object.keys(query).forEach(function (key) {
  //     tableData.push({ name: query[key].label, id: key, content: (item: any) => <div>{item[key].value}</div> })
  //   })
  // }
  // getTableData(eventResultStatQuery.data ? eventResultStatQuery.data[0] : [])

  return (
    <Layout>
      <h1 className="py-8 text-center text-3xl font-bold">Analytics</h1>
      {/* {eventResultStatQuery && <TableAnalyticsTest tableData={tableData} items={eventResultStatQuery.data || []} />} */}
    </Layout>
  )
}
