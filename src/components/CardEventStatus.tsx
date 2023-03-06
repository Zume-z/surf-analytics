import { eventStatus } from '@/utils/format/eventStatus'
import type { Event } from '@/utils/interfaces'

export const CardEventStatus = (event: Event) => {
  const status = eventStatus(event)
  const waitingPeriodBtn = 'rounded-md border py-0.5 px-2 text-center text-xs '
  const completed = <div className={waitingPeriodBtn + 'border-green-500 text-green-500'}>Completed</div>
  const upcoming = <div className={waitingPeriodBtn + 'border-gray-300 text-gray-500'}>Upcoming</div>
  const canceled = <div className={waitingPeriodBtn + 'border-gray-300 text-gray-500'}>Cancelled</div>
  const inProgress = (
    <div className={waitingPeriodBtn + 'flex items-center space-x-1 border-gray-300 bg-black text-white'}>
      <div>In Progress</div>
      <div className="h-2 w-2 animate-pulse rounded-full bg-red-500"></div>
    </div>
  )
  if (status == 'Canceled') return canceled
  if (status == 'Completed') return completed
  if (status == 'In Progress') return inProgress
  if (status == 'Upcoming') return upcoming
}
