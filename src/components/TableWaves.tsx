import Image from 'next/legacy/image'
import { BREAKPOINT } from '@/utils/constants'
import { windowSize } from '@/utils/windowSize'
import TriangleFill from './icons/IconTriangleFill'
import { twoDec } from '@/utils/format/roundTwoDec'
import TriangleOutline from './icons/IconTriangleOutline'
import { bgJerseyColor } from '@/utils/function/getJerseyColor'
import { capitalizeFirst } from '@/utils/format/capitalizeFirst'
import { shortSurferName } from '@/utils/format/truncate/shortSurferName'

export interface TableData {
  value: string | number
  key: string
}

interface TableWavesProps {
  tableData: TableData[]
  items: any[]
  handleSelection?: (item: any) => void
  loading?: boolean
}

const Surfer = ({ heatResult }: { heatResult: any }) => {
  const interference = heatResult.interferenceOne || heatResult.interferenceTwo || heatResult.interferenceThree
  return (
    <div className="items-center whitespace-nowrap text-sm sm:-ml-3 sm:flex">
      <div className="flex items-center justify-center">
        <div className={`h-12 w-12 flex-shrink-0 rounded-full border border-gray-300  ${bgJerseyColor(heatResult.jerseyColor, 'bg-navy')}`}>
          <Image src={heatResult.surfer.profileImage} className={`rounded-full`} width={48} height={48} />
        </div>
      </div>
      <div className="sm:ml-2">
        <div className="hidden text-center text-gray-500 sm:block">{heatResult.surfer.name}</div>
        <div className="block text-center text-xs text-gray-500 sm:hidden">{shortSurferName(heatResult.surfer.name)}</div>
        <div className="flex w-full items-center justify-center sm:justify-start">
          <div className={`pr-1 text-xs font-normal ${interference ? 'text-red-500' : 'text-gray-500'}`}>{twoDec(heatResult.heatTotal)}</div>
          {heatResult.interferenceOne && !heatResult.interferenceTwo && !heatResult.interferenceThree && <TriangleOutline className=" h-3 w-3 text-red-500 " />}
          {heatResult.interferenceTwo && !heatResult.interferenceThree && <TriangleFill className="  h-3 w-3 text-red-500 " />}
          {heatResult.interferenceThree && !heatResult.interferenceTwo && <TriangleFill className="  h-3 w-3 text-red-500 " />}
          {heatResult.interferenceThree && heatResult.interferenceTwo && <TriangleFill className="  h-3 w-3 text-red-500 " />}
        </div>
      </div>
    </div>
  )
}

const SurferLoader = () => {
  return (
    <div className="items-center whitespace-nowrap text-sm sm:-ml-3 sm:flex">
      <div className="flex items-center justify-center  pb-1">
        <div className="h-12 w-12 flex-shrink-0 rounded-full ">
          <div className="transition-200 pulse-loader h-12 w-12 rounded-full border border-gray-200 bg-gray-100 hover-mod:hover-mod:group-hover:bg-white" />
        </div>
      </div>
      <div className="ml-2 space-y-1 ">
        <div className=" flex justify-center text-center  ">
          <div>
            <div className="pulse-loader h-4 w-24" />
          </div>
        </div>
        <div className=" flex justify-center text-center  ">
          <div>
            <div className="pulse-loader h-4 w-24" />
          </div>
        </div>
      </div>
    </div>
  )
}
const Wave = ({ item, col }: { item: any; col: any }) => {
  if (item[col.key].interference || item[col.key].intPenalty) {
    return (
      <div className="flex">
        <div className="flex w-full justify-center sm:justify-start">
          <div className="text-red-500 ">{item[col.key].waveScore}</div>
          {item[col.key].interference == 'PENALTYONE' && <div className="-mr-1.5 ml-0.5 -mt-1 text-[8px] text-red-500 opacity-100 md:hover-mod:group-hover:opacity-0">1</div>}
          {item[col.key].interference == 'PENALTYONE' && windowSize().width! > BREAKPOINT.md && <div className="transition-200 ml-1 h-full text-red-500 opacity-0 hover-mod:group-hover:opacity-100 ">· Interference Penalty 1</div>}
          {item[col.key].interference == 'PENALTYTWO' && <div className="-mr-1.5 ml-0.5 -mt-1 text-[8px] text-red-500 opacity-100 md:hover-mod:group-hover:opacity-0">1</div>}
          {item[col.key].interference == 'PENALTYTWO' && windowSize().width! > BREAKPOINT.md && <div className="transition-200 ml-1 h-full text-red-500 opacity-0 hover-mod:group-hover:opacity-100 ">· Interference Penalty 2</div>}
          {item[col.key].interference == 'PENALTYTHREE' && <div className="-mr-1.5 ml-0.5 -mt-1 text-[8px] text-red-500 opacity-100 md:hover-mod:group-hover:opacity-0">1</div>}
          {item[col.key].interference == 'PENALTYTHREE' && windowSize().width! > BREAKPOINT.md && <div className="transition-200 ml-1 h-full text-red-500 opacity-0 hover-mod:group-hover:opacity-100 ">· Interference Penalty 3</div>}
          {item[col.key].intPenalty == 'HALVED_ONE' && <div className="-mr-1.5 ml-0.5 -mt-1 text-[8px] text-red-500 opacity-100 md:hover-mod:group-hover:opacity-0">2</div>}
          {item[col.key].intPenalty == 'HALVED_ONE' && windowSize().width! > BREAKPOINT.md && <div className="transition-200 ml-1 h-full text-red-500 opacity-0 hover-mod:group-hover:opacity-100 ">· Score Halved </div>}
          {item[col.key].intPenalty && item[col.key].intPenalty != 'HALVED_ONE' && <div className="-mr-1.5 ml-0.5 -mt-1 text-[8px] text-red-500 opacity-100 md:hover-mod:group-hover:opacity-0">2</div>}
          {item[col.key].intPenalty && item[col.key].intPenalty != 'HALVED_ONE' && windowSize().width! > BREAKPOINT.md && <div className="transition-200 ml-1 h-full text-red-500 opacity-0 hover-mod:group-hover:opacity-100 ">· Score Zeroed </div>}
        </div>
      </div>
    )
  } else {
    return (
      <div className={`flex  ${item[col.key].countedWave ? 'text-green-500' : 'text-gray-500'}`}>
        <div className="flex w-full justify-center sm:justify-start">
          <div className="">{twoDec(item[col.key].waveScore)}</div>
          {item[col.key].waveDirection && <div className="-mr-1.5 ml-0.5 -mt-1 text-[8px] opacity-100 md:hover-mod:group-hover:opacity-0">{item[col.key].waveDirection.charAt(0)}</div>}
          {item[col.key].waveDirection && windowSize().width! > BREAKPOINT.md && <div className="transition-200 ml-1 h-full opacity-0 hover-mod:group-hover:opacity-100 ">· {capitalizeFirst(item[col.key].waveDirection)}</div>}
        </div>
      </div>
    )
  }
}

