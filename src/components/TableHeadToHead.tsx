import Image from 'next/legacy/image'
import { breakPoint } from '@/utils/constants'
import { windowSize } from '@/utils/windowSize'
import TriangleFill from './icons/IconTriangleFill'
import { twoDec } from '@/utils/format/roundTwoDec'
import TriangleOutline from './icons/IconTriangleOutline'
import { bgJerseyColor } from '@/utils/format/bgJerseyColor'
import { capitalizeFirst } from '@/utils/format/capitalizeFirst'
import { shortSurferName } from '@/utils/format/shortSurferName'

export interface TableData {
  value: string | number
  key: string
}

interface TableWavesProps {
  tableData: TableData[]
  items: any
  handleSelection?: (item: any) => void
  loading?: boolean
}


const surferLoader = () => {
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



export default function TableHeadToHead({ tableData, items, handleSelection, loading }: TableWavesProps) {
  const loader = {
    headerColumns: [1, 2],
    columns: [1, 2, 3],
    rows: [1, 2, 3, 4, 5],
  }

  const tableSpacing = 'whitespace-nowrap  px-1.5 first:pl-6 last:pr-6 sm:px-6 '
  const tableCol = tableSpacing + ' font-medium text-left sm:py-4 py-2 pt-4 leading-4 tracking-wider text-xs font-medium'
  const tableRow = tableSpacing + ' text-sm py-4'

  return (
    <div className="flow-hidden mb-8 w-full rounded-md bg-white  sm:my-8">
      <div className="flex h-min flex-col">
        <div className="-mx-4 overflow-x-auto scrollbar-none shadow-md md:mx-0">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden scrollbar-none">
              {!loading && (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className=" bg-gray-light text-gray-dark ">
                    <tr>
                      {tableData.map((col: any, i: number) => (
                        <th key={i} scope="col" className={tableCol + ' align-bottom sm:align-middle'}>
                          {col.label}
                          {/* {heatResult.key == 'wave' && <div className="flex h-full  uppercase sm:block">{heatResult.value}</div>} */}
                          {/* {heatResult.key != 'wave' && <Surfer heatResult={heatResult.value} />} */}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {items.map((item: any, i: number) => (
                      <tr className="group hover-mod:hover:bg-gray-100" key={i} onClick={() => (handleSelection ? handleSelection(item) : null)}>
                        {tableData.map((col: any, i: number) => (
                          <td key={i} className={tableRow}>
                            {item[col.key]}
                            {/* {col.key == 'wave' && <div> {item[col.key]} </div>} */}
                            {/* {item[col.key] != null && col.key != 'wave' && <Wave item={item} col={col} />} */}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {/* {loading && (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className=" bg-gray-light text-gray-dark ">
                    <tr>
                      <th scope="col" className={tableCol + ' align-bottom sm:min-w-[150px] sm:align-middle '}>
                        <div className={`pulse-loader h-5 w-full min-w-[15px] max-w-[115px]  `} />
                      </th>
                      {loader.headerColumns.map((key: number, i: number) => (
                        <th key={i} scope="col" className={tableCol + ' align-bottom sm:align-middle'}>
                          <div>{surferLoader()}</div>
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
              )} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
