import { z } from 'zod'
import { Status } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { Context } from '@/utils/interfaces'
import { ordinalSuffix } from '@/utils/format/ordinalSuffix'
import { createTRPCRouter, publicProcedure } from '../../trpc'
import { queryDifferential, queryFormat, queryMoney, queryPerc, queryRound, querySuffix } from '@/utils/format/queryFormat'

const tourResultStatSchema = z.object({
  year: z.number().min(1900).max(2100),
  surferSlug: z.string(),
})

const tourResultAnalyticSchema = z.object({
  yearsArr: z.array(z.number()),
  surferSlug: z.string(),
})

export const tourResultStatRouter = createTRPCRouter({
  getAll: publicProcedure.input(tourResultStatSchema).query(({ ctx, input }) => {
    return getAll(ctx, input)
  }),

  getEvents: publicProcedure.input(tourResultStatSchema).query(({ ctx, input }) => {
    return getEvents(ctx, input)
  }),

  getAnalytics: publicProcedure.input(tourResultAnalyticSchema).query(({ ctx, input }) => {
    const queries = input.yearsArr.map((year) => getAnalytics(ctx, { year, surferSlug: input.surferSlug }))
    return Promise.all(queries)
  }),
})

const getAll = async (ctx: Context, input: z.infer<typeof tourResultStatSchema>) => {
  const query = {
    ...(await surferRank_SurferPoints(ctx, input)),
    ...(await totalEvents(ctx, input)),
    ...(await eventWins(ctx, input)),
    ...(await bestResult(ctx, input)),
    ...(await avgResult(ctx, input)),
    ...(await eventWinPerc(ctx, input)),
    ...(await totalHeats(ctx, input)),
    ...(await heatWins(ctx, input)),
    ...(await heatWinPerc(ctx, input)),
    ...(await avgHeatTotal(ctx, input)),
    ...(await highestHeatTotal(ctx, input)),
    ...(await avgHeatTotalDifferential(ctx, input)),
    ...(await excellentHeats(ctx, input)),
    ...(await totalTens(ctx, input)),
    ...(await totalWaves(ctx, input)),
    ...(await avgWaveScore(ctx, input)),
    ...(await totalCountedWaves(ctx, input)),
    ...(await avgCountedWaveScore(ctx, input)),
    ...(await highestWaveScore(ctx, input)),
    ...(await excellentWaves(ctx, input)),
    ...(await prizeMoney(ctx, input)),
    ...(await totalInterferences(ctx, input)),
  }
  if (!query) throw new TRPCError({ code: 'NOT_FOUND' })
  return query
}

const getEvents = async (ctx: Context, input: z.infer<typeof tourResultStatSchema>) => {
  const query = {
    ...(await surferRank_SurferPoints(ctx, input)),
    ...(await worldTitles(ctx, input)),
    ...(await totalEvents(ctx, input)),
    ...(await eventWins(ctx, input)),
    ...(await bestResult(ctx, input)),
    ...(await avgResult(ctx, input)),
    ...(await totalHeats(ctx, input)),
    ...(await heatWins(ctx, input)),
    ...(await heatWinPerc(ctx, input)),
    ...(await avgHeatTotal(ctx, input)),
    ...(await prizeMoney(ctx, input)),
  }
  if (!query) throw new TRPCError({ code: 'NOT_FOUND' })
  return query
}

