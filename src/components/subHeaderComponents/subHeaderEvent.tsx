import { useRouter } from 'next/router'
import { RouterType, Event } from '@/utils/interfaces'
import { leadingZero } from '@/utils/format/leadingZero'
import CardEventLoader from '../loaders/CardEventLoader'
import { waitingPeriod } from '@/utils/format/getWaitingPeriod'
import { shortEventAddress } from '@/utils/format/shortEventAddress'

interface subHeaderEventProps {
  event: Event | undefined
  routePath?: RouterType
}

export default function SubHeaderEvent({ event, routePath }: subHeaderEventProps) {
  const router = useRouter()
  if (!event)
    return (
      <div className="mr-2 h-14">
        <CardEventLoader />
      </div>
    )
  return (
    <div onClick={() => routePath && router.replace(routePath)} className="group w-full items-center whitespace-nowrap active:scale-[0.99]  sm:pr-4 text-center sm:text-left">
      <div className="text-xs text-gray-dark">
        {waitingPeriod(event).toUpperCase()}, {event.year} · CT · EVENT {leadingZero(event.eventRound)}
      </div>
      <div className="transition-200 text-lg font-semibold text-navy hover-mod:group-hover:text-blue-base">{event.name}</div>
      <div className="text-sm text-gray-dark ">{shortEventAddress(event.address)}</div>
    </div>
  )
}
