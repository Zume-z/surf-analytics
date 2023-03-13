import 'swiper/css'
import 'swiper/css/pagination'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { Pagination, Navigation, FreeMode } from 'swiper'
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react'
import { ChevronDownIcon, XIcon } from '@heroicons/react/outline'
import { ChevronLeftIcon, CornersIcon } from '@radix-ui/react-icons'

export interface SubHeaderProps {
  subHeaderData: SubheaderData[]
  stats?: any
  statsLoading?: boolean
}

export interface SubheaderData {
  primaryTab?: boolean
  content: JSX.Element
}

export default function ({ subHeaderData, stats, statsLoading }: SubHeaderProps) {
  const router = useRouter()
  const [showStats, setShowStats] = useState(false)
  const [sliderEnd, setSliderEnd] = useState(false)
  const [sliderStart, setSliderStart] = useState(true)
  const subtabs = subHeaderData.filter((tab: any) => tab.primaryTab != true)
  const primaryTab = subHeaderData.find((tab: any) => tab.primaryTab == true)
  const routerExample = { pathname: '/analytics', query: {} }

  const handleSelection = (routerQuery: any) => {
    if (routerQuery == undefined) return null
    router.replace(routerQuery)
  }

  const SwiperButton = ({ dir, className }: { dir: 'NEXT' | 'PREV'; className?: any }) => {
    const swiper = useSwiper()
    const handleSwiperPrev = () => { swiper.slidePrev()} //prettier-ignore
    const handleSwiperNext = () => { swiper.slideNext()} //prettier-ignore

    return (
      <div className="block lg:hidden">
        <div className={`slider-btn flex items-center justify-center  bg-white ${dir == 'NEXT' ? 'right-0' : 'left-0'} `}>
          <ChevronLeftIcon
            className={`transition-200 h-full w-8 ${className} ${dir == 'NEXT' && 'rotate-180 '}`}
            onClick={() => {
              dir == 'NEXT' ? handleSwiperNext() : handleSwiperPrev()
            }}
          />
        </div>
      </div>
    )
  }

  const statSlider = (statsBody: any) => {
    if (statsBody == undefined) return
    return (
      <div className="flex w-full py-4 text-sm">
        <Swiper
          className="w-full"
          slidesPerView={1}
          modules={[Pagination, Navigation]}
          onReachEnd={() => setSliderEnd(true)}
          onReachBeginning={() => setSliderStart(true)}
          onSlideNextTransitionStart={() => setSliderStart(false)}
          onSlidePrevTransitionStart={() => setSliderEnd(false)}
          breakpoints={{
            320: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          <SwiperButton dir="PREV" className={sliderStart ? 'text-gray-300' : 'text-black'} />
          <SwiperButton dir="NEXT" className={sliderEnd ? 'text-gray-300' : 'text-black'} />

          {!statsLoading && (
            <div>
              {statsBody.map((Column: any, i: number) => (
                <SwiperSlide key={i} className="w-full space-y-1 border-r last:border-none sm:space-y-2 ">
                  {Column?.map((stat: any, i: number) => (
                    <div key={i} className="flex w-full justify-between px-10 sm:px-8  ">
                      <div className="text-gray-500">{stat.label !== undefined ? stat.label : '-'}</div>
                      {stat.subValue && <div className="text-gray-500">{stat.subValue}</div>}
                      <div>{stat.value}</div>
                    </div>
                  ))}
                </SwiperSlide>
              ))}
            </div>
          )}
        </Swiper>
      </div>
    )
  }

  return (
    <div className="sticky top-[64px] z-40 flex w-full select-none justify-center border-b bg-white text-gray-900 shadow-sm backdrop-blur-md sm:bg-transparent">
      {/* MOBILE < SM */}
      <div className="block w-full sm:hidden">
        <div className="flex items-center justify-center py-2 " onClick={() => setShowStats(!showStats)}>
          <div>{primaryTab ? primaryTab.content : null}</div>
        </div>

        <div className={`flex whitespace-nowrap border-t bg-white   text-xs `}>
          <div className={`${subtabs.length < 2 ? '-mr-[36px] items-center justify-center ' : ''} scrollbar-none flex w-full max-w-screen-md space-x-2 overflow-scroll whitespace-nowrap pl-2  text-xs `}>
            {subtabs.map((tab: any, index: number) => (
              <div key={index} className="flex h-full cursor-pointer items-center justify-center  first:border-l-transparent  active:scale-[0.98]">
                <div>{tab.content}</div>
              </div>
            ))}
          </div>

          {!statsLoading && (
            <div className="transition-200  flex  w-10 cursor-pointer  justify-center bg-white text-gray-500 hover-mod:hover:text-navy">
              {showStats ? (
                <div className="flex h-full items-center " onClick={() => setShowStats(!showStats)}>
                  <XIcon height={22} />{' '}
                </div>
              ) : (
                <div className="flex h-full items-center " onClick={() => setShowStats(!showStats)}>
                  <ChevronDownIcon height={22} />
                </div>
              )}
            </div>
          )}
          {statsLoading && (
            <div className="transition-200  flex  w-10 cursor-pointer  justify-center bg-white text-gray-300">
              <div className="flex h-full items-center ">
                <ChevronDownIcon height={22} />
              </div>
            </div>
          )}
        </div>

        {/* MOBILE: STATS */}
        {showStats && (
          <div className="absolute w-full border-b bg-white shadow-sm">
            <div className="flex justify-center ">
              <div className="flex w-full items-center border-t">{statSlider(stats)}</div>
            </div>
            <div className=" flex items-center justify-center  p-1  ">
              <div onClick={() => handleSelection(routerExample)} className="transition-200 -mt-3 flex cursor-pointer space-x-1 rounded px-1 py-0.5 text-xs font-semibold text-blue-base hover-mod:hover:bg-blue-base  hover-mod:hover:text-white">
                <CornersIcon />
                <div>VIEW MORE</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* DESKTOP > SM */}
      <div className="hidden w-full sm:block">
        <div className="flex items-center justify-center">
          <div className="flex w-full max-w-7xl items-center py-2 px-4 md:px-16 ">
            <div className="flex h-full w-full items-center justify-start divide-x ">
              {subHeaderData.map((tab: any, index: number) => (
                <div key={index} className="flex h-full cursor-pointer">
                  {tab.content}
                </div>
              ))}
            </div>

            {/* CHEVRON */}
            {!statsLoading && (
              <div className="transition-200  cursor-pointer text-gray-500 hover-mod:hover:text-navy">
                {showStats ? <XIcon onClick={() => setShowStats(!showStats)} height={24} /> : <ChevronDownIcon onClick={() => setShowStats(!showStats)} height={24} />}
              </div>
            )}
            {statsLoading && (
              <div className="transition-200 cursor-pointer text-gray-300">
                <ChevronDownIcon height={24} />
              </div>
            )}
          </div>
        </div>

        {/* STATS DESKTOP */}
        {showStats && (
          <div className="absolute w-full border-b bg-white shadow-sm">
            <div>
              <div className="flex justify-center ">
                <div className="flex w-full max-w-7xl items-center border-t px-8 ">{statSlider(stats)}</div>
              </div>
              <div className=" flex items-center justify-center  p-1  ">
                <div onClick={() => handleSelection(routerExample)} className="transition-200 -mt-3 flex cursor-pointer space-x-1 rounded px-1 py-0.5 text-xs font-semibold text-blue-base hover-mod:hover:bg-blue-base  hover-mod:hover:text-white">
                  <CornersIcon />
                  <div>VIEW MORE</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
