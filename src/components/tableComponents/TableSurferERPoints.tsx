import { Event, EventResult } from '@/utils/interfaces'

export default function TableEventResultPoints({ eventResult }: { eventResult: EventResult }) {
  
  return (
    <div className="table-item">
      <div className={`${eventResult.throwaway && 'line-through'} ${eventResult.injured && 'text-red-500'}`}>{eventResult.points ? eventResult.points.toLocaleString('en-US') : '-'}</div>
    </div>
  )
}

