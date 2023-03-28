import CardHeatSurferRow from '@/components/CardHeatSurfer'
import CardHeatSurferBlock from '@/components/CardHeatSurferBlock'
import TableLink from '@/components/tableComponents/TableLink'
import { Heat } from '@/utils/interfaces'
import { leadingZero } from '../format/leadingZero'
import { placeToString } from '../format/placeToString'
const heatCanceled = (heat: any) => heat.heatStatus == 'CANCELED'

// Rows
export const getHeadToHeadTableRows = (heats?: Heat[]) => {
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
  tableData.unshift({
    name: 'Event',
    id: 'event',
    content: (item: Heat) => (
      <div className={`${heatCanceled(item) && 'opacity-50'}`}>
        <div className="text-sm font-semibold text-navy  ">
          {item.event.year} {item.event.name}
        </div>
        <div className="text-gray-dark ">
          {item.heatRound} · Heat {leadingZero(item.heatNumber)}
        </div>
      </div>
    ),
  })
  longestHeat.length <= 3 && tableData.push({ name: '', id: 'link', className: 'w-px', content: (item: Heat) => <TableLink className={`${heatCanceled(item)  && 'opacity-50'}`} label="View Waves" canceled={item.heatStatus == 'CANCELED'} /> }) //prettier-ignore
  return tableData
}

// Blocks
export const getHeadToHeadTableBlocks = (heats?: Heat[], place?: boolean) => {
  if (!heats) return undefined
  const heatResults = heats.map((heat: any) => heat.heatResults)
  const longestHeat = heatResults.sort((a: any, b: any) => b.length - a.length)[0]
  const tableData = longestHeat.map((heatResult: any, index: number) => {
    return {
      name: heatResult.heatPlace,
      id: heatResult.heatPlace,
      content: (item: Heat) => <div className={`${heatCanceled(item) && 'opacity-50'}`}>{item.heatResults[index] ? <CardHeatSurferBlock heatResult={item.heatResults[index]!} place={place} /> : <div></div>}</div>,
    }
  })
  tableData.unshift({
    name: '',
    id: 'heat',
    content: (item: Heat) => (
      <div className={`flex w-full justify-between pb-2 ${heatCanceled(item) && 'opacity-50'}`}>
        <div>
          <div className="flex items-center font-normal">
            <div className="text-sm text-navy ">
              {item.event.year} {item.event.name}
            </div>
          </div>
          <div className="text-xs text-gray-500">
            {item.heatRound} · Heat {leadingZero(item.heatNumber)}
          </div>
        </div>
        <TableLink className="cursor-pointer text-sm" label="View Waves" canceled={item.heatStatus == 'CANCELED'} />
      </div>
    ),
  })
  return tableData
}
