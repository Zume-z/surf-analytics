import CardSurferLoader from './loaders/CardSurferLoader'

interface TableProps {
  tableData: any
  loading?: boolean
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
}

export default function TableHeat({ tableData, items, handleSelection, loading, className }: TableProps) {
  tableData ? tableData : (tableData = [1, 2, 3, 4])
  const loadingItems = [1, 2, 3, 4, 5]
  return (
    <div className={`my-8 w-full ${className}`}>
      {!loading && (
        <div className="space-y-4">
          {items.map((item: any, i: number) => (
            <div key={i} className="transition-200  active:scale-[0.995] hover-mod:hover:bg-gray-50 cursor-pointer rounded border p-2 sm:p-4 shadow-sm" onClick={() => (handleSelection ? handleSelection(item) : null)}>
              {tableData.map((row: TableData, index: number) => (
                <div key={index} className="flex ">
                  <div className="flex w-full items-center ">
                    <div className="w-full">{row.content(item)}</div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
      {/* Loader */}
      {loading && (
        <div className="space-y-4">
          {loadingItems.map((item: any, i: number) => (
            <div className="transition-200 cursor-pointer space-y-1 rounded border p-2 shadow-sm" key={i}>
              <div className="flex justify-between">
                <div className="space-y-1">
                  <div className="pulse-loader h-4 w-24" />
                  <div className="pulse-loader h-3 w-24" />
                </div>
                <div>
                  <div className="pulse-loader h-4 w-24" />
                </div>
              </div>
              <div className="flex justify-between">
                <CardSurferLoader />
                <div className="mt-2 space-y-1">
                  <div className="pulse-loader h-4 w-24" />
                  <div className="pulse-loader h-4 w-24" />
                </div>
              </div>
              <div className="flex justify-between">
                <CardSurferLoader />
                <div className="mt-2 space-y-1">
                  <div className="pulse-loader h-4 w-24" />
                  <div className="pulse-loader h-4 w-24" />
                </div>
              </div>
              <div className="flex justify-between">
                <CardSurferLoader />
                <div className="mt-2 space-y-1">
                  <div className="pulse-loader h-4 w-24" />
                  <div className="pulse-loader h-4 w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
