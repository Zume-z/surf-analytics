import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { Context, Surfer } from '@/utils/interfaces'
import { GENDER, SORTDIR } from '@/utils/enums'
import { createTRPCRouter, publicProcedure } from '../../trpc'
import { queryFormat, queryMoney, queryPerc, queryRound, querySuffix } from '@/utils/format/queryFormat'

const countryStatSchema = z.object({
  countrySlug: z.string().optional(),
  gender: z.enum(GENDER).optional(),
  year: z.number().min(1900).max(2100).optional(),
})

export const countrySurferStatRouter = createTRPCRouter({
  getAll: publicProcedure.input(countryStatSchema).query(({ ctx, input }) => {
    return getAll(ctx, input)
  }),

  getCountrySurfer: publicProcedure.input(countryStatSchema).query(({ ctx, input }) => {
    return getCountrySurfer(ctx, input)
  }),
  test: publicProcedure.input(countryStatSchema).query(({ ctx, input }) => {
    // const query =  ctx.prisma.heatResult.count({ where: { surfer: surferFilter(input), heat: { event: { year: input.year } }, NOT: { heatTotal: null } } })
  }),
})

const getAll = async (ctx: Context, input: z.infer<typeof countryStatSchema>) => {
  const query = {
    ...(await worldTitles(ctx, input)),
    ...(await avgRank(ctx, input)),
    ...(await avgPoints(ctx, input)),
    ...(await totalEvents(ctx, input)),
    ...(await eventWins(ctx, input)),
    ...(await bestResult(ctx, input)),
    ...(await avgResult(ctx, input)),
    ...(await eventWinPerc(ctx, input)),

    ...(await totalHeats(ctx, input)),
    ...(await avgHeatTotal(ctx, input)),
    ...(await heatTotalDifferential(ctx, input)),
    ...(await avgHeatTotalDifferential(ctx, input)),
    ...(await heatWins(ctx, input)),
    ...(await heatWinPerc(ctx, input)),
    ...(await highestHeatTotal(ctx, input)),
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

const getCountrySurfer = async (ctx: Context, input: z.infer<typeof countryStatSchema>) => {
  const query = {
    ...(await worldTitles(ctx, input)),
    ...(await avgRank(ctx, input)),
    ...(await avgPoints(ctx, input)),
    ...(await totalEvents(ctx, input)),
    ...(await eventWins(ctx, input)),
    ...(await avgResult(ctx, input)),
    ...(await eventWinPerc(ctx, input)),
    ...(await totalHeats(ctx, input)),
    ...(await avgHeatTotal(ctx, input)),
    ...(await heatWins(ctx, input)),
    ...(await heatWinPerc(ctx, input)),
    ...(await prizeMoney(ctx, input)),
  }
  if (!query) throw new TRPCError({ code: 'NOT_FOUND' })
  return query
}

// COUNTRY STATS QUERYS //

// Filters
const surferFilter = (input: z.infer<typeof countryStatSchema>) => ({ countrySlug: input.countrySlug, gender: input.gender })
const tourResultFilter = (input: z.infer<typeof countryStatSchema>) => ({ surfer: { countrySlug: input.countrySlug, gender: input.gender }, tour: { year: input.year, canceled: false } })

// ADD YEAR FILTER
const worldTitles = async (ctx: Context, input: z.infer<typeof countryStatSchema>) => {
  const query = await ctx.prisma.tourResult.count({ where: { surfer: surferFilter(input), worldTitle: true } })
  return { worldTitles: { label: 'World Titles', value: queryFormat(query) } }
}

const avgRank = async (ctx: Context, input: z.infer<typeof countryStatSchema>) => {
  const query = await ctx.prisma.tourResult.aggregate({ where: tourResultFilter(input), _avg: { surferRank: true } })
  if (!input.year) return { avgRank: { label: 'Avg. Rank', value: '-' } }
  return { avgRank: { label: 'Avg. Rank', value: querySuffix(query._avg?.surferRank) } }
}

const avgPoints = async (ctx: Context, input: z.infer<typeof countryStatSchema>) => {
  const query = await ctx.prisma.tourResult.aggregate({ where: tourResultFilter(input), _avg: { surferPoints: true } })
  if (!input.year) return { avgPoints: { label: 'Avg. Points', value: '-' } }
  const avgPoints = query._avg?.surferPoints ? Math.round(query._avg?.surferPoints) : '-'
  return { avgPoints: { label: 'Avg. Points', value: queryFormat(avgPoints) } }
}

// EVENTS //
const totalEvents = async (ctx: Context, input: z.infer<typeof countryStatSchema>) => {
  const query = await ctx.prisma.event.count({ where: { year: input.year, eventStatus: 'COMPLETED', AND: { eventResults: { some: { surfer: surferFilter(input) } } } } })
  return { totalEvents: { label: 'Ct. Events', value: queryFormat(query) } }
}

const eventWins = async (ctx: Context, input: z.infer<typeof countryStatSchema>) => {
  const query = await ctx.prisma.eventResult.count({ where: { surfer: surferFilter(input), event: { year: input.year, eventStatus: 'COMPLETED' }, place: 1 } })
  return { eventWins: { label: 'Ct. Event Wins', value: queryFormat(query) } }
}

const eventWinPerc = async (ctx: Context, input: z.infer<typeof countryStatSchema>) => {
  const totalEventsQuery = await totalEvents(ctx, input)
  const eventWinsQuery = await eventWins(ctx, input)
  if (!totalEventsQuery || !eventWinsQuery) throw new TRPCError({ code: 'NOT_FOUND' })
  return { eventWinPerc: { label: 'Event Win %', value: queryPerc(eventWinsQuery.eventWins.value, totalEventsQuery.totalEvents.value) } }
}

const bestResult = async (ctx: Context, input: z.infer<typeof countryStatSchema>) => {
  const query = await ctx.prisma.eventResult.aggregate({ where: { surfer: surferFilter(input), event: { year: input.year }, NOT: { place: 0 } }, _min: { place: true } })
  return { bestResult: { label: 'Best Result', value: querySuffix(query._min.place) } }
}

const avgResult = async (ctx: Context, input: z.infer<typeof countryStatSchema>) => {
  const query = await ctx.prisma.eventResult.aggregate({
    where: { surfer: surferFilter(input), event: { year: input.year, eventStatus: 'COMPLETED' }, injured: false, withdrawn: false, NOT: { place: 0 } },
    _avg: { place: true },
  })
  return { avgResult: { label: 'Avg. Event Result', value: querySuffix(query._avg.place) } }
}

// HEATS //
const totalHeats = async (ctx: Context, input: z.infer<typeof countryStatSchema>) => {
  const query = await ctx.prisma.heat.count({ where: { heatStatus: 'COMPLETED', event: { year: input.year, eventStatus: 'COMPLETED' }, heatResults: { some: { surfer: surferFilter(input) } } } })
  return { totalHeats: { label: 'Total Heats', value: queryFormat(query) } }
}

const heatWins = async (ctx: Context, input: z.infer<typeof countryStatSchema>) => {
  const query = await ctx.prisma.heatResult.count({ where: { surfer: surferFilter(input), heat: { heatStatus: 'COMPLETED', event: { year: input.year } }, heatPlace: 1, NOT: { heatTotal: null } } })
  return { heatWins: { label: 'Heat Wins', value: queryFormat(query) } }
}

const heatWinPerc = async (ctx: Context, input: z.infer<typeof countryStatSchema>) => {
  const totalHeatsQ = await totalHeats(ctx, input)
  const totalHeatWinsQ = await heatWins(ctx, input)
  if (!totalHeatsQ || !totalHeatWinsQ) throw new TRPCError({ code: 'NOT_FOUND' })
  return { heatWinPerc: { label: 'Heat Win %', value: queryPerc(totalHeatWinsQ.heatWins.value, totalHeatsQ.totalHeats.value) } }
}

const avgHeatTotal = async (ctx: Context, input: z.infer<typeof countryStatSchema>) => {
  const query = await ctx.prisma.heatResult.aggregate({ where: { surfer: surferFilter(input), heat: { heatStatus: 'COMPLETED', event: { year: input.year } }, NOT: { heatTotal: null } }, _avg: { heatTotal: true } })
  return { avgHeatTotal: { label: 'Avg. Heat Total', value: queryRound(query._avg.heatTotal) } }
}

const highestHeatTotal = async (ctx: Context, input: z.infer<typeof countryStatSchema>) => {
  const query = await ctx.prisma.heatResult.aggregate({ where: { surfer: surferFilter(input), heat: { heatStatus: 'COMPLETED', event: { year: input.year } } }, _max: { heatTotal: true } })
  return { highestHeatTotal: { label: 'Highest Heat Total', value: queryRound(query._max.heatTotal) } }
}

const heatTotalDifferential = async (ctx: Context, input: z.infer<typeof countryStatSchema>) => {
  const query = await ctx.prisma.heatResult.aggregate({ where: { surfer: surferFilter(input), heat: { heatStatus: 'COMPLETED', event: { year: input.year } } }, _sum: { heatDifferential: true } })
  return { heatTotalDifferential: { label: 'Heat Differential', value: queryRound(query._sum.heatDifferential) } }
}

const avgHeatTotalDifferential = async (ctx: Context, input: z.infer<typeof countryStatSchema>) => {
  const query = await ctx.prisma.heatResult.aggregate({ where: { surfer: surferFilter(input), heat: { heatStatus: 'COMPLETED', event: { year: input.year } } }, _avg: { heatDifferential: true } })
  return { avgHeatTotalDifferential: { label: 'Avg.Heat Differential', value: queryRound(query._avg.heatDifferential) } }
}

const excellentHeats = async (ctx: Context, input: z.infer<typeof countryStatSchema>) => {
  const query = await ctx.prisma.heatResult.count({ where: { surfer: surferFilter(input), heat: { heatStatus: 'COMPLETED', event: { year: input.year } }, heatTotal: { gte: 16 } } })
  return { excellentHeats: { label: 'Excellent Heats', value: queryFormat(query) } }
}

// WAVES //
const totalWaves = async (ctx: Context, input: z.infer<typeof countryStatSchema>) => {
  const query = await ctx.prisma.wave.count({ where: { surfer: surferFilter(input), heat: { event: { year: input.year } } } })
  return { totalWaves: { label: 'Total Waves', value: queryFormat(query) } }
}

const avgWaveScore = async (ctx: Context, input: z.infer<typeof countryStatSchema>) => {
  const query = await ctx.prisma.wave.aggregate({ where: { surfer: surferFilter(input), heat: { event: { year: input.year } } }, _avg: { waveScore: true } })
  return { avgWaveScore: { label: 'Avg.Wave Score', value: queryRound(query._avg.waveScore) } }
}

const totalCountedWaves = async (ctx: Context, input: z.infer<typeof countryStatSchema>) => {
  const query = await ctx.prisma.wave.count({ where: { surfer: surferFilter(input), heat: { event: { year: input.year } }, countedWave: true } })
  return { totalCountedWaves: { label: 'Total Counted Waves', value: queryFormat(query) } }
}

const avgCountedWaveScore = async (ctx: Context, input: z.infer<typeof countryStatSchema>) => {
  const query = await ctx.prisma.wave.aggregate({ where: { surfer: surferFilter(input), heat: { event: { year: input.year } }, countedWave: true }, _avg: { waveScore: true } })
  return { avgCountedWaveScore: { label: 'Avg.Counted Wave Score', value: queryFormat(query._avg.waveScore) } }
}

const highestWaveScore = async (ctx: Context, input: z.infer<typeof countryStatSchema>) => {
  const query = await ctx.prisma.wave.aggregate({ where: { surfer: surferFilter(input), heat: { event: { year: input.year } } }, _max: { waveScore: true } })
  return { highestWaveScore: { label: 'Highest Wave Score', value: queryRound(query._max.waveScore) } }
}

const excellentWaves = async (ctx: Context, input: z.infer<typeof countryStatSchema>) => {
  const query = await ctx.prisma.wave.count({ where: { surfer: surferFilter(input), heat: { event: { year: input.year } }, waveScore: { gte: 8 } } })
  return { excellentWaves: { label: 'Excellent Waves', value: queryFormat(query) } }
}

// // OTHER
const prizeMoney = async (ctx: Context, input: z.infer<typeof countryStatSchema>) => {
  const query = await ctx.prisma.eventResult.aggregate({ where: { surfer: surferFilter(input), event: { year: input.year } }, _sum: { prizeMoney: true } })
  return { prizeMoney: { label: 'Total Earnings', value: queryMoney(query._sum.prizeMoney) } }
}

// Country Surfers
// ---------------
//   World Titles
//   Average Rank
//   Average Total points
//   Total Surfers?
//   Total Events // Atleast one surfer from country
//   Total Event Wins
//   Best Result
//   Average Result
//   Event Win Percentage // Atleast one surfer from country
//   Total Heats
//   Average Heat Total
//   Avg.Total Differential
//   Heat Total Differential
//   Total Heat Wins
//   Heat Win Percentage
//   Highest Heat Total
//   Excellent Heats
//   Total Waves
//   Average Wave Score
//   Total Counted Waves
//   Average Counted Wave Score
//   Total Completed Waves
//   Average Completed Wave Score
//   Wave Completion Percentage
//   Highest Wave Score
//   Excellent Waves
//   Prize Money

//   Boards Broken
//   Average Season Finishing rank
//   Average Season Finishing total points
