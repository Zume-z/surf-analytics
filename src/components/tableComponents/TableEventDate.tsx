import { Event } from '@/utils/interfaces'
import { CardEventStatus } from '../CardEventStatus'
import { waitingPeriod } from '@/utils/format/getWaitingPeriod'

export default function TableEventDate({ event }: { event: Event }) {
  return (
    <div className="table-item space-y-2">
      <div>{waitingPeriod(event)}</div>
      <div className="block w-min md:hidden">{CardEventStatus(event)}</div>
    </div>
  )
}
