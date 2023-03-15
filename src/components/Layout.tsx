import React from 'react'
import Head from 'next/head'
import Header from './NavBar'
import SubHeader, { SubHeaderProps } from './SubHeader'
import SliderHeader, { SliderHeaderProps } from './SliderEvents'
import { Stats } from '@/utils/format/subHeaderStats'

interface LayoutProps {
  title?: string
  children: React.ReactNode
  subHeader?: SubHeaderProps
  subheaderLoading?: boolean
  subHeaderStats?: any
  slider?: SliderHeaderProps
}

export default function Layout({ title, children, slider, subHeader }: LayoutProps) {
  return (
    <div>
      <Head>
        <title>{title ? `Surf Analytics | ${title}` : 'Surf Analytics'}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      {subHeader && <SubHeader subHeaderData={subHeader.subHeaderData} stats={subHeader.stats} statsLoading={subHeader.statsLoading} />}
      {slider && <SliderHeader events={slider.events} loading={slider.loading} />}
      <div>
        <main className="mx-auto max-w-7xl px-4 md:px-16  ">{children}</main>
      </div>
    </div>
  )
}
