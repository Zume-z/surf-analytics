import React from 'react'
import { api } from '@/utils/api'
import Table from '@/components/Table'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import TableHeat from '@/components/TableHeat'
import { HTH_LABELS } from '@/utils/constants'
import { Heat, Surfer } from '@/utils/interfaces'
import { useQueryState } from 'next-usequerystate'
import ButtonSwitch from '@/components/ButtonSwitch'
import { leadingZero } from '@/utils/format/leadingZero'
import ButtonSelectSearchSurfer from '@/components/ButtonSelectSearchSurfer'
import { getHeadToHeadTableBlocks, getHeadToHeadTableRows } from '@/utils/format/headToHeadTableFormat'

export default function HeadToHeadDev() {
  const router = useRouter()
  const [surferSlugA, setSurferSlugA] = useQueryState('surfera')
  const [surferSlugB, setSurferSlugB] = useQueryState('surferb')
  const [heatCheck, setHeatCheck] = React.useState(false)
  const handleSetSurferSlugA = (value: string | null) => (setSurferSlugA(value), setHeatCheck(false))
  const handleSetSurferSlugB = (value: string | null) => (setSurferSlugB(value), setHeatCheck(false))

  const filters = {
    surferSlugA: surferSlugA || undefined,
    surferSlugB: surferSlugB || undefined,
  }

  const heatQuery = api.heat.getManyHeadToHead.useQuery({ surferASlug: filters.surferSlugA!, surferBSlug: surferSlugB!, headToheadFilter: heatCheck, heatStatus: 'COMPLETED' }, { enabled: !!filters.surferSlugA && !!filters.surferSlugB })
  const heatStatQuery = api.headToHeadStat.getAll.useQuery({ surferASlug: filters.surferSlugA!, surferBSlug: surferSlugB!, headToheadFilter: heatCheck }, { enabled: !!filters.surferSlugA && !!filters.surferSlugB })
  const surferOptionsQuery = api.surfer.getManyHeadToHead.useQuery({ surferSlugFilter: filters.surferSlugA ? filters.surferSlugA : filters.surferSlugB })
  const surferOptions = surferOptionsQuery.data?.map((surfer) => ({ label: surfer.name, value: surfer.slug, surfer: surfer as Surfer }))
  const tableDataRows = getHeadToHeadTableRows(heatQuery.data as Heat[] | undefined)
  const tableDataBlocks = getHeadToHeadTableBlocks(heatQuery.data as Heat[] | undefined)
  const onSelectHeat = (item: Heat) => {item.heatStatus != 'CANCELED' && router.replace({ pathname: '/events/[eventId]/waves', query: { eventId: item.eventSlug, heatRound: item.heatRound, heatNumber: item.heatNumber } })} //prettier-ignore
  const heatResultsLength = heatQuery.data?.map((heat) => heat.heatResults.length)
  const checkDisabled = !filters.surferSlugA || !filters.surferSlugB ? true : heatResultsLength?.includes(2) == false ? true : false

  return (
    <Layout title={'Head To Head'}>
      <h1 className="pt-8 pb-4 text-center text-3xl font-bold">Matchups</h1>
      {heatQuery.data && <ButtonSwitch className={`my-2 ${checkDisabled && 'opacity-50'}`} label="Head to Head Matchups" checked={heatCheck} onCheckedChange={setHeatCheck} checkDisable={checkDisabled} />}
      {heatQuery.isLoading && <ButtonSwitch className="py-2 opacity-50" label="Head to Head Matchups" checked={false} checkDisable={true} />}

      {/* HEAD TO HEAD TABLE */}
      <div className="-mx-4 flex items-center justify-center sm:-mx-0 ">
        <div className="w-full rounded shadow">
          <div className="flex w-full justify-evenly border-b  bg-gray-100 py-2">
            <div className="flex w-1/3 items-center justify-center">
              <ButtonSelectSearchSurfer className='-mr-4 sm:-mr-0' searchPlaceHolder="Search surfers" placeHolder="Select Surfer" value={filters.surferSlugA} setValue={handleSetSurferSlugA} options={surferOptions} loading={surferOptions ? false : true} viewPortAlign="start" />
            </div>
            <div className="flex w-1/3 items-center justify-center text-lg text-gray-500">Vs</div>
            <div className="flex w-1/3 items-center justify-center">
              <ButtonSelectSearchSurfer className='-ml-4 sm:-ml-0' searchPlaceHolder="Search surfers" placeHolder="Select Surfer" value={filters.surferSlugB} setValue={handleSetSurferSlugB} options={surferOptions} loading={surferOptions ? false : true} viewPortAlign="end" />
            </div>
          </div>
          {surferSlugA && surferSlugB && !heatStatQuery.isLoading && (
            <div className="w-full flex-col ">
              {heatStatQuery.data?.map((stat, i) => (
                <div key={i} className="group flex w-full border-b py-2 hover:bg-gray-100 ">
                  <div className={`flex w-1/3 items-center justify-center  text-center ${Number(stat.surferA) > Number(stat.surferB) ? 'text-blue-base' : 'text-gray-500 group-hover:text-navy'}`}>{stat.surferA}</div>
                  <div className="flex w-1/3 items-center justify-center text-center text-sm text-gray-500 group-hover:text-navy ">{stat.label}</div>
                  <div className={`flex w-1/3 items-center justify-center  text-center ${Number(stat.surferB) > Number(stat.surferA) ? 'text-blue-base' : 'text-gray-500 group-hover:text-navy'}`}>{stat.surferB}</div>
                </div>
              ))}
            </div>
          )}

          {/* LOADING */}
          {(!surferSlugA || !surferSlugB || heatStatQuery.isLoading) && (
            <div className="w-full flex-col opacity-50 ">
              {HTH_LABELS.map((stat, i) => (
                <div key={i} className="group flex w-full border-b py-2  ">
                  <div className={`} flex w-1/3 items-center  justify-center text-center text-gray-500`}>-</div>
                  <div className="flex w-1/3 items-center justify-center text-center text-sm text-gray-500  ">{stat}</div>
                  <div className={`} flex w-1/3 items-center  justify-center text-center text-gray-500`}>-</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* HEAT TABLE */}
      {!heatQuery.isLoading && (
        <div className="pt-10">
          <h1 className=" text-xl font-semibold text-navy"> Heats Matchups{!heatQuery.isLoading && ' · ' + leadingZero(heatQuery.data?.length)}</h1>
          <Table className="mt-4 hidden lg:block" tableData={tableDataRows} items={heatQuery.data || []} handleSelection={onSelectHeat} loading={heatQuery.isLoading} />
          <TableHeat className="block lg:hidden" tableData={tableDataBlocks} items={heatQuery.data || []} handleSelection={onSelectHeat} loading={heatQuery.isLoading} />
        </div>
      )}
    </Layout>
  )
}
