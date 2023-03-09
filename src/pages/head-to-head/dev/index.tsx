import React from 'react'
import { api } from '@/utils/api'
import Table from '@/components/Table'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import TableHeat from '@/components/TableHeat'
import CardSurfer from '@/components/CardSurfer'
import { Heat, Surfer } from '@/utils/interfaces'
import { getHeadToHeadTableBlocks, getHeadToHeadTableRows } from '@/utils/format/headToHeadTableFormat '
import { useQueryState } from 'next-usequerystate'
import ButtonSelectX from '@/components/ButtonSelectX'
import FilterBar from '@/components/FilterBar'
import ButtonSelect from '@/components/ButtonSelect'

export default function HeadToHeadDev() {
  const router = useRouter()
  const [surferSlugA, setSurferSlugA] = useQueryState('surfera')
  const [surferSlugB, setSurferSlugB] = useQueryState('surferb')
  const [matchUpType, setMatchUpType] = useQueryState('matchup')

  const filters = {
    surferSlugA: surferSlugA || undefined,
    surferSlugB: surferSlugB || undefined,
    matchUpType: matchUpType || undefined,
  }

  const surferOptionsQuery = api.surfer.getManyYear.useQuery({})
  const surferOptions = surferOptionsQuery.data?.map((surfer) => ({ label: surfer.name, value: surfer.slug }))

  const onSelectHeat = (item: Heat) => {item.heatStatus != 'CANCELED' && router.replace({ pathname: '/events/[eventId]/waves', query: { eventId: item.eventSlug, heatRound: item.heatRound, heatNumber: item.heatNumber } })} //prettier-ignore

  const surferAQuery = api.surfer.getOne.useQuery({ slug: filters.surferSlugA! }, { enabled: !!filters.surferSlugA })
  const surferBQuery = api.surfer.getOne.useQuery({ slug: filters.surferSlugB! }, { enabled: !!filters.surferSlugB })

  const heatQuery = api.heat.getManyHeadToHead.useQuery({ surferASlug: filters.surferSlugA!, surferBSlug: surferSlugB! }, { enabled: !!filters.surferSlugA && !!filters.surferSlugB })
  const heatStatQuery = api.headToHeadStat.getAll.useQuery({ surferASlug: filters.surferSlugA!, surferBSlug: surferSlugB! }, { enabled: !!filters.surferSlugA && !!filters.surferSlugB })

  const tableDataRows = getHeadToHeadTableRows(heatQuery.data as Heat[] | undefined)
  const tableDataBlocks = getHeadToHeadTableBlocks(heatQuery.data as Heat[] | undefined)

  const matchUpTypeOptions = [
    { label: 'All Matchups', value: 'ALL' },
    { label: 'Head To Head Matchups', value: 'CT' },
    { label: 'Compare Stats', value: 'QS' },
  ]
  
  return (
    <Layout title={'Head To Head'}>
      <h1 className="py-8 text-center text-3xl font-bold">Championship Tour Matchups · {heatQuery.data?.length}</h1>

      <FilterBar className='mb-4 justify-center'>
        <ButtonSelectX placeHolder="Surfer" value={filters.surferSlugA} setValue={setSurferSlugA} options={surferOptions} loading={surferOptions ? false : true} loadingText="Surfer" />
        <ButtonSelectX placeHolder="Surfer" value={filters.surferSlugB} setValue={setSurferSlugB} options={surferOptions} loading={surferOptions ? false : true} loadingText="Surfer" />
        <ButtonSelect options={matchUpTypeOptions} setValue={setMatchUpType} value={filters.matchUpType}/>
      </FilterBar>
      <div className="w-full rounded shadow">
        <div className="flex w-full justify-evenly border-b bg-gray-100 py-2">
          <div className="flex w-1/3 items-center justify-center">{surferSlugA && <CardSurfer surfer={surferAQuery.data as Surfer} />}</div>
          <div className="flex w-1/3 items-center justify-center text-lg text-gray-500">Vs</div>
          <div className="flex w-1/3 items-center justify-center">
            <CardSurfer surfer={surferBQuery.data as Surfer} />
          </div>
        </div>
        <div className="w-full flex-col ">
          {heatStatQuery.data?.map((stat, i) => (
            <div key={i} className="group flex w-full border-b py-2 hover:bg-gray-100 ">
              <div className={`flex w-1/3 items-center justify-center  text-center ${Number(stat.surferA) > Number(stat.surferB) ? 'text-blue-base' : 'text-gray-500 group-hover:text-navy'}`}>{stat.surferA}</div>
              <div className="flex w-1/3 items-center justify-center text-center text-sm text-gray-500 group-hover:text-navy ">{stat.label}</div>
              <div className={`flex w-1/3 items-center justify-center  text-center ${Number(stat.surferB) > Number(stat.surferA) ? 'text-blue-base' : 'text-gray-500 group-hover:text-navy'}`}>{stat.surferB}</div>
            </div>
          ))}
        </div>
      </div>

      <Table className="mt-4 hidden lg:block" tableData={tableDataRows} items={heatQuery.data || []} handleSelection={onSelectHeat} loading={heatQuery.isLoading} />
      <TableHeat className="block lg:hidden" tableData={tableDataBlocks} items={heatQuery.data || []} handleSelection={onSelectHeat} loading={heatQuery.isLoading} />
    </Layout>
  )
}
