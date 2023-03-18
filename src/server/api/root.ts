import { createTRPCRouter } from './trpc'
import { tourRouter } from './routers/tour'
import { heatRouter } from './routers/heat'
import { eventRouter } from './routers/event'
import { surferRouter } from './routers/surfer'
import { countryRouter } from './routers/country'
import { locationRouter } from './routers/locations'
import { tourResultRouter } from './routers/tourResult'
import { eventResultRouter } from './routers/eventResult'
import { heatStatRouter } from './routers/stats/heatStat'
import { eventStatRouter } from './routers/stats/eventStat'
import { surferStatRouter } from './routers/stats/surferStat'
import { matchupStatRouter } from './routers/stats/matchupStat'
import { heatResultStatRouter } from './routers/stats/heatResultStat'
import { tourResultStatRouter } from './routers/stats/tourResultStat'
import { eventResultStatRouter } from './routers/stats/eventResultStat'
import { countryEventStatRouter } from './routers/stats/countryEventStats'
import { countrySurferStatRouter } from './routers/stats/countrySurferStats'
import { locationSurferStatRouter } from './routers/stats/locationSurferStat'

export const appRouter = createTRPCRouter({
  // Main
  surfer: surferRouter,
  tour: tourRouter,
  tourResult: tourResultRouter,
  event: eventRouter,
  eventResult: eventResultRouter,
  heat: heatRouter,
  country: countryRouter,
  location: locationRouter,

  // Stats
  surferStat: surferStatRouter,
  tourResultStat: tourResultStatRouter,
  eventStat: eventStatRouter,
  eventResultStat: eventResultStatRouter,
  heatStat: heatStatRouter,
  heatResultStat: heatResultStatRouter,
  matchupStat: matchupStatRouter,
  countrySurferStat: countrySurferStatRouter,
  countryEventStat: countryEventStatRouter,
  locationSurferStat: locationSurferStatRouter
  
})

export type AppRouter = typeof appRouter
