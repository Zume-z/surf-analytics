import { Heat } from '../interfaces'
import { leadingZero } from './leadingZero'
import CardHeat from '@/components/CardHeat'
import { placeToString } from './placeToString'
import CardHeatSurferRow from '@/components/CardHeatSurfer'
import CardHeatSurferBlock from '@/components/CardHeatSurferBlock'
import TableLink from '@/components/tableComponents/TableLink'
const heatCanceled = (heat: any) => heat.heatStatus == 'CANCELED'

// Rows
export const getHeatTableRows = (heats?: Heat[]) => {
  if (!heats) return undefined
  const heatResults = heats.map((heat: any) => heat.heatResults)
  const longestHeat = heatResults.sort((a: any, b: any) => b.length - a.length)[0]
  const tableData = longestHeat.map((heatResult: any, index: number) => {
    return {
      name: placeToString(heatResult.heatPlace),
      id: heatResult.heatPlace,
      content: (item: Heat) => <div className={`${heatCanceled(item) && 'opacity-50'}`}>{item.heatResults[index] && <CardHeatSurferRow heatResult={item.heatResults[index]!} />}</div>,
    }
  })
  tableData.unshift({ name: 'Heat', id: 'heat', content: (item: Heat) => <div className={`${heatCanceled(item)  && 'opacity-50'}`}><CardHeat heat={item} /></div> }) //prettier-ignore
  longestHeat.length <= 3 && tableData.push({ name: '', id: 'link', className: 'w-px', content: (item: Heat) => <TableLink className={`${heatCanceled(item)  && 'opacity-50'}`} label="View Waves" canceled={item.heatStatus == 'CANCELED'} /> }) //prettier-ignore
  return tableData
}

// Blocks
export const getHeatTableBlocks = (heats?: Heat[], place?: boolean) => {
  if (!heats) return undefined

  const heatResults = heats.map((heat: any) => heat.heatResults)
  const longestHeat = heatResults.sort((a: any, b: any) => b.length - a.length)[0]
  const tableData = []

  longestHeat.map((heatResult: any, index: number) => {
    tableData.push({
      name: heatResult.heatPlace,
      id: heatResult.heatPlace,
      content: (item: Heat) => <div className={`${heatCanceled(item) && 'opacity-50'}`}> {item.heatResults[index] && <CardHeatSurferBlock heatResult={item.heatResults[index]!} place={place} />}</div>,
    })
  })
  tableData.unshift({
    name: '',
    id: 'heat',
    content: (item: Heat) => (
      <div className={`flex w-full justify-between pb-2 ${heatCanceled(item) && 'opacity-50'}`}>
        <div>
          <div className="flex items-center font-normal">
            <div className="text-sm text-gray-900">
              Heat {leadingZero(item.heatNumber)} · {item.heatRound}
            </div>
          </div>
          <div className="text-xs text-gray-500"> {item.heatDate}</div>
        </div>
        <TableLink className="cursor-pointer text-sm" label="View Waves" canceled={item.heatStatus == 'CANCELED'} />
      </div>
    ),
  })
  return tableData
}
