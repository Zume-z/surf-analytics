import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { getMoneyFormat } from '@/utils/format/moneyFormat'
import { ordinalSuffix } from '@/utils/format/ordinalSuffix'
import { createTRPCRouter, publicProcedure } from '../../trpc'
import { queryDifferential, queryFormat, queryMoney, queryPerc, queryRound, querySuffix } from '@/utils/format/queryFormat'
import { Context } from '@/utils/interfaces'
import { Status } from '@prisma/client'

const locationSurferStatSchema = z.object({
  surferSlug: z.string().optional(),
  locationSlug: z.string().optional(),
})

export const locationSurferStatRouter = createTRPCRouter({
  getAll: publicProcedure.input(locationSurferStatSchema).query(({ ctx, input }) => {
    return getAll(ctx, input)
  }),

  getLocationSurfer: publicProcedure.input(locationSurferStatSchema).query(({ ctx, input }) => {
    return getLocationSurfer(ctx, input)
  }),
})

const getAll = async (ctx: Context, input: z.infer<typeof locationSurferStatSchema>) => {
  const query = {
    ...(await totalEvents(ctx, input)),
    ...(await eventWins(ctx, input)),
    ...(await eventWinPerc(ctx, input)),
    ...(await bestResult(ctx, input)),
    ...(await avgResult(ctx, input)),
    ...(await totalHeats(ctx, input)),
    ...(await heatWins(ctx, input)),
    ...(await heatWinPerc(ctx, input)),
    ...(await totalTens(ctx, input)),
    ...(await excellentHeats(ctx, input)),
    ...(await avgHeatTotal(ctx, input)),
    ...(await highestHeatTotal(ctx, input)),
    ...(await heatTotalDifferential(ctx, input)),
    ...(await avgHeatTotalDifferential(ctx, input)),
    ...(await totalWaves(ctx, input)),
    ...(await avgWaveScore(ctx, input)),
    ...(await excellentWaves(ctx, input)),
    ...(await totalCountedWaves(ctx, input)),
    ...(await avgCountedWaveScore(ctx, input)),
    ...(await highestWaveScore(ctx, input)),
    ...(await prizeMoney(ctx, input)),
    ...(await totalInterferences(ctx, input)),
  }
  if (!query) throw new TRPCError({ code: 'NOT_FOUND' })
  return query
}

const getLocationSurfer = async (ctx: Context, input: z.infer<typeof locationSurferStatSchema>) => {
  const query = {
    ...(await totalEvents(ctx, input)),
    ...(await eventWins(ctx, input)),
    ...(await bestResult(ctx, input)),
    ...(await avgResult(ctx, input)),
    ...(await totalHeats(ctx, input)),
    ...(await heatWins(ctx, input)),
    ...(await excellentHeats(ctx, input)),
    ...(await avgHeatTotal(ctx, input)),
    ...(await totalWaves(ctx, input)),
    ...(await excellentWaves(ctx, input)),
    ...(await avgWaveScore(ctx, input)),
    ...(await avgCountedWaveScore(ctx, input)),
  }
  if (!query) throw new TRPCError({ code: 'NOT_FOUND' })
  return query
}

// FITERS
const eventResultFilter = (input: z.infer<typeof locationSurferStatSchema>) => ({ surferSlug: input.surferSlug, injured: false, withdrawn: false, place: { not: 0 }, event: { locationSlug: input.locationSlug, eventStatus: 'COMPLETED' as Status } })
const heatResultFilter = (input: z.infer<typeof locationSurferStatSchema>) => ({ surferSlug: input.surferSlug, heat: { heatStatus: 'COMPLETED' as Status, event: { locationSlug: input.locationSlug } } })
const waveFilter = (input: z.infer<typeof locationSurferStatSchema>) => ({ surferSlug: input.surferSlug, heat: { event: { locationSlug: input.locationSlug } } })

// LOCATION SURFER STATS QUERYS //
const totalEvents = async (ctx: Context, input: z.infer<typeof locationSurferStatSchema>) => {
  const query = await ctx.prisma.eventResult.count({ where: eventResultFilter(input) })
  return { totalEvents: { label: 'Event Appearances', value: queryFormat(query) } }
}

