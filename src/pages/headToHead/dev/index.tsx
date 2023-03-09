import React from 'react'
import Layout from '@/components/Layout'
import { api } from '@/utils/api'
import { getHeatTableBlocks, getHeatTableRows } from '@/utils/format/heatTableFormat'
import { Heat, Surfer } from '@/utils/interfaces'
import Table from '@/components/Table'
import { useRouter } from 'next/router'
import { getHeadToHeadTableBlocks, getHeadToHeadTableRows } from '@/utils/format/headToHeadTableFormat '
import CardSurfer from '@/components/CardSurfer'
import TableHeadToHead from '@/components/TableHeadToHead'
import TableHeat from '@/components/TableHeat'

export default function HeadToHeadDev() {
  const router = useRouter()

  // Settings
  const surferASlug = 'john-john-florence' // kanoa-igarashi
  const surferBSlug = 'kelly-slater' // kanoa-igarashi
  const onSelectHeat = (item: Heat) => {}

  const surferAQuery = api.surfer.getOne.useQuery({ slug: surferASlug })
  const surferBQuery = api.surfer.getOne.useQuery({ slug: surferBSlug })

  const heatQuery = api.heat.getManyHeadToHead.useQuery({ surferASlug: surferASlug, surferBSlug: surferBSlug })
  const heatStatQuery = api.headToHeadStat.getAll.useQuery({ surferASlug: surferASlug, surferBSlug: surferBSlug })

  const tableDataRows = getHeadToHeadTableRows(heatQuery.data as Heat[] | undefined)
  const tableDataBlocks = getHeadToHeadTableBlocks(heatQuery.data as Heat[] | undefined)

  return (
    <Layout title={'Head To Head'}>
      <h1 className="py-8 text-center text-3xl font-bold">Head To Head (DEV)</h1>

      <div className="w-full rounded shadow">
        <div className="flex w-full justify-evenly border-b bg-gray-100 py-2">
          <div className="flex w-1/3 items-center justify-center">
            <CardSurfer surfer={surferAQuery.data as Surfer} />
          </div>
          <div className="flex w-1/3 items-center justify-center text-lg text-gray-500">Vs</div>
          <div className="flex w-1/3 items-center justify-center">
            <CardSurfer surfer={surferBQuery.data as Surfer} />
          </div>
        </div>
        <div className="w-full flex-col ">
          {heatStatQuery.data?.map((stat, i) => (
            <div key={i} className="group flex w-full border-b py-2 hover:bg-gray-100 ">
              <div className={`flex w-1/3 items-center text-center  justify-center ${Number(stat.surferA) > Number(stat.surferB) ? 'text-blue-base' : 'text-gray-500 group-hover:text-navy'}`}>{stat.surferA}</div>
              <div className="flex w-1/3 items-center text-center justify-center text-gray-500 group-hover:text-navy text-sm">{stat.label}</div>
              <div className={`flex w-1/3 items-center text-center  justify-center ${Number(stat.surferB) > Number(stat.surferA) ? 'text-blue-base' : 'text-gray-500 group-hover:text-navy'}`}>{stat.surferB}</div>
            </div>
          ))}
        </div>
      </div>

      {/* HEATS MATCHED UP IN */}
      <h1 className="pt-8 text-xl text-center font-bold">Championship Tour Matchups · {heatQuery.data?.length}</h1>
      <Table className="mt-4 hidden lg:block" tableData={tableDataRows} items={heatQuery.data || []} handleSelection={onSelectHeat} loading={heatQuery.isLoading} />
      <TableHeat className="block lg:hidden" tableData={tableDataBlocks} items={heatQuery.data || []} handleSelection={onSelectHeat} loading={heatQuery.isLoading} />
    </Layout>
  )
}
