import React from 'react'
import Head from 'next/head'
import Header from './NavBar'
import SubHeader, { SubHeaderProps } from './SubHeader'
import SliderEvents, { SliderEventProps } from './SliderEvents'

interface LayoutProps {
  title?: string
  metaDescription?: string
  children: React.ReactNode
  subHeader?: SubHeaderProps
  subheaderLoading?: boolean
  subHeaderStats?: any
  slider?: SliderEventProps
}

export default function Layout({ title, metaDescription, children, slider, subHeader }: LayoutProps) {
  return (
    <div>
      <Head>
        <title>{title ? `Surf Analytics | ${title}` : 'Surf Analytics'}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content={metaDescription ? metaDescription : 'Surf Analytics provides all the latest world surfing league stats, athlete rankings, event results, and more.'} key="desc" />
      </Head>
      <Header />
      {subHeader && <SubHeader subHeaderData={subHeader.subHeaderData} stats={subHeader.stats} statsLoading={subHeader.statsLoading} buttonBack={subHeader.buttonBack} setStatToggle={subHeader.setStatToggle} statToggle={subHeader.statToggle} />}
      {slider && <SliderEvents events={slider.events} loading={slider.loading} />}
      <div>
        <main className="mx-auto max-w-7xl px-4 md:px-16  ">{children}</main>
      </div>
    </div>
  )
}
