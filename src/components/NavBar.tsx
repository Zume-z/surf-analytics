import Link from 'next/link'
import Image from 'next/legacy/image'
import { useRouter } from 'next/router'
import logo from '@/assets/images/logo.svg'
import { Disclosure } from '@headlessui/react'
import { MenuIcon, XIcon } from '@heroicons/react/outline'
import TransitionDropDown from './transitions/TransitionDropdown'
import { TwitterLogoIcon, InstagramLogoIcon, GlobeIcon } from '@radix-ui/react-icons'
import Iconlogo from './icons/IconLogo'

export default function Header() {
  const router = useRouter()
  const routerPath = '/' + router.pathname.split('/')[1]
  const navigation = [
    { name: 'Surfers', href: '/surfers' },
    { name: 'Events', href: '/events' },
    { name: 'Country', href: '/country' },
    { name: 'Analytics', href: '/analytics' },
  ]
  const navigationMob = [{ name: 'Home', href: '/' }, ...navigation, { name: 'Contact', href: '/contact' }]

  return (
    <Disclosure as="nav" className="sticky top-0 z-50 border-b bg-navy shadow-sm">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                {/* Logo */}
                {/* <div className="flex flex-shrink-0 items-center rotate-180">
                  <Image className="h-8 w-auto cursor-pointer active:scale-[0.98] " height={42} width={42} src={logo} alt="Surf Analytics" onClick={() => router.push('/')} />
                </div> */}
                <div className="flex flex-shrink-0 items-center rounded group transition-200   " onClick={() => router.push('/')}>
                  <Iconlogo className="h-7 text-gray-50 transition-200 hover-mod:group-hover:text-white w-auto cursor-pointer active:scale-[0.98]" />
                </div>
                
                {/* Desktop NavBar */}
                <div className="hidden sm:ml-6 sm:block ">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`rounded-md px-3 py-2 text-base transition-200 font-medium active:scale-[0.98] ${routerPath == item.href ? 'bg-gray-900 text-white' : 'text-gray-400 hover-mod:hover:bg-gray-700 hover-mod:hover:text-white'}`}
                        aria-current={routerPath == item.href ? 'page' : undefined}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Mobile Menu Button*/}
                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-md focus:outline-none transition-200 hover-mod:hover:bg-gray-700 hover-mod:hover:text-white ">
                    {open ? <XIcon className="block h-6 w-6" aria-hidden="true" /> : <MenuIcon className="block h-6 w-6" aria-hidden="true" />}
                  </Disclosure.Button>
                </div>
              </div>

              {/* Contact Button */}
              <div className="absolute inset-y-0 right-0  flex items-center space-x-4 pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <Link href={'/contact'} type="button" className="transition-200 hidden cursor-pointer  rounded-full p-1 text-gray-400 focus:outline-none active:scale-[0.95] sm:block hover-mod:hover:text-white ">
                  <TwitterLogoIcon className="h-5 w-5 " />
                </Link>
                <Link href={'/contact'} type="button" className="transition-200 hidden cursor-pointer rounded-full p-1 text-gray-400 focus:outline-none active:scale-[0.95] sm:block hover-mod:hover:text-white ">
                  <InstagramLogoIcon className="h-5 w-5 " />
                </Link>
                <Link href={'/contact'} type="button" className="transition-200 cursor-pointer rounded-full p-1 text-gray-400 focus:outline-none active:scale-[0.95] hover-mod:hover:text-white ">
                  <GlobeIcon className="h-5 w-5 " />
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile DropDown */}
          <TransitionDropDown>
            <Disclosure.Panel className="sm:hidden">
              <div className="absolute h-screen w-screen space-y-2 border-t border-gray-500 bg-navy px-2 pt-2 pb-3">
                {navigationMob.map((item) => (
                  <Link
                    key={item.name}
                    className={`block rounded-md px-3 py-2 text-base font-medium ${routerPath == item.href ? 'bg-gray-900 text-white' : 'text-gray-300 hover-mod:hover:bg-gray-700 hover-mod:hover:text-white'}`}
                    href={{ pathname: item.href }}
                    aria-current={routerPath == item.href ? 'page' : undefined}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </Disclosure.Panel>
          </TransitionDropDown>
        </>
      )}
    </Disclosure>
  )
}
