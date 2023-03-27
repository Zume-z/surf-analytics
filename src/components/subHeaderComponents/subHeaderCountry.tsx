import Image from 'next/legacy/image'
import { useRouter } from 'next/router'
import { RouterType, Country } from '@/utils/interfaces'
import CardCountryLoader from '../loaders/CardCountryLoader'
import { configFlagImage } from '@/utils/format/configFlagImage'

interface subHeaderCountryProps {
  country: Country | undefined
  routePath?: RouterType
}

export default function SubHeaderCountry({ country, routePath }: subHeaderCountryProps) {
  const router = useRouter()
  if (!country)
    // LOADER
    return (
      <div className="sm:mr-4 ">
        <CardCountryLoader width="w-16" height="h-9" />
      </div>
    )
  const flagLink = configFlagImage(country?.flagLink, 200)
  return (
    <div onClick={() => routePath && router.replace(routePath)} className="group flex items-center pr-4 active:scale-[0.99]">
      <Image src={flagLink} width={60} height={36} />
      <div className="ml-4">
        <div className="flex-row items-center">
          <div className="transition-200 text-lg font-semibold text-navy hover-mod:group-hover:text-blue-base">{country.name}</div>
          <div className="text-xs text-gray-dark">
            {country.surfers.length} SURFERS {country.events.length != 0 && `· ${country.events.length} EVENTS`}
          </div>
        </div>
      </div>
    </div>
  )
}
