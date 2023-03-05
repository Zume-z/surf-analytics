import { type AppType } from 'next/app'
import { type Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import ProgressBar from '@badrap/bar-of-progress'
import { api } from '../utils/api'
import '../styles/globals.css'
import { Router } from 'next/router'

const progress = new ProgressBar({
  size: 4,
  color: '#FFFFFF',
  className: 'z-50 ',
  delay: 150,
})

Router.events.on('routeChangeStart', progress.start)
Router.events.on('routeChangeComplete', progress.finish)
Router.events.on('routeChangeError', progress.finish)

const MyApp: AppType<{ session: Session | null }> = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}

export default api.withTRPC(MyApp)


