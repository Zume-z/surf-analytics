import 'swiper/css'
import 'swiper/css/pagination'
import React, { useState } from 'react'
import { Pagination, Navigation } from 'swiper'
import { ChevronLeftIcon } from '@heroicons/react/outline'
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react'

interface SliderStatsProps {
  statsBody: any
  loading?: boolean
}

export default function ({ statsBody, loading }: SliderStatsProps) {
  if (statsBody == undefined) <div></div>
  const [sliderEnd, setSliderEnd] = useState(false)
  const [sliderStart, setSliderStart] = useState(true)

  const SwiperButton = ({ dir, className }: { dir: 'NEXT' | 'PREV'; className?: any }) => {
    const swiper = useSwiper()
    return (
      <div className="block lg:hidden">
        <div className={`slider-btn flex items-center justify-center  bg-white ${dir == 'NEXT' ? 'right-0' : 'left-0'} `}>
          <ChevronLeftIcon
            className={`transition-200 h-full w-8 ${className} ${dir == 'NEXT' && 'rotate-180 '}`}
            onClick={() => {
              dir == 'NEXT' ? swiper.slideNext() : swiper.slidePrev()
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="flex w-full py-4 text-sm sm:py-6">
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

        {!loading && (
          <div>
            {statsBody.map((Column: any, i: number) => (
              <SwiperSlide key={i} className="w-full space-y-2 border-r py-1 last:border-none sm:space-y-2 ">
                {Column?.map((stat: any, i: number) => (
                  <div key={i} className="flex w-full px-10 lg:px-8  ">
                    <div className="w-full whitespace-nowrap text-gray-500">{stat.label !== undefined ? stat.label : '-'}</div>
                    {stat.subvalue && <div className="w-full whitespace-nowrap text-center text-gray-500">{stat.subvalue}</div>}
                    <div className="w-full whitespace-nowrap text-end"> {stat.value}</div>
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
