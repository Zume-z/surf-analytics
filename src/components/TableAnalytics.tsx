export interface TableData {
  id: string
  name: string
  content: JSX.Element
  width?: string
  px?: string
}

export default function TableAnalytics({ tableData, items, itemKey, handleSelection, handleAddItem }: any) {
  return (
    <div className="flow-hidden my-8 w-full rounded-md  bg-white shadow-md">
      <div className="flex h-min flex-col">
        <div className="-mx-6 overflow-x-auto lg:-mx-8">
          <div className="inline-block min-w-full px-6 align-middle lg:px-8">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className=" bg-gray-light text-gray-dark ">
                  <tr>
                    {tableData.map((column: TableData) => (
                      <th key={column.id} scope="col" className=" px-6 py-3 text-left text-xs font-medium uppercase leading-4 tracking-wider">
                        {column.name}
                      </th>
                    ))}
                    <th className="w-0 whitespace-nowrap py-3 pr-4 text-right text-xs font-medium uppercase leading-4 tracking-wider ">Add Stat +</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white ">
                  {items.map((item: any) => (
                    <tr className="transition-200 group cursor-pointer hover-mod:hover:bg-gray-100" key={item[itemKey]} onClick={() => (handleSelection ? handleSelection(item) : null)}>
                      {tableData.map((row: TableData) => (
                        <td key={row.id} className={`whitespace-nowrap py-4 px-6 text-sm lg:px-8 ${row.width ? row.width + ' pr-8' : null}`}>
                          {row.content}
                        </td>
                      ))}
                      {/* Whole row on hover */}
                      <td></td> 
                    </tr>
                  ))}
                  <tr className="transition-200 group cursor-pointer">
                    <td onClick={() => handleAddItem()} className="whitespace-nowrap py-4 px-6  text-sm lg:px-8">
                      Add Item +
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
