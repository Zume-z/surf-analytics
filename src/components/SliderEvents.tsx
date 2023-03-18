import 'swiper/css'
import 'swiper/css/pagination'
import Image from 'next/legacy/image'
import { useRouter } from 'next/router'
import React, { use, useState } from 'react'
import { CardEventStatus } from './CardEventStatus'
import { motion, AnimatePresence } from 'framer-motion'
import { Pagination, Navigation, FreeMode } from 'swiper'
import { ChevronLeftIcon } from '@heroicons/react/outline'
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react'
import { waitingPeriod } from '@/utils/format/getWaitingPeriod'
import { shortEventAddress } from '@/utils/format/shortEventAddress'
import { BREAKPOINT } from '@/utils/constants'
import { windowSize } from '@/utils/windowSize'

export interface SliderEventProps {
  events: any
  loading?: boolean
}

export default function ({ events, loading }: SliderEventProps) {
  const router = useRouter()
  const [isShown, setIsShown] = useState(false)
  // const [sliderEnd, setSliderEnd] = useState(false)
  // const [sliderStart, setSliderStart] = useState(true)

  const SwiperButton = ({ className, dir }: { className?: string; dir: 'NEXT' | 'PREV' }) => {
    const swiper = useSwiper()
    return (
      <div className={`slider-btn  items-center justify-center ${className} ${dir == 'NEXT' ? 'right-0' : 'left-0'} ${windowSize().width! < BREAKPOINT.sm || isShown ? 'bg-opacity-90' : ''} `}>
        <AnimatePresence>
          {(windowSize().width! < BREAKPOINT.sm || isShown) && (
            <motion.div className="h-full" key={'chevron'} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ChevronLeftIcon
                className={`h-full w-8 ${dir == 'NEXT' && 'rotate-180'}`}
                onClick={() => {
                  dir == 'NEXT' ? swiper.slideNext() : swiper.slidePrev()
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  const loadingCards = [1, 2, 3, 4]

  return (
    <div className="bg-gray-white flex w-full select-none items-center justify-center rounded-lg shadow " onMouseEnter={() => setIsShown(true)} onMouseLeave={() => setIsShown(false)}>
      <div className="w-full max-w-7xl justify-center">
        {!loading && (
          <Swiper
            freeMode={true}
            // initialSlide={2}
            modules={[Pagination, Navigation, FreeMode]}
            // onReachEnd={() => setSliderEnd(true)}
            // onReachBeginning={() => setSliderStart(true)}
            // onSlideNextTransitionStart={() => setSliderStart(false)}
            // onSlidePrevTransitionStart={() => setSliderEnd(false)}
            breakpoints={{
              320: { slidesPerView: 1 },
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
          >
            <SwiperButton className="" dir="PREV" />
            <SwiperButton className="" dir="NEXT" />

            <div>
              <div>
                {events.map((event: any, index: number) => (
                  <SwiperSlide key={index} className="cursor-pointer py-2 px-4 sm:px-0" onClick={() => event.eventStatus == 'COMPLETED' && router.push({ pathname: '/events/[eventId]/results', query: { eventId: event.slug } })}>
                    <div className=" h-full border-r-2 border-gray-md px-10">
                      <div className="text-base font-semibold ">{event.name}</div>
                      <div className="flex items-center space-x-1.5 ">
                        <div className="text-sm text-gray-dark">{shortEventAddress(event.address)}</div>
                        <div className="h-full w-5 flex-shrink-0">
                          <Image src={event.country.flagLink} width={18} height={12} />
                        </div>
                      </div>
                      <div className="flex items-center justify-center">
                        <div className="w-full text-sm text-gray-dark">{waitingPeriod(event)} </div>
                        <div className="w-min whitespace-nowrap ">{CardEventStatus(event)}</div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </div>
            </div>
          </Swiper>
        )}
        {loading && (
          <Swiper
            freeMode={true}
            modules={[Pagination, Navigation, FreeMode]}
            breakpoints={{
              320: { slidesPerView: 1 },
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
          >
            <SwiperButton dir="PREV" />
            <SwiperButton dir="NEXT" />
            <div>
              <div>
                {loadingCards.map((index: number) => (
                  <SwiperSlide key={index} className="cursor-pointer py-2">
                    <div className="group h-full border-r-2  border-gray-md px-10">
                      <div className="pulse-loader h-5 w-full"></div>
                      <div className="pulse-loader mt-2 h-4 w-full" />
                      <div className="mt-2 grid grid-cols-3 gap-4">
                        <div className="pulse-loader col-span-2  h-3"></div>
                        <div className="pulse-loader col-span-1  h-3"></div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </div>
            </div>
          </Swiper>
        )}
      </div>
    </div>
  )
}
