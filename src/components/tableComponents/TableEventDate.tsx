import { Event } from '@/utils/interfaces'
import { CardEventStatus } from '../CardEventStatus'
import { waitingPeriod } from '@/utils/format/getWaitingPeriod'

export default function TableEventDate({ event, showYear }: { event: Event, showYear?: boolean }) {
  return (
    <div className="table-item space-y-2">
      {showYear && <div>{event.tour.year}</div>}
      <div className='text-sm'>{waitingPeriod(event)}</div>
      {!showYear && <div className="block w-min md:hidden">{CardEventStatus(event)}</div>}
    </div>
  )
}