const eventWins = async (ctx: Context, input: z.infer<typeof locationSurferStatSchema>) => {
  const query = await ctx.prisma.eventResult.count({ where: { surferSlug: input.surferSlug, place: 1, event: { locationSlug: input.locationSlug } } })
  return { eventWins: { label: 'Total Event Wins', value: queryFormat(query) } }
}

const bestResult = async (ctx: Context, input: z.infer<typeof locationSurferStatSchema>) => {
  const query = await ctx.prisma.eventResult.aggregate({ where: eventResultFilter(input), _min: { place: true } })
  return { bestResult: { label: 'Best Result', value: querySuffix(query._min.place) } }
}

const avgResult = async (ctx: Context, input: z.infer<typeof locationSurferStatSchema>) => {
  const query = await ctx.prisma.eventResult.aggregate({ where: eventResultFilter(input), _avg: { place: true } })
  const avgResult = query._avg && query._avg.place ? ordinalSuffix(Math.round(query._avg.place)) : '-'
  return { avgResult: { label: 'Avg. Event Result', value: avgResult } }
}

const eventWinPerc = async (ctx: Context, input: z.infer<typeof locationSurferStatSchema>) => {
  const totalEventsQuery = await totalEvents(ctx, input)
  const eventWinsQuery = await eventWins(ctx, input)
  return { eventWinPerc: { label: 'Event Win %', value: queryPerc(eventWinsQuery.eventWins.value, totalEventsQuery.totalEvents.value) } }
}

// HEATS //
const totalHeats = async (ctx: Context, input: z.infer<typeof locationSurferStatSchema>) => {
  const query = await ctx.prisma.heatResult.count({ where: { ...heatResultFilter(input), NOT: { heatTotal: null } } })
  return { totalHeats: { label: 'Total Heats', value: queryFormat(query) } }
}

const heatWins = async (ctx: Context, input: z.infer<typeof locationSurferStatSchema>) => {
  const query = await ctx.prisma.heatResult.count({ where: { ...heatResultFilter(input), heatPlace: 1, NOT: { heatTotal: null } } })
  return { heatWins: { label: 'Heat Wins', value: queryFormat(query) } }
}

const heatWinPerc = async (ctx: Context, input: z.infer<typeof locationSurferStatSchema>) => {
  const totalHeatsQ = await totalHeats(ctx, input)
  const totalHeatWinsQ = await heatWins(ctx, input)
  return { heatWinPerc: { label: 'Heat Win %', value: queryPerc(totalHeatWinsQ.heatWins.value, totalHeatsQ.totalHeats.value) } }
}

const avgHeatTotal = async (ctx: Context, input: z.infer<typeof locationSurferStatSchema>) => {
  const query = await ctx.prisma.heatResult.aggregate({ where: { ...heatResultFilter(input), NOT: { heatTotal: null } }, _avg: { heatTotal: true } })
  return { avgHeatTotal: { label: 'Avg. Heat Total', value: queryRound(query._avg.heatTotal) } }
}

const highestHeatTotal = async (ctx: Context, input: z.infer<typeof locationSurferStatSchema>) => {
  const query = await ctx.prisma.heatResult.aggregate({ where: heatResultFilter(input), _max: { heatTotal: true } })
  return { highestHeatTotal: { label: 'Highest Heat Total', value: queryRound(query._max.heatTotal) } }
}

const heatTotalDifferential = async (ctx: Context, input: z.infer<typeof locationSurferStatSchema>) => {
  const query = await ctx.prisma.heatResult.aggregate({ where: heatResultFilter(input), _sum: { heatDifferential: true } })
  return { heatTotalDifferential: { label: 'Heat Differential', value: queryDifferential(query._sum.heatDifferential) } }
}

const avgHeatTotalDifferential = async (ctx: Context, input: z.infer<typeof locationSurferStatSchema>) => {
  const query = await ctx.prisma.heatResult.aggregate({ where: heatResultFilter(input), _avg: { heatDifferential: true } })
  return { avgHeatTotalDifferential: { label: 'Avg. Heat Differential', value: queryDifferential(query._avg.heatDifferential) } }
}

