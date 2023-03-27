import { EventResult } from '@/utils/interfaces'

export default function TableEventResultPoints({ eventResult, showThrowaways }: { eventResult: EventResult; showThrowaways?: boolean }) {
  return (
    <div className="table-item">
      <div className={`${showThrowaways == false ? '' : eventResult.throwaway && 'line-through'} ${eventResult.injured && 'text-red-500'}`}>{eventResult.points ? eventResult.points.toLocaleString('en-US') : '-'}</div>
    </div>
  )
}
