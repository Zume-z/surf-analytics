import Image from 'next/legacy/image'
import type { Surfer } from '@/utils/interfaces'
import { configSurferImage } from '@/utils/format/configSurferImage'
import { shortSurferName } from '@/utils/format/truncate/shortSurferName'


interface CardSurferProps {
  surfer: Surfer
  place?: number
  showFirst?: boolean
  highlightSelect?: boolean
  adaptive?: boolean
}

export default function CardSurfer({ surfer, place, showFirst, highlightSelect, adaptive }: CardSurferProps) {
  if (!surfer) return null
  const surferProfile = configSurferImage(surfer.profileImage, 96)
  return (
    <div className="group/surfer">
      <div className="flex items-center whitespace-nowrap text-sm ">
        {place && <div className="table-item -ml-2 mr-2 text-base text-gray-dark">{place}</div>}
        <div className={`transition-200 h-12 w-12 flex-shrink-0 rounded-full bg-gray-100 hover-mod:group-hover:bg-white ${adaptive ?  'sm:h-12 sm:w-12 h-9 w-9' : 'h-12 w-12' } ${showFirst && place == 1 ? 'border bg-yellow-300' : 'bg-gray-100'}  `}>
          <Image src={surferProfile} className="rounded-full" width={100} height={99} />
        </div>
        <div className="ml-2">
          {!adaptive && <div className={highlightSelect ? 'hover-mod:group-hover/surfer:text-blue-base' : ''}>{surfer.name}</div>}
          {adaptive && (
            <div>
              <div className={`hidden sm:block ${highlightSelect ? 'hover-mod:group-hover/surfer:text-blue-base' : ''}`}>{surfer.name}</div>
              <div className="block sm:hidden">{shortSurferName(surfer.name)}</div>
            </div>
          )}
          <div className="flex items-center space-x-1">
            <Image src={surfer.country.flagLink} width={16} height={11} />
            <div className="text-gray-dark ">{surfer.country.name}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
