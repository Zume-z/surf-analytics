import type{ Event } from '@/utils/interfaces'
import { windowSize } from '@/utils/windowSize'
import { shortEventAddress } from '@/utils/format/shortEventAddress'
import { shortEventName } from '@/utils/format/shortEventName'

export default function CardEventLocation({ event }: { event: Event; showYear?: boolean }) {
  return (
    <div>
      <div className="text-base font-semibold text-navy">{event.year}</div>
      <div className="flex-col items-center">
        <div className="text-gray-dark ">{windowSize().width! > 640 ? event.name : shortEventName(event.name)}</div>
        <div className="text-gray-dark ">{windowSize().width! > 640 ? event.address : shortEventAddress(event.address)}</div>
      </div>
    </div>
  )
}
