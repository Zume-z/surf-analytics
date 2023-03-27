import type { Location } from '@/utils/interfaces'
import { shortEventAddress } from '@/utils/format/truncate/shortEventAddress'

import Image from 'next/legacy/image'

export default function CardLocation({ location }: { location: Location }) {
  return (
    <div>
      <div className="text-base font-semibold text-navy">{location.eventName}</div>
      <div className="flex items-center space-x-1">
        <Image src={location.country.flagLink} width={16} height={11} />
        <div className="text-gray-dark">{shortEventAddress(location.events[0]!.address)}</div>
      </div>
    </div>
  )
}
