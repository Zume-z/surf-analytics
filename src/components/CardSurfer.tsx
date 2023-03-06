import Image from 'next/legacy/image'
import type { Surfer } from '@/utils/interfaces'
import { configSurferImage } from '@/utils/format/configSurferImage'

interface CardSurferProps {
  surfer: Surfer
  place?: number
}

export default function CardSurfer({ surfer, place }: CardSurferProps) {
  const surferProfile = configSurferImage(surfer.profileImage, 96)
  return (
    <div>
      <div className="flex items-center whitespace-nowrap text-sm">
        {place && <div className="table-item -ml-2 mr-2 text-base text-gray-dark">{place}</div>}
        <div className={`transition-200 h-12 w-12 flex-shrink-0 rounded-full  bg-gray-100 hover-mod:group-hover:bg-white`}>
          <Image src={surferProfile} className="rounded-full" width={100} height={99} />
        </div>
        <div className="ml-2">
          <div className="">{surfer.name}</div>
          <div className="flex items-center space-x-1">
            <Image src={surfer.country.flagLink} width={16} height={11} />
            <div className="text-gray-dark ">{surfer.country.name}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
