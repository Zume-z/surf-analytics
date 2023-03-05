import { Event, EventResult } from '@/utils/interfaces'

export default function TableEventResultPoints({ eventResult }: { eventResult: EventResult }) {
  // { name: 'Points', id: 'points', content: (item: EventResult) => <div className={`table-item  ${item.throwaway && 'line-through'}	`}>{item.points ? item.points.toLocaleString('en-US') : '-'}</div> }, // prettier-ignore
  return (
    <div className="table-item">
      <div className={`${eventResult.throwaway && 'line-through'} ${eventResult.injured && 'text-red-500'}`}>{eventResult.points ? eventResult.points.toLocaleString('en-US') : '-'}</div>
    </div>
  )
}
