import 'swiper/css'
import 'swiper/css/pagination'
import { useState } from 'react'
import { useRouter } from 'next/router'
import SliderStats from './SliderStats'
import ProgressBar from './loaders/ProgressBar'
import { CornersIcon } from '@radix-ui/react-icons'
import { DATA_DISCLAIMER } from '@/utils/constants'
import { ChevronDownIcon, XIcon, MinusIcon } from '@heroicons/react/outline'

export interface SubHeaderProps {
  subHeaderData: SubheaderData[]
  stats?: any
  statsLoading?: boolean
  buttonBack?: JSX.Element
  value?: boolean
  statToggle?: boolean
  setStatToggle?: (value: boolean) => void
}

export interface SubheaderData {
  primaryTab?: boolean
  content: JSX.Element
}

export default function ({ subHeaderData, stats, statsLoading, buttonBack, statToggle, setStatToggle }: SubHeaderProps) {
  const router = useRouter()
  const [showStats, setShowStats] = useState(false)
  const subtabs = subHeaderData.filter((tab: any) => tab.primaryTab != true)
  const primaryTab = subHeaderData.find((tab: any) => tab.primaryTab == true)
  const routerExample = { pathname: '/analytics', query: {} }
  const handleSelection = (routerQuery: any) => {
    if (routerQuery == undefined) return null
    router.replace(routerQuery)
  }

  return (
    <div className="sticky top-[65px] z-40 flex w-full select-none justify-center border-b bg-white text-gray-900 shadow-sm backdrop-blur-md sm:bg-transparent">
      {/* DESKTOP */}
      <div className="hidden w-full sm:block">
        <div className="flex items-center justify-center">
          <div className="flex w-full max-w-7xl items-center py-2 px-4 md:px-16">
            <div className="flex h-full w-full items-center justify-start divide-x ">
              {subHeaderData.map((tab: any, index: number) => (
                <div key={index} className="flex h-full cursor-pointer">
                  {tab.content}
                </div>
              ))}
            </div>

            {/* DESKTOP: TOGGLE */}
            {!statsLoading && (
              <div className="transition-200 flex cursor-pointer  text-gray-500 hover-mod:hover:text-navy">
                {showStats || statToggle ? (
                  <XIcon onClick={() => (setShowStats(false), setStatToggle && setStatToggle(false))} height={24} />
                ) : (
                  <div className="flex space-x-1" onClick={() => setShowStats(true)}>
                    <div className="hidden whitespace-nowrap text-base lg:block">View Stats</div>
                    <ChevronDownIcon height={24} />
                  </div>
                )}
              </div>
            )}
            {statsLoading && (
              <div className="transition-200 flex animate-pulse cursor-pointer space-x-1 text-gray-300 ">
                <div className="hidden  whitespace-nowrap text-base lg:block">View Stats</div>
                <MinusIcon className=" " height={24} />
              </div>
            )}
          </div>
        </div>

        {/* DESKTOP: STATS */}
        {showStats && !statToggle && !statsLoading && stats && (
          <div className="absolute w-full border-b bg-white shadow-sm">
            <div>
              <div className="flex justify-center ">
                <div className="flex w-full max-w-7xl items-center border-t px-8 ">
                  <SliderStats statsBody={stats} loading={statsLoading} />
                </div>
              </div>
              <div className="flex items-center justify-center p-1">
                <div
                  onClick={() => (setShowStats(false), setStatToggle && setStatToggle(true))}
                  className="transition-200 -mt-5 mb-1 flex cursor-pointer space-x-1 rounded px-1 py-0.5 text-xs font-semibold text-blue-base hover-mod:hover:bg-blue-base  hover-mod:hover:text-white"
                >
                  <CornersIcon />
                  <div>VIEW MORE</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DESKTOP: STATS ALL */}
        {!statsLoading && stats && statToggle && (
          <div className="absolute h-screen w-screen  overflow-auto bg-white ">
            <div className="mb-40 flex justify-center overflow-auto ">
              <div className="flex w-full max-w-7xl items-center overflow-auto border-t px-8 ">
                <div className="mx-8 w-full flex-col justify-center  overflow-auto text-sm ">
                  <div className="-mb-1 w-full pt-2 text-end text-xs text-gray-400 ">{DATA_DISCLAIMER}</div>
                  {stats.map((Column: any, i: number) => (
                    <div key={i} className="w-full border-b py-2 last:border-none ">
                      <div className="">{Column.label}</div>
                      {Column?.stats.map((stat: any, i: number) => (
                        <div key={i} className="transition-200 flex w-full py-1 hover:bg-gray-100">
                          <div className="w-full whitespace-nowrap text-gray-500">{stat.label !== undefined ? stat.label : '-'}</div>
                          {stat.subvalue && <div className="w-full text-center text-gray-500">{stat.subvalue}</div>}
                          <div className="w-full whitespace-nowrap text-end"> {stat.value}</div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DESKTOP: STATS ALL LOADER */}
        {statsLoading && statToggle && (
          <div className="absolute h-screen w-screen  overflow-auto bg-white ">
            <div className=" flex h-full justify-center ">
              <div className="flex h-3/5 w-full max-w-7xl border-t ">
                <div className="m-auto">
                  <ProgressBar />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MOBILE */}
      <div className="block w-full sm:hidden">
        <div className="flex items-center justify-center py-2 " onClick={() => setShowStats(!showStats)}>
          <div>{primaryTab ? primaryTab.content : null}</div>
        </div>

        <div className={`relative flex whitespace-nowrap border-t bg-white text-xs`}>
          {buttonBack && <div>{buttonBack}</div>}
          <div className={`scrollbar-none -ml-[5px]  flex w-full max-w-screen-md items-center justify-center space-x-2 overflow-scroll whitespace-nowrap pl-2  text-xs `}>
            {subtabs.map((tab: any, index: number) => (
              <div key={index} className="flex h-full cursor-pointer items-center justify-center  first:border-l-transparent  active:scale-[0.98]">
                <div>{tab.content}</div>
              </div>
            ))}
          </div>

          {/* MOBILE: TOGGLE */}
          {!statsLoading && (
            <div className="transition-200  absolute right-0 h-full cursor-pointer justify-center  bg-white px-3 text-gray-500 hover-mod:hover:text-navy">
              {showStats ? (
                <div className="flex h-full items-center " onClick={() => setShowStats(!showStats)}>
                  <XIcon height={20} />
                </div>
              ) : (
                <div className="flex h-full items-center " onClick={() => setShowStats(!showStats)}>
                  <ChevronDownIcon height={20} />
                </div>
              )}
            </div>
          )}
          {statsLoading && (
            <div className="transition-200  absolute right-0 h-full cursor-pointer justify-center  bg-white px-3 text-gray-300">
              <div className="flex h-full items-center ">
                <MinusIcon className="animate-pulse " height={20} />
              </div>
            </div>
          )}
        </div>

        {/* MOBILE: STATS */}
        {showStats && !statsLoading && stats && !statToggle && (
          <div className="absolute h-screen w-full border-t border-b bg-white shadow-sm sm:h-full">
            <div className="mx-8 flex-col justify-center  text-sm ">
              {stats.map((Column: any, i: number) => (
                <div key={i} className="w-full border-b py-4 ">
                  {Column?.map((stat: any, i: number) => (
                    <div key={i} className="flex w-full  py-1">
                      <div className="w-full whitespace-nowrap text-gray-500">{stat.label !== undefined ? stat.label : '-'}</div>
                      {stat.subvalue && <div className="w-full whitespace-nowrap text-center text-gray-500">{stat.subvalue}</div>}
                      <div className="w-full whitespace-nowrap text-end"> {stat.value}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center  p-1 ">
              <div
                onClick={() => handleSelection(routerExample)}
                className="transition-200 -mt-3.5 flex cursor-pointer space-x-1 rounded bg-white px-1 py-0.5 text-xs font-semibold text-blue-base hover-mod:hover:bg-blue-base  hover-mod:hover:text-white"
              >
                <CornersIcon />
                <div>VIEW MORE</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
