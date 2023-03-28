import { ChevronDownIcon, XIcon, MinusIcon } from '@heroicons/react/outline'
import { useState } from 'react'

interface TableProps {
  title?: string
  tableData: any
  loading?: boolean
  cutOff?: number
  items: any[]
  handleSelection?: (item: any) => void
  className?: string
}

export interface TableData {
  id: string
  name: string
  content: (item: any) => JSX.Element
  loader?: JSX.Element
  className?: string
  cutOff?: (item: any) => boolean
}

export default function Table({ title, tableData, items, handleSelection, loading, className, cutOff }: TableProps) {
  const [sort, setSort] = useState('false')

  const handleSort = () => {
    sort == 'false' && setSort('asc')
    sort == 'asc' && setSort('desc')
    sort == 'desc' && setSort('false')
  }

  const loadingRows = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

  const beforeCutoff = items.slice(0, cutOff)
  const afterCutoff = items.slice(cutOff, items.length)

  const tableSpacing = 'whitespace-nowrap py-4 px-1.5 first:pl-6 last:pr-6 sm:px-6 '
  const tableCol = tableSpacing + ' font-medium text-left uppercase leading-4 tracking-wider text-xs font-medium'
  const tableRow = tableSpacing + ' text-sm'
  tableData ? tableData : (tableData = [1, 2, 3, 4])
  return (
    <div className={`w-full rounded-md ${className} ${title ? 'my-4 sm:my-8' : 'my-8'}`}>
      {title && <div className="mb-4 block text-center font-semibold text-gray-700 sm:hidden ">{title}</div>}
      <div className="rounded-md bg-white">
        <div className="flex h-min flex-col">
          <div className=" scrollbar-none -mx-4 overflow-x-auto border-b sm:mx-0 sm:border-none sm:shadow-md">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden ">
                {!loading && (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className=" bg-gray-light text-gray-dark ">
                      <tr>
                        {tableData.map((column: TableData, i: number) => (
                          <th key={i} scope="col" className={tableCol}>
                            <div>{column.name}</div>

                            {/* SORTING TEST */}
                            {/* <div className="flex items-center space-x-1" onClick={() => handleSort()}>
                              <div>{column.name}</div>
                              {sort == 'asc' && <ChevronDownIcon height={12} />}
                              {sort == 'desc' && <ChevronDownIcon className="rotate-180" height={12} />}
                            </div> */}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    {/* TABLE  */}
                    {!cutOff && (
                      <tbody className="divide-y  divide-gray-200 bg-white  ">
                        {items.map((item: any, i: number) => (
                          <tr className="transition-200 group relative cursor-pointer active:scale-[0.995] hover-mod:hover:bg-gray-100 " key={i} onClick={() => (handleSelection ? handleSelection(item) : null)}>
                            {tableData.map((row: TableData, index: number) => (
                              <td key={index} className={`${tableRow} ${row.className}`}>
                                {row.content(item)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    )}

                    {/* CUTOFF TABLE */}
                    {cutOff && (
                      <tbody className="divide-y divide-gray-200 bg-white  ">
                        {beforeCutoff.map((item: any, i: number) => (
                          <tr className="transition-200 group relative cursor-pointer active:scale-[0.995] hover-mod:hover:bg-gray-100 " key={i} onClick={() => (handleSelection ? handleSelection(item) : null)}>
                            {tableData.map((row: TableData, index: number) => (
                              <td key={index} className={`${tableRow} ${row.className}`}>
                                {row.content(item)}
                              </td>
                            ))}
                          </tr>
                        ))}

                        <tr>
                          <td className=" bg-navy p-4 font-semibold text-gray-50">MID-SEASON CUT LINE</td>
                          <td className=" bg-navy"></td>
                          <td className=" bg-navy"></td>
                        </tr>

                        {afterCutoff.map((item: any, i: number) => (
                          <tr className="transition-200 group relative cursor-pointer active:scale-[0.995] hover-mod:hover:bg-gray-100 " key={i} onClick={() => (handleSelection ? handleSelection(item) : null)}>
                            {tableData.map((row: TableData, index: number) => (
                              <td key={index} className={`${tableRow} ${row.className}`}>
                                {row.content(item)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    )}
                  </table>
                )}
                {loading && (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className=" bg-gray-light text-gray-dark ">
                      <tr>
                        {tableData.map((column: TableData, i: number) => (
                          <th key={i} scope="col" className={tableCol}>
                            {column.name || column.name == '' ? column.name : <div className={`h-5 w-32 flex-1 animate-pulse rounded-lg  bg-gray-200`} />}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white ">
                      {loadingRows.map((item: any, i: number) => (
                        <tr key={i}>
                          {tableData.map((row: TableData, index: number) => (
                            <td key={index} className={`${tableRow}`}>
                              {row.loader ? row.loader : <div className={`h-5 w-full min-w-[25px] max-w-[125px] flex-1 animate-pulse rounded-lg  bg-gray-200`} />}
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
    </div>
  )
}