export default function TableWaves({ tableData, items, handleSelection, loading }: TableWavesProps) {
  const loader = {
    headerColumns: [1, 2],
    columns: [1, 2, 3],
    rows: [1, 2, 3, 4, 5],
  }

  const tableSpacing = 'whitespace-nowrap  px-1.5 first:pl-6 last:pr-6 sm:px-6 '
  const tableCol = tableSpacing + ' font-medium text-left sm:py-4 py-2 pt-4 leading-4 tracking-wider text-xs font-medium'
  const tableRow = tableSpacing + ' text-sm py-4'

  return (
    <div className="flow-hidden my-8 w-full rounded-md bg-white  sm:my-8">
      <div className="flex h-min flex-col">
        <div className="scrollbar-none scrollbar-none -mx-4 overflow-x-auto border-t  shadow-md md:mx-0 md:border-none">
          <div className="inline-block min-w-full align-middle">
            <div className="scrollbar-none overflow-hidden">
              {!loading && (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-light text-gray-dark">
                    <tr>
                      {tableData.map((heatResult: any, i: number) => (
                        <th key={i} scope="col" className={tableCol + ' align-bottom sm:align-middle'}>
                          {heatResult.key == 'wave' && <div className="flex h-full uppercase sm:block">{heatResult.value}</div>}
                          {heatResult.key != 'wave' && <Surfer heatResult={heatResult.value} />}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {items.map((item: any, i: number) => (
                      <tr className="group hover-mod:hover:bg-gray-100" key={i} onClick={() => (handleSelection ? handleSelection(item) : null)}>
                        {tableData.map((col: any, i: number) => (
                          <td key={i} className={tableRow}>
                            {col.key == 'wave' && <div className="ml-3"> {item[col.key]} </div>}
                            {item[col.key] != null && col.key != 'wave' && <Wave item={item} col={col} />}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {loading && (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className=" bg-gray-light text-gray-dark ">
                    <tr>
                      <th scope="col" className={tableCol + ' align-bottom sm:min-w-[150px] sm:align-middle '}>
                        <div className={`pulse-loader h-5 w-full min-w-[15px] max-w-[115px]  `} />
                      </th>
                      {loader.headerColumns.map((key: number, i: number) => (
                        <th key={i} scope="col" className={tableCol + ' align-bottom sm:align-middle'}>
                          <div>{SurferLoader()}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {loader.rows.map((item: any, index: number) => (
                      <tr className="hover-mod:hover:bg-gray-100 " key={index}>
                        {loader.columns.map((col: any, i: number) => (
                          <td key={i} className={tableRow}>
                            <div className="flex justify-center sm:block ">
                              <div className={`pulse-loader h-5 w-full min-w-[15px] max-w-[115px]  `} />
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
