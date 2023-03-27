import type { Event } from '@/utils/interfaces'
import { windowSize } from '@/utils/windowSize'
import { shortEventName } from '@/utils/format/truncate/shortEventName';
import { shortEventAddress } from '@/utils/format/truncate/shortEventAddress';


export default function CardLocationResult({ event }: { event: Event; showYear?: boolean }) {
  return (
    <div>
      <div className="text-base  font-semibold text-navy">{event.tour.year}</div>
      <div className="flex-col items-center">
        <div className="text-xs text-gray-dark sm:text-sm ">{windowSize().width! > 640 ? event.name : shortEventName(event.name)}</div>
        <div className="text-xs text-gray-dark sm:text-sm ">{windowSize().width! > 640 ? event.address : shortEventAddress(event.address)}</div>
      </div>
    </div>
  )
}

