export interface TableData {
  id: string
  name: string
  content: (item: any) => JSX.Element
  width?: string
  px?: string
}

export default function TableAnalyticsTest({ tableData, items, handleSelection }: any) {
  return (
    <div className="flow-hidden my-8 w-full rounded-md  bg-white shadow-md">
      <div className="flex h-min flex-col">
        <div className="-mx-6 overflow-x-auto lg:-mx-8">
          <div className="inline-block min-w-full px-6 align-middle lg:px-8">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className=" bg-gray-light text-gray-dark ">
                  <tr>
                    {tableData.map((column: TableData, i: number) => (
                      <th key={i} scope="col" className=" px-6 py-3 text-left text-xs font-medium uppercase leading-4 tracking-wider">
                        {column.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white ">
                  {items.map((item: any, i: number) => (
                    <tr className="transition-200 group cursor-pointer hover-mod:hover:bg-gray-100" key={i} onClick={() => (handleSelection ? handleSelection(item) : null)}>
                      {tableData.map((row: TableData, i: number) => (
                        <td key={i} className={`whitespace-nowrap py-4 px-6 text-sm lg:px-8 ${row.width ? row.width + ' pr-8' : null}`}>
                          {row.content(item)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

{
  /* <template>
  <div class="flex flex-col h-min">
    <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="inline-block min-w-full align-middle sm:px-6 lg:px-8">
        <div class="overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium uppercase leading-4 tracking-wider text-gray-500 bg-gray-50"
                  v-for="{ name, id } in columns"
                  :key="id"
                >
                  {{ name }}
                </th>
              </tr>
            </thead>
            <tbody v-if="loading" class=" bg-whitedivide-y divide-gray-200">
              <tr v-for="n in 3" :key="n">
                <td v-for="i in columns.length" :key="i" class="whitespace-nowrap py-4">
                  <div class="h-4 w-full animate-pulse rounded-full bg-gray-100" />
                </td>
              </tr>
            </tbody>
            <tbody v-else class=" bg-white divide-y divide-gray-200">
              <tr v-for="(item, i) in items" :class="['cursor-pointer', 'group item', 'hover:bg-gray-50']" :key="i" @click="handleSelection && handleSelection(item)">
                <td v-for="column in columns" :key="column.id" class="px-6  whitespace-nowrap py-4" :class="column.width, column.px">
                  <slot :name="column.id" :item="item" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <slot name="pagination" />
  </div>
</template> */
}