const getAnalytics = async (ctx: Context, input: z.infer<typeof tourResultStatSchema>) => {
  const year = { year: { label: 'Year', value: input.year } }
  const query = {
    ...year,
    ...(await surferRank_SurferPoints(ctx, input)),
    ...(await totalEvents(ctx, input)),
    ...(await eventWins(ctx, input)),
    ...(await bestResult(ctx, input)),
    ...(await avgResult(ctx, input)),
    ...(await eventWinPerc(ctx, input)),
    ...(await totalHeats(ctx, input)),
    ...(await heatWins(ctx, input)),
    ...(await heatWinPerc(ctx, input)),
    ...(await avgHeatTotal(ctx, input)),
    ...(await highestHeatTotal(ctx, input)),
    ...(await avgHeatTotalDifferential(ctx, input)),
    ...(await excellentHeats(ctx, input)),
    ...(await totalWaves(ctx, input)),
    ...(await avgWaveScore(ctx, input)),
    ...(await totalCountedWaves(ctx, input)),
    ...(await avgCountedWaveScore(ctx, input)),
    ...(await highestWaveScore(ctx, input)),
    ...(await excellentWaves(ctx, input)),
    ...(await prizeMoney(ctx, input)),
  }
  if (!query) throw new TRPCError({ code: 'NOT_FOUND' })
  return query
}

// FILTERS
const eventResultFilter = (input: z.infer<typeof tourResultStatSchema>) => ({ surferSlug: input.surferSlug, injured: false, withdrawn: false, event: { year: input.year, eventStatus: 'COMPLETED' as Status } })
const heatResultFilter = (input: z.infer<typeof tourResultStatSchema>) => ({ surferSlug: input.surferSlug, heat: { heatStatus: 'COMPLETED' as Status, event: { year: input.year } } })
const waveFilter = (input: z.infer<typeof tourResultStatSchema>) => ({ surferSlug: input.surferSlug, heat: { event: { year: input.year } } })

// TOURESULT QUERYS //
const surferRank_SurferPoints = async (ctx: Context, input: z.infer<typeof tourResultStatSchema>) => {
  const query = await ctx.prisma.tourResult.findFirstOrThrow({ where: { surfer: { slug: input.surferSlug }, tour: { year: input.year } }, select: { surferRank: true, surferPoints: true } })
  return {
    surferRank: { label: 'Rank', value: querySuffix(query?.surferRank) },
    surferPoints: { label: 'Points', value: queryFormat(query?.surferPoints) },
  }
}

const worldTitles = async (ctx: Context, input: z.infer<typeof tourResultStatSchema>) => {
  const query = await ctx.prisma.tourResult.count({ where: { surferSlug: input.surferSlug, worldTitle: true } })
  return { worldTitles: { label: 'World Titles', value: queryFormat(query) } }
}

const surferRank = async (ctx: Context, input: z.infer<typeof tourResultStatSchema>) => {
  const query = await ctx.prisma.tourResult.findFirstOrThrow({ where: { surfer: { slug: input.surferSlug }, tour: { year: input.year } }, select: { surferRank: true } })
  return { surferRank: { label: 'Rank', value: querySuffix(query.surferRank) } }
}

const surferPoints = async (ctx: Context, input: z.infer<typeof tourResultStatSchema>) => {
  const query = await ctx.prisma.tourResult.findFirstOrThrow({ where: { surfer: { slug: input.surferSlug }, tour: { year: input.year } }, select: { surferPoints: true } })
  return { surferPoints: { label: 'Points', value: queryFormat(query.surferPoints) } }
}

// EVENTS //
const totalEvents = async (ctx: Context, input: z.infer<typeof tourResultStatSchema>) => {
  const query = await ctx.prisma.eventResult.count({ where: { ...eventResultFilter(input), NOT: { place: 0 } } })
  return { totalEvents: { label: 'Ct. Events', value: queryFormat(query) } }
}

const eventWins = async (ctx: Context, input: z.infer<typeof tourResultStatSchema>) => {
  const query = await ctx.prisma.eventResult.count({ where: { ...eventResultFilter(input), place: 1 } })
  return { eventWins: { label: 'Ct. Event Wins', value: queryFormat(query) } }
}

const bestResult = async (ctx: Context, input: z.infer<typeof tourResultStatSchema>) => {
  const query = await ctx.prisma.eventResult.aggregate({ where: { ...eventResultFilter(input), NOT: { place: 0 } }, _min: { place: true } })
  return { bestResult: { label: 'Best Result', value: query._min.place ? ordinalSuffix(query._min.place) : '-' } }
}

