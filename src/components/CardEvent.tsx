import type{ Event } from '@/utils/interfaces'
import { windowSize } from '@/utils/windowSize'
import { leadingZero } from '@/utils/format/leadingZero'
import { genderFormat } from '@/utils/format/genderFormat'
import { shortEventAddress } from '@/utils/format/shortEventAddress'
import { shortEventName } from '@/utils/format/shortEventName'

export default function CardEvent({ event, showYear }: { event: Event; showYear?: boolean }) {
  return (
    <div>
      <div className="text-base font-semibold text-navy">{windowSize().width! > 640 ?event.name : shortEventName(event.name)}</div>
      <div className="flex-col items-center">
        <div className="text-gray-dark ">{windowSize().width! > 640 ? event.address : shortEventAddress(event.address)}</div>
        {showYear ? (
          <div className=" text-gray-dark">
            {genderFormat(event.tour.gender)} · {event.year}
          </div>
        ) : (
          <div className=" flex space-x-2 text-gray-dark">Event {leadingZero(event.eventRound)}</div>
        )}
      </div>
    </div>
  )
}
