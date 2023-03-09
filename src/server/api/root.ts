import { createTRPCRouter } from './trpc'
import { tourRouter } from './routers/tour'
import { heatRouter } from './routers/heat'
import { eventRouter } from './routers/event'
import { surferRouter } from './routers/surfer'
import { countryRouter } from './routers/country'
import { tourResultRouter } from './routers/tourResult'
import { eventResultRouter } from './routers/eventResult'
import { heatStatRouter } from './routers/stats/heatStat'
import { eventStatRouter } from './routers/stats/eventStat'
import { surferStatRouter } from './routers/stats/surferStat'
import { heatResultStatRouter } from './routers/stats/heatResultStat'
import { tourResultStatRouter } from './routers/stats/tourResultStat'
import { eventResultStatRouter } from './routers/stats/eventResultStat'
import { countryEventStatRouter } from './routers/stats/countryEventStats'
import { countrySurferStatRouter } from './routers/stats/countrySurferStats'
import { heatToHeadStatRouter } from './routers/stats/headToHeadStats'

export const appRouter = createTRPCRouter({
  // Main
  surfer: surferRouter,
  tour: tourRouter,
  tourResult: tourResultRouter,
  event: eventRouter,
  eventResult: eventResultRouter,
  heat: heatRouter,
  country: countryRouter,

  // Stats
  surferStat: surferStatRouter,
  tourResultStat: tourResultStatRouter,
  eventStat: eventStatRouter,
  eventResultStat: eventResultStatRouter,
  heatStat: heatStatRouter,
  heatResultStat: heatResultStatRouter,
  headToHeadStat: heatToHeadStatRouter,
  countrySurferStat: countrySurferStatRouter,
  countryEventStat: countryEventStatRouter
  
})

export type AppRouter = typeof appRouter