const avgResult = async (ctx: Context, input: z.infer<typeof tourResultStatSchema>) => {
  const query = await ctx.prisma.eventResult.aggregate({ where: { ...eventResultFilter(input), NOT: { place: 0 } }, _avg: { place: true } })
  const avgResult = query._avg.place ? ordinalSuffix(Math.round(query._avg.place)) : '-'
  return { avgResult: { label: 'Avg. Event Result', value: avgResult } }
}

const eventWinPerc = async (ctx: Context, input: z.infer<typeof tourResultStatSchema>) => {
  const totalEventsQuery = await totalEvents(ctx, input)
  const eventWinsQuery = await eventWins(ctx, input)
  return { eventWinPerc: { label: 'Event Win %', value: queryPerc(eventWinsQuery.eventWins.value, totalEventsQuery.totalEvents.value) } }
}

// HEATS //
const totalHeats = async (ctx: Context, input: z.infer<typeof tourResultStatSchema>) => {
  const query = await ctx.prisma.heatResult.count({ where: { ...heatResultFilter(input), NOT: { heatTotal: null } } })
  return { totalHeats: { label: 'Total Heats', value: queryFormat(query) } }
}

const heatWins = async (ctx: Context, input: z.infer<typeof tourResultStatSchema>) => {
  const query = await ctx.prisma.heatResult.count({ where: { ...heatResultFilter(input), heatPlace: 1, NOT: { heatTotal: null } } })
  return { heatWins: { label: 'Heat Wins', value: queryFormat(query) } }
}

const heatWinPerc = async (ctx: Context, input: z.infer<typeof tourResultStatSchema>) => {
  const totalHeatsQ = await totalHeats(ctx, input)
  const totalHeatWinsQ = await heatWins(ctx, input)
  return { heatWinPerc: { label: 'Heat Win %', value: queryPerc(totalHeatWinsQ.heatWins.value, totalHeatsQ.totalHeats.value) } }
}

const avgHeatTotal = async (ctx: Context, input: z.infer<typeof tourResultStatSchema>) => {
  const query = await ctx.prisma.heatResult.aggregate({ where: { ...heatResultFilter(input), NOT: { heatTotal: null } }, _avg: { heatTotal: true } })
  return { avgHeatTotal: { label: 'Avg. Heat Total', value: queryRound(query._avg.heatTotal) } }
}

const highestHeatTotal = async (ctx: Context, input: z.infer<typeof tourResultStatSchema>) => {
  const query = await ctx.prisma.heatResult.aggregate({ where: { ...heatResultFilter(input) }, _max: { heatTotal: true } })
  return { highestHeatTotal: { label: 'Highest Heat Total', value: queryRound(query._max.heatTotal) } }
}

// const heatTotalDifferential = async (ctx: Context, input: z.infer<typeof tourResultStatSchema>) => {
//   const query = await ctx.prisma.heatResult.aggregate({ where: { ...heatResultFilter(input) }, _sum: { heatDifferential: true } })
//   return { heatTotalDifferential: { label: 'Heat Total Differential', value: queryDifferential(query._sum.heatDifferential) } }
// }

const avgHeatTotalDifferential = async (ctx: Context, input: z.infer<typeof tourResultStatSchema>) => {
  const query = await ctx.prisma.heatResult.aggregate({ where: { ...heatResultFilter(input) }, _avg: { heatDifferential: true } })
  return { avgHeatTotalDifferential: { label: 'Avg. Heat Differential', value: queryDifferential(query._avg.heatDifferential) } }
}

const excellentHeats = async (ctx: Context, input: z.infer<typeof tourResultStatSchema>) => {
  const query = await ctx.prisma.heatResult.count({ where: { ...heatResultFilter(input), heatTotal: { gte: 16 } } })
  return { excellentHeats: { label: 'Excellent Heats', value: queryFormat(query) } }
}

// WAVES //
const totalWaves = async (ctx: Context, input: z.infer<typeof tourResultStatSchema>) => {
  const query = await ctx.prisma.wave.count({ where: waveFilter(input) })
  return { totalWaves: { label: 'Total Waves', value: queryFormat(query) } }
}

