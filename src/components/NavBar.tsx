import Link from 'next/link'
import Iconlogo from './icons/IconLogo'
import { useRouter } from 'next/router'
import { Disclosure } from '@headlessui/react'
import { CONTACT_URLS } from '@/utils/constants'
import { EnvelopeClosedIcon } from '@radix-ui/react-icons'
import { XIcon, MenuAlt4Icon } from '@heroicons/react/outline'
import TransitionDropDown from './transitions/TransitionDropdown'

export default function Header() {
  const router = useRouter()
  const routerPath = '/' + router.pathname.split('/')[1]
  const currentYear = new Date().getFullYear()
  const navigation = [
    { name: 'Surfers', href: '/surfers', route: '/surfers?year=' + currentYear },
    { name: 'Events', href: '/events', route: '/events?year=' + currentYear },
    { name: 'Country', href: '/country' },
    { name: 'Matchups', href: '/matchups' },
    { name: 'World Titles', href: '/worldtitles' },
  ]

  const navigationMob = [{ name: 'Home', href: '/' }, ...navigation]

  return (
    <Disclosure as="nav" className="sticky top-0 z-50 border-b bg-navy shadow-sm">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                {/* Logo */}
                <div className="transition-200 group flex flex-shrink-0 items-center rounded" onClick={() => router.push('/')}>
                  <Iconlogo className="transition-200 h-6 w-auto cursor-pointer text-white active:scale-[0.98] " />
                </div>

                {/* Desktop NavBar */}
                <div className="hidden w-full  sm:block ">
                  <div className="flex justify-center space-x-2 lg:space-x-4">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.route ? item.route : item.href}
                        className={`transition-200 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium active:scale-[0.98] ${routerPath == item.href ? 'bg-gray-900 text-white' : 'text-gray-400 hover-mod:hover:text-white'}`}
                        aria-current={routerPath == item.href ? 'page' : undefined}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Mobile Menu Button*/}
                <div className="absolute inset-y-0 right-0 flex items-center sm:hidden">
                  <Disclosure.Button className="transition-200 inline-flex items-center justify-center rounded-md p-2 text-gray-md focus:outline-none hover-mod:hover:bg-gray-700 hover-mod:hover:text-white ">
                    {open ? <XIcon className="block h-7 w-7" aria-hidden="true" /> : <MenuAlt4Icon className="block h-7 w-7" aria-hidden="true" />}
                  </Disclosure.Button>
                </div>
              </div>

              {/* Contact / Social Media */}
              <div className="absolute inset-y-0 right-0 hidden items-center space-x-4 pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0 md:flex">
                <a target="_blank" href={`mailto: ${CONTACT_URLS.EMAIL}`} type="button" className="transition-200 hidden cursor-pointer  rounded-full p-1 text-gray-400 focus:outline-none active:scale-[0.95] sm:block hover-mod:hover:text-white ">
                  <EnvelopeClosedIcon className="h-5 w-5 " />
                </a>
              </div>
            </div>
          </div>

          {/* Mobile DropDown */}
          <TransitionDropDown>
            <Disclosure.Panel className="sm:hidden">
              <div className="absolute h-screen w-screen space-y-2 border-t border-gray-500 bg-navy px-2 pt-2 ">
                {navigationMob.map((item) => (
                  <Link
                    key={item.name}
                    className={`flex rounded-md px-3 py-2 text-base font-medium ${routerPath == item.href ? 'bg-gray-900 text-white' : 'text-gray-300 hover-mod:hover:bg-gray-700 hover-mod:hover:text-white'}`}
                    href={{ pathname: item.href }}
                    aria-current={routerPath == item.href ? 'page' : undefined}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="absolute bottom-16 right-0 flex space-x-3 px-4 py-2 text-white">
                  <a target="_blank" href={`mailto: ${CONTACT_URLS.EMAIL}`} type="button" className="transition-200  cursor-pointer rounded-full  p-1 text-gray-400 focus:outline-none active:scale-[0.95] sm:hidden  hover-mod:hover:text-white ">
                    <EnvelopeClosedIcon className="h-6 w-6" />
                  </a>
                </div>
              </div>
            </Disclosure.Panel>
          </TransitionDropDown>
        </>
      )}
    </Disclosure>
  )
}
