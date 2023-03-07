import { Event, EventResult } from '@/utils/interfaces'

export default function TableEventERPoints({ eventResult }: { eventResult: EventResult }) {
  // if (item.wildCard == true) return <div className="table-item">WC</div>
  return <div className="table-item">{eventResult.points ? eventResult.points.toLocaleString('en-US') : '-'}</div>
}