const avgWaveScore = async (ctx: Context, input: z.infer<typeof tourResultStatSchema>) => {
  const query = await ctx.prisma.wave.aggregate({ where: waveFilter(input), _avg: { waveScore: true } })
  return { avgWaveScore: { label: 'Avg. Wave Score', value: queryRound(query._avg.waveScore) } }
}

const totalCountedWaves = async (ctx: Context, input: z.infer<typeof tourResultStatSchema>) => {
  const query = await ctx.prisma.wave.count({ where: { ...waveFilter(input), countedWave: true } })
  return { totalCountedWaves: { label: 'Total Counted Waves', value: queryFormat(query) } }
}

const avgCountedWaveScore = async (ctx: Context, input: z.infer<typeof tourResultStatSchema>) => {
  const query = await ctx.prisma.wave.aggregate({ where: { ...waveFilter(input), countedWave: true }, _avg: { waveScore: true } })
  return { avgCountedWaveScore: { label: 'Avg. Counted Wave Score', value: queryRound(query._avg.waveScore) } }
}

const highestWaveScore = async (ctx: Context, input: z.infer<typeof tourResultStatSchema>) => {
  const query = await ctx.prisma.wave.aggregate({ where: waveFilter(input), _max: { waveScore: true } })
  return { highestWaveScore: { label: 'Highest Wave Score', value: queryRound(query._max.waveScore) } }
}

const totalTens = async (ctx: Context, input: z.infer<typeof tourResultStatSchema>) => {
  const query = await ctx.prisma.wave.count({ where: { ...waveFilter(input), waveScore: 10 } })
  return { totalTens: { label: 'Ten Point Waves', value: queryFormat(query) } }
}

const excellentWaves = async (ctx: Context, input: z.infer<typeof tourResultStatSchema>) => {
  const query = await ctx.prisma.wave.count({ where: { ...waveFilter(input), waveScore: { gte: 8 } } })
  return { excellentWaves: { label: 'Excellent Waves', value: queryFormat(query) } }
}

// OTHER //
const prizeMoney = async (ctx: Context, input: z.infer<typeof tourResultStatSchema>) => {
  const query = await ctx.prisma.eventResult.aggregate({ where: { surferSlug: input.surferSlug, event: { year: input.year } }, _sum: { prizeMoney: true } })
  return { prizeMoney: { label: 'Year Earnings', value: queryMoney(query._sum.prizeMoney) } }
}

const totalInterferences = async (ctx: Context, input: z.infer<typeof tourResultStatSchema>) => {
  const query = await ctx.prisma.heatResult.aggregate({ where: { ...heatResultFilter(input), OR: [{ interferenceOne: { gte: 1 } }, { interferenceTwo: { gte: 1 } }, { interferenceThree: { gte: 1 } }] }, _sum: { interferenceOne: true, interferenceTwo: true, interferenceThree: true }}) // prettier-ignore
  const totalInt = (query._sum.interferenceOne ? query._sum.interferenceOne : 0) + (query._sum.interferenceTwo ? query._sum.interferenceTwo : 0) + (query._sum.interferenceThree ? query._sum.interferenceThree : 0)
  return { totalInterferences: { label: 'Interferences', value: queryFormat(totalInt) } }
}

// tourResult Stats
// ---------------
//   Total Events
//   Total Event Wins
//   Best Result
//   Average Result
//   Event Win Percentage
//   Total Heats
//   Average Heat Total
//   Heat Total Differential
//   Total Heat Wins
//   Heat Win Percentage
//   Highest Heat Total
//   Excellent Heats
//   Total Waves
//   Average Wave Score
//   Total Counted Waves
//   Avgerage Counted Wave Score
//   Total Completed Waves
//   Average Completed Wave Score
//   Wave Completion Percentage
//   Highest Wave Score
//   Excellent Waves
//   Prize Money
//   Boards Broken