const excellentHeats = async (ctx: Context, input: z.infer<typeof locationSurferStatSchema>) => {
  const query = await ctx.prisma.heatResult.count({ where: { ...heatResultFilter(input), heatTotal: { gte: 16 } } })
  return { excellentHeats: { label: 'Excellent Heats', value: queryFormat(query) } }
}

// WAVES //
const totalWaves = async (ctx: Context, input: z.infer<typeof locationSurferStatSchema>) => {
  const query = await ctx.prisma.wave.count({ where: waveFilter(input) })
  return { totalWaves: { label: 'Total Waves', value: queryFormat(query) } }
}

const avgWaveScore = async (ctx: Context, input: z.infer<typeof locationSurferStatSchema>) => {
  const query = await ctx.prisma.wave.aggregate({ where: waveFilter(input), _avg: { waveScore: true } })
  return { avgWaveScore: { label: 'Avg. Wave Score', value: queryRound(query._avg.waveScore) } }
}

const totalCountedWaves = async (ctx: Context, input: z.infer<typeof locationSurferStatSchema>) => {
  const query = await ctx.prisma.wave.count({ where: { ...waveFilter(input), countedWave: true } })
  return { totalCountedWaves: { label: 'Total Counted Waves', value: queryFormat(query) } }
}

const avgCountedWaveScore = async (ctx: Context, input: z.infer<typeof locationSurferStatSchema>) => {
  const query = await ctx.prisma.wave.aggregate({ where: { ...waveFilter(input), countedWave: true }, _avg: { waveScore: true } })
  return { avgCountedWaveScore: { label: 'Avg. Counted Wave Score', value: queryRound(query._avg.waveScore) } }
}

const highestWaveScore = async (ctx: Context, input: z.infer<typeof locationSurferStatSchema>) => {
  const query = await ctx.prisma.wave.aggregate({ where: waveFilter(input), _max: { waveScore: true } })
  return { highestWaveScore: { label: 'Highest Wave Score', value: queryRound(query._max.waveScore) } }
}

const totalTens = async (ctx: Context, input: z.infer<typeof locationSurferStatSchema>) => {
  const query = await ctx.prisma.wave.count({ where: { ...waveFilter(input), waveScore: 10 } })
  return { totalTens: { label: 'Ten Point Waves', value: queryFormat(query) } }
}


const excellentWaves = async (ctx: Context, input: z.infer<typeof locationSurferStatSchema>) => {
  const query = await ctx.prisma.wave.count({ where: { ...waveFilter(input), waveScore: { gte: 8 } } })
  return { excellentWaves: { label: 'Excellent Waves', value: queryFormat(query) } }
}

// OTHER
const prizeMoney = async (ctx: Context, input: z.infer<typeof locationSurferStatSchema>) => {
  const query = await ctx.prisma.eventResult.aggregate({ where: eventResultFilter(input), _sum: { prizeMoney: true } })
  return { prizeMoney: { label: 'Location Earnings', value: queryMoney(query._sum.prizeMoney) } }
}

const totalInterferences = async (ctx: Context, input: z.infer<typeof locationSurferStatSchema>) => {
  const query = await ctx.prisma.heatResult.aggregate({ where: { ...heatResultFilter(input), OR: [{ interferenceOne: { gte: 1 } }, { interferenceTwo: { gte: 1 } }, { interferenceThree: { gte: 1 } }] }, _sum: { interferenceOne: true, interferenceTwo: true, interferenceThree: true } })
  const totalInt = (query._sum.interferenceOne ? query._sum.interferenceOne : 0) + (query._sum.interferenceTwo ? query._sum.interferenceTwo : 0) + (query._sum.interferenceThree ? query._sum.interferenceThree : 0)
  return { totalInterferences: { label: 'Interferences', value: queryFormat(totalInt) } }
}


// Locations Stats Short
// ------------------------
// Event Appearances
// Event Wins
// Best Result
// Avg. Event Result

// Total Heats
// Heat Wins
// Excellent Heats
// Avg Heat Total

// Total Waves
// Excellent Waves
// Avg. Wave Score
// Avg. Counted Wave Score
