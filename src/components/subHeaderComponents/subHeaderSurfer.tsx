import { RouterOutputs } from '@/utils/api'
import { configSurferImage } from '@/utils/format/configSurferImage'
import { RouterType, Surfer } from '@/utils/interfaces'
import Image from 'next/legacy/image'
import { useRouter } from 'next/router'
import CardSurferLoader from '../loaders/CardSurferLoader'

interface subHeaderSurferProps {
  surfer: Surfer | undefined //Surfer | undefined
  routePath?: RouterType
}

export default function SubHeaderSurfer({ surfer, routePath }: subHeaderSurferProps) {
  const router = useRouter()
  if (!surfer)
    return (
      <div className="h-14 sm:mr-2">
        <CardSurferLoader />
      </div>
    )

  const surferProfile = configSurferImage(surfer.profileImage, 200)
  return (
    <div onClick={() => routePath && router.replace(routePath)} className="transition-200 active:scale-[0.99] group flex w-full cursor-pointer items-center space-x-2 whitespace-nowrap sm:pr-4 ">
      <div className="transition-200 mr-2 h-14 w-14 flex-shrink-0 rounded-full bg-slate-900  hover-mod:group-hover:bg-gray-100 ">
        <Image src={surferProfile} className="rounded-full" width={100} height={101} objectFit={'contain'} />
      </div>
      <div className="flex-col">
        <div className="text-base font-semibold hover-mod:group-hover:text-blue-base">{surfer.name}</div>
        <div className="flex items-baseline space-x-1">
          <Image src={surfer.country.flagLink} width={18} height={12} />
          <div className="text-sm text-gray-500">{surfer.country.name}</div>
        </div>
      </div>
    </div>
  )
}
