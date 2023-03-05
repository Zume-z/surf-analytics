import { EventResult } from '@/utils/interfaces'
import { ordinalSuffix } from '@/utils/format/ordinalSuffix'

export default function TableEventResultPlace({ eventResult }: { eventResult: EventResult }) {
  return (
    <div className="table-item">
      {eventResult.injured && !eventResult.withdrawn && <div className="text-red-500">INJ</div>}
      {eventResult.withdrawn && !eventResult.injured && <div className="text-gray-500">Withdrawn</div>}
      {!eventResult.injured && !eventResult.withdrawn && <div>{ordinalSuffix(eventResult.place)}</div>}
    </div>
  )
}
