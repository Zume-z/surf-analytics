import Image from 'next/legacy/image'
import { Country } from '@/utils/interfaces'

export default function CardCountry({ country }: { country: Country }) {
  return (
    <div className="flex items-center  ">
      <div className=" h-6 w-10 flex-shrink-0">
        <Image className="" src={country.flagLink} width={40} height={24} />
      </div>
      <div className="ml-2 ">
        <div className="ml-2 flex-row items-center">
          <div className="text-base font-semibold text-navy">{country.name}</div>
          <div className="text-xs text-gray-dark">
            {country.surfers.length} SURFERS {country.events.length != 0 && `· ${country.events.length} EVENTS`}
          </div>
        </div>
      </div>
    </div>
  )
}
