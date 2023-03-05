import Image from 'next/legacy/image'
import { twoDec } from '@/utils/format/roundTwoDec'
import { bgJerseyColor } from '@/utils/format/bgJerseyColor'
import { configSurferImage } from '@/utils/format/configSurferImage'
import TriangleFill from './icons/IconTriangleFill'
import TriangleOutline from './icons/IconTriangleOutline'

export default function CardHeatSurferBlock({ heatResult, place }: { heatResult: any; place?: boolean }) {
  const surferProfile = configSurferImage(heatResult.surfer.profileImage, 96)
  const interference = heatResult.interferenceOne || heatResult.interferenceTwo || heatResult.interferenceThree
  return (
    <div className="flex justify-between border-t py-2 ">
      <div className="group flex items-center whitespace-nowrap text-sm">
        {place && <div className="table-item mr-2 text-base text-gray-dark">{heatResult.heatPlace}</div>}
        <div className={`h-12 w-12 flex-shrink-0 rounded-full  ${bgJerseyColor(heatResult.jerseyColor)}`}>
          <Image src={surferProfile} className="rounded-full" width={100} height={99} />
        </div>
        <div className="ml-2">
          <div className="transition-200 text-navy hover-mod:group-hover:font-medium">{heatResult.surfer.name}</div>
          <div className="flex items-center space-x-1">
            <Image src={heatResult.surfer.country.flagLink} width={16} height={11} />
            <div className="text-gray-dark ">{heatResult.surfer.country.name}</div>
          </div>
        </div>
      </div>
      <div className="flex items-center ">
        <div className="text-end ">
          <div className={`justify-end text-sm ${interference && 'text-red-500'} `}>{twoDec(heatResult.heatTotal)}</div>
          <div className="flex items-center">
            {heatResult.interferenceOne && !heatResult.interferenceTwo && !heatResult.interferenceThree && <TriangleOutline className="mr-1 h-3 w-3 text-red-500 " />}
            {heatResult.interferenceTwo && !heatResult.interferenceThree && <TriangleFill className=" mr-1 h-3 w-3 text-red-500 " />}
            {heatResult.interferenceThree && !heatResult.interferenceTwo && <TriangleFill className=" mr-1 h-3 w-3 text-red-500 " />}
            {heatResult.interferenceThree && heatResult.interferenceTwo && <TriangleFill className=" mr-1 h-3 w-3 text-red-500 " />}
            <div className={`text-xs ${interference ? 'text-red-500' : 'text-gray-400'} `}>
              {twoDec(heatResult.scoreOne)} {heatResult.scoreTwo ? `+  ${twoDec(heatResult.scoreTwo)}` : ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
