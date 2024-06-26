import React from 'react'
import { api } from '@/utils/api'
import Table from '@/components/Table'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import TableHeat from '@/components/TableHeat'
import { Heat, Surfer } from '@/utils/interfaces'
import ButtonSwitch from '@/components/ButtonSwitch'
import { leadingZero } from '@/utils/format/leadingZero'
import { queryTypes, useQueryState } from 'next-usequerystate'
import { DATA_DISCLAIMER, HTH_LABELS } from '@/utils/constants'
import ButtonSelectSearchSurfer from '@/components/ButtonSelectSearchSurfer'
import { getHeadToHeadTableBlocks, getHeadToHeadTableRows } from '@/utils/table/headToHeadTableFormat'

export default function MatchupsDev() {
  const router = useRouter()
  const routerSurferASlug = router.query.surfera as string | undefined
  const routerSurferBSlug = router.query.surferb as string | undefined
  const [surferSlugA, setSurferSlugA] = useQueryState('surfera', queryTypes.string)
  const [surferSlugB, setSurferSlugB] = useQueryState('surferb', queryTypes.string)
  const [heatCheck, setHeatCheck] = React.useState(false)
  const handleSetSurferSlugA = (value: string | null) => (setSurferSlugA(value), setHeatCheck(false))
  const handleSetSurferSlugB = (value: string | null) => (setSurferSlugB(value), setHeatCheck(false))
  const onSelectHeat = (item: Heat) => {item.heatStatus != 'CANCELED' && router.replace({ pathname: '/matchups/waves', query: { eventId: item.eventSlug, heatRound: item.heatRound, heatNumber: item.heatNumber, surfera: filters.surferSlugA, surferb: filters.surferSlugB } })} //prettier-ignore

  const filters = {
    surferSlugA: surferSlugA || undefined,
    surferSlugB: surferSlugB || undefined,
  }

  const heatQuery = api.heat.getManyMatchup.useQuery({ surferASlug: filters.surferSlugA!, surferBSlug: surferSlugB!, matchupFilter: heatCheck, heatStatus: 'COMPLETED' }, { enabled: !!filters.surferSlugA && !!filters.surferSlugB })
  const heatStatQuery = api.matchupStat.getAll.useQuery({ surferASlug: filters.surferSlugA!, surferBSlug: surferSlugB!, matchupFilter: heatCheck }, { enabled: !!filters.surferSlugA && !!filters.surferSlugB })
  const tableDataRows = getHeadToHeadTableRows(heatQuery.data as Heat[] | undefined)
  const tableDataBlocks = getHeadToHeadTableBlocks(heatQuery.data as Heat[] | undefined)

  const surferOptionsQuery = api.surfer.getManyMatchup.useQuery({ surferSlugFilter: filters.surferSlugA ? filters.surferSlugA : filters.surferSlugB })
  const surferOptions = surferOptionsQuery.data?.map((surfer) => ({ label: surfer.name, value: surfer.slug, surfer: surfer as Surfer, matchupCount: surfer.heatResults.length ? surfer.heatResults.length : undefined }))

  const heatResultsLength = heatQuery.data?.map((heat) => heat.heatResults.length)
  const checkDisabled = !filters.surferSlugA || !filters.surferSlugB ? true : heatResultsLength?.includes(2) == false ? true : false

  return (
    <Layout title={'Matchups'}>
      <h1 className="header-1 pb-2 sm:pb-4">Matchups{!heatQuery.isLoading && ' · ' + leadingZero(heatQuery.data?.length)}</h1>
      <div className="flex items-baseline justify-between">
        {heatQuery.data && <ButtonSwitch className={`my-4 ${checkDisabled && 'opacity-50'}`} label="Head to Head Matchups" checked={heatCheck} onCheckedChange={setHeatCheck} checkDisable={checkDisabled} />}
        {heatQuery.isLoading && <ButtonSwitch className="my-4 opacity-50" label="Head to Head Matchups" checked={false} checkDisable={true} />}
        <div className="hidden text-end text-xs text-gray-400 sm:block ">{DATA_DISCLAIMER}</div>
      </div>
      <div className="relative -mx-4 flex items-center justify-center sm:-mx-0 ">
        <div className="w-full rounded shadow">
          <div className="flex w-full justify-evenly border-b  bg-gray-100 py-2">
            <div className="flex w-1/3 items-center justify-center">
              <ButtonSelectSearchSurfer
                className="-mr-4 sm:-mr-0"
                searchPlaceHolder="Search surfers"
                placeHolder="Select Surfer"
                value={filters.surferSlugA}
                setValue={handleSetSurferSlugA}
                options={surferOptions}
                loading={surferOptions ? false : true}
                viewPortAlign="start"
                selectedOptionSlug={surferSlugB}
              />
            </div>
            <div className="flex w-1/3 items-center justify-center text-base text-gray-500  sm:text-lg">Vs</div>
            <div className="flex w-1/3 items-center justify-center">
              <ButtonSelectSearchSurfer
                className="-ml-4 sm:-ml-0"
                searchPlaceHolder="Search surfers"
                placeHolder="Select Surfer"
                value={filters.surferSlugB}
                setValue={handleSetSurferSlugB}
                options={surferOptions}
                loading={surferOptions ? false : true}
                viewPortAlign="end"
                selectedOptionSlug={surferSlugA}
              />
            </div>
          </div>

          {surferSlugA && surferSlugB && !heatStatQuery.isLoading && (
            <div className="w-full flex-col ">
              {heatStatQuery.data?.map((stat, i) => (
                <div key={i} className="group flex w-full border-b py-3 sm:py-4 hover-mod:hover:bg-gray-100 ">
                  <div className={`flex w-1/3 items-center justify-center text-center text-sm  ${Number(stat.surferA) > Number(stat.surferB) ? 'text-blue-base' : 'text-gray-500 group-hover:text-navy'}`}>{stat.surferA}</div>
                  <div className="flex w-1/3 items-center justify-center text-center text-sm text-gray-500 hover-mod:group-hover:text-navy ">{stat.label}</div>
                  <div className={`flex w-1/3 items-center justify-center text-center text-sm  ${Number(stat.surferB) > Number(stat.surferA) ? 'text-blue-base' : 'text-gray-500 group-hover:text-navy'}`}>{stat.surferB}</div>
                </div>
              ))}
            </div>
          )}

          {(!surferSlugA || !surferSlugB || heatStatQuery.isLoading) && (
            <div>
              <div className={`w-full flex-col opacity-50 `}>
                {HTH_LABELS.map((stat, i) => (
                  <div key={i} className="group flex w-full border-b py-4  ">
                    {(!routerSurferASlug || !routerSurferBSlug) && <div className={`flex w-1/3 items-center  justify-center text-center text-sm text-gray-500 `}>-</div>}
                    {routerSurferASlug && routerSurferBSlug && (
                      <div className={`flex w-1/3 items-center justify-center text-center`}>
                        <div className="animate-pulse items-center rounded-full border border-gray-200 bg-gray-md py-2 px-8 text-white" />
                      </div>
                    )}
                    <div className="flex w-1/3 items-center justify-center text-center text-sm text-gray-500">{stat}</div>
                    {(!routerSurferASlug || !routerSurferBSlug) && <div className={`flex w-1/3 items-center  justify-center text-center text-sm text-gray-500 `}>-</div>}
                    {routerSurferASlug && routerSurferBSlug && (
                      <div className={`flex w-1/3 items-center justify-center text-center`}>
                        <div className="animate-pulse items-center rounded-full border border-gray-200 bg-gray-md py-2 px-8 text-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {!heatQuery.isLoading && (
        <div className="pt-8 sm:pt-10">
          <h1 className=" text-center text-xl font-semibold text-navy sm:text-start">Heats Matchups</h1>
          <Table className="mt-4 hidden lg:block" tableData={tableDataRows} items={heatQuery.data || []} handleSelection={onSelectHeat} loading={heatQuery.isLoading} />
          <TableHeat className="mt-4 block lg:hidden" tableData={tableDataBlocks} items={heatQuery.data || []} handleSelection={onSelectHeat} loading={heatQuery.isLoading} />
        </div>
      )}
    </Layout>
  )
}
