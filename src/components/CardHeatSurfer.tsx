import Image from 'next/legacy/image'
import TriangleFill from './icons/IconTriangleFill'
import { twoDec } from '@/utils/format/roundTwoDec'
import TriangleOutline from './icons/IconTriangleOutline'
import { bgJerseyColor } from '@/utils/format/bgJerseyColor'
import { configSurferImage } from '@/utils/format/configSurferImage'


export default function CardHeatSurferRow({ heatResult }: { heatResult: any }) {
  const surferProfile = configSurferImage(heatResult.surfer.profileImage, 96)
  const interference = heatResult.interferenceOne || heatResult.interferenceTwo || heatResult.interferenceThree
  return (
    <div className="group flex items-center whitespace-nowrap text-sm">
      <div className={`h-12 w-12 flex-shrink-0 rounded-full  ${bgJerseyColor(heatResult.jerseyColor, 'bg-gray-100 transition-200 hover-mod:group-hover:bg-white')}`}>
        <Image src={surferProfile} className="rounded-full" width={100} height={99} />
      </div>
      <div className="ml-2">
        <div className="flex items-center">
          <div className="transition-200 text-navy ">{heatResult.surfer.name}</div>
        </div>
        <div className="flex items-center space-x-1">
          <div className={`text-xs ${interference ? 'text-red-500' : 'text-gray-500'} `}>{twoDec(heatResult.heatTotal)}</div>
          <div className={`text-xs ${interference ? 'text-red-500' : 'text-gray-400'} `}>
            ({twoDec(heatResult.scoreOne)}
            {heatResult.scoreTwo ? ` +  ${twoDec(heatResult.scoreTwo)}` : ''})
          </div>
          {heatResult.interferenceOne && !heatResult.interferenceTwo && !heatResult.interferenceThree && <TriangleOutline className="ml-1 mb-0.5 h-3 w-3 text-red-500 " />}
          {heatResult.interferenceTwo && !heatResult.interferenceThree && <TriangleFill className=" ml-1 mb-0.5 h-3 w-3 text-red-500 " />}
          {heatResult.interferenceThree && !heatResult.interferenceTwo && <TriangleFill className=" ml-1 mb-0.5 h-3 w-3 text-red-500 " />}
          {heatResult.interferenceThree && heatResult.interferenceTwo && <TriangleFill className=" ml-1 mb-0.5 h-3 w-3 text-red-500 " />}
        </div>
      </div>
    </div>
  )
}
