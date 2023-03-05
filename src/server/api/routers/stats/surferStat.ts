import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { getMoneyFormat } from '@/utils/format/moneyFormat'
import { ordinalSuffix } from '@/utils/format/ordinalSuffix'
import { createTRPCRouter, publicProcedure } from '../../trpc'
import { queryFormat, queryMoney, queryPerc, queryRound, querySuffix } from '@/utils/format/queryFormat'

const surferStatSchema = z.object({
  year: z.number().min(1900).max(2100).optional(),
  surferSlug: z.string().optional(),
})

export const surferStatRouter = createTRPCRouter({
  getAll: publicProcedure.input(surferStatSchema).query(({ ctx, input }) => {
    return getAll(ctx, input)
  }),

  getCareer: publicProcedure.input(surferStatSchema).query(({ ctx, input }) => {
    return getCareer(ctx, input)
  }),
  test: publicProcedure.input(surferStatSchema).query(({ ctx, input }) => {
    /// TEST AREA ///
  }),
})

const getAll = async (ctx: any, input: z.infer<typeof surferStatSchema>) => {
  const query = {
    ...(await surferRank_surferPoints(ctx, input)),
    ...(await worldTitles(ctx, input)),
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

    // ...(await totalCompletedWaves(ctx, input)),
    // ...(await avgCompletedWaveScore(ctx, input)),
    // ...(await waveCompletionPerc(ctx, input)),
  }
  if (!query) throw new TRPCError({ code: 'NOT_FOUND' })
  return query
}

const getCareer = async (ctx: any, input: z.infer<typeof surferStatSchema>) => {
  const query = {
    ...(await surferRank_surferPoints(ctx, input)),
    ...(await worldTitles(ctx, input)),
    ...(await totalEvents(ctx, input)),
    ...(await eventWins(ctx, input)),
    ...(await bestResult(ctx, input)),
    ...(await avgResult(ctx, input)),
    ...(await prizeMoney(ctx, input)),
  }
  if (!query) throw new TRPCError({ code: 'NOT_FOUND' })
  return query
}

// FITERS
const eventResultFilter = (input: z.infer<typeof surferStatSchema>) => ({ surferSlug: input.surferSlug, injured: false, withdrawn: false, NOT: { place: 0 }, event: { eventStatus: 'COMPLETED' } })
const heatResultFilter = (input: z.infer<typeof surferStatSchema>) => ({ surferSlug: input.surferSlug, heat: { heatStatus: 'COMPLETED' } })

// SURFER STATS QUERYS //
const surferRank_surferPoints = async (ctx: any, input: z.infer<typeof surferStatSchema>) => {
  const query = await ctx.prisma.tourResult.findFirstOrThrow({
    where: { surfer: { slug: input.surferSlug } },
    orderBy: { tour: { year: 'desc' } },
    select: { surferRank: true, surferPoints: true, tour: { select: { year: true } } },
  })
  const year = query.tour.year === new Date().getFullYear() ? undefined : query.tour.year
  return {
    surferRank: { label: 'Rank', value: querySuffix(query.surferRank), subValue: year },
    surferPoints: { label: 'Points', value: queryFormat(query.surferPoints), subValue: year },
  }
}

const worldTitles = async (ctx: any, input: z.infer<typeof surferStatSchema>) => {
  const query = await ctx.prisma.tourResult.count({ where: { surferSlug: input.surferSlug, worldTitle: true } })
  return { worldTitles: { label: 'World Titles', value: queryFormat(query) } }
}

// EVENTS //
const totalEvents = async (ctx: any, input: z.infer<typeof surferStatSchema>) => {
  const query = await ctx.prisma.eventResult.count({ where: eventResultFilter(input) })
  return { totalEvents: { label: 'Ct. Events', value: queryFormat(query) } }
}

const eventWins = async (ctx: any, input: z.infer<typeof surferStatSchema>) => {
  const query = await ctx.prisma.eventResult.count({ where: { surferSlug: input.surferSlug, place: 1 } })
  return { eventWins: { label: 'Ct. Event Wins', value: queryFormat(query) } }
}

const bestResult = async (ctx: any, input: z.infer<typeof surferStatSchema>) => {
  const query = await ctx.prisma.eventResult.aggregate({ where: { surferSlug: input.surferSlug, NOT: { place: 0 } }, _min: { place: true } })
  return { bestResult: { label: 'Best Result', value: querySuffix(query._min.place) } }
}

const avgResult = async (ctx: any, input: z.infer<typeof surferStatSchema>) => {
  const query = await ctx.prisma.eventResult.aggregate({ where: eventResultFilter(input), _avg: { place: true } })
  const avgResult = query._avg.place !== undefined ? ordinalSuffix(Math.round(query._avg.place)) : '-'
  return { avgResult: { label: 'Avg. Event Result', value: avgResult } }
}

const eventWinPerc = async (ctx: any, input: z.infer<typeof surferStatSchema>) => {
  const totalEventsQuery = await totalEvents(ctx, input)
  const eventWinsQuery = await eventWins(ctx, input)
  return { eventWinPerc: { label: 'Event Win %', value: queryPerc(eventWinsQuery.eventWins.value, totalEventsQuery.totalEvents.value) } }
}

// HEATS //
const totalHeats = async (ctx: any, input: z.infer<typeof surferStatSchema>) => {
  const query = await ctx.prisma.heatResult.count({ where: { ...heatResultFilter(input), NOT: { heatTotal: null } } })
  return { totalHeats: { label: 'Total Heats', value: queryFormat(query) } }
}

const heatWins = async (ctx: any, input: z.infer<typeof surferStatSchema>) => {
  const query = await ctx.prisma.heatResult.count({ where: { ...heatResultFilter(input), heatPlace: 1, NOT: { heatTotal: null } } })
  return { heatWins: { label: 'Heat Wins', value: queryFormat(query) } }
}

const heatWinPerc = async (ctx: any, input: z.infer<typeof surferStatSchema>) => {
  const totalHeatsQ = await totalHeats(ctx, input)
  const totalHeatWinsQ = await heatWins(ctx, input)
  return { heatWinPerc: { label: 'Heat Win %', value: queryPerc(totalHeatWinsQ.heatWins.value, totalHeatsQ.totalHeats.value) } }
}

const avgHeatTotal = async (ctx: any, input: z.infer<typeof surferStatSchema>) => {
  const query = await ctx.prisma.heatResult.aggregate({ where: { ...heatResultFilter(input), NOT: { heatTotal: null } }, _avg: { heatTotal: true } })
  return { avgHeatTotal: { label: 'Avg. Heat Total', value: queryRound(query._avg.heatTotal) } }
}

const highestHeatTotal = async (ctx: any, input: z.infer<typeof surferStatSchema>) => {
  const query = await ctx.prisma.heatResult.aggregate({ where: heatResultFilter(input), _max: { heatTotal: true } })
  return { highestHeatTotal: { label: 'Highest Heat Total', value: queryRound(query._max.heatTotal) } }
}

const heatTotalDifferential = async (ctx: any, input: z.infer<typeof surferStatSchema>) => {
  const query = await ctx.prisma.heatResult.aggregate({ where: heatResultFilter(input), _sum: { heatDifferential: true } })
  return { heatTotalDifferential: { label: 'Heat Differential', value: queryRound(query._sum.heatDifferential) } }
}

const avgHeatTotalDifferential = async (ctx: any, input: z.infer<typeof surferStatSchema>) => {
  const query = await ctx.prisma.heatResult.aggregate({ where: heatResultFilter(input), _avg: { heatDifferential: true } })
  return { avgHeatTotalDifferential: { label: 'Avg. Heat Differential', value: queryRound(query._avg.heatDifferential) } }
}

const excellentHeats = async (ctx: any, input: z.infer<typeof surferStatSchema>) => {
  const query = await ctx.prisma.heatResult.count({ where: { ...heatResultFilter(input), heatTotal: { gte: 16 } } })
  return { excellentHeats: { label: 'Excellent Heats', value: queryFormat(query) } }
}

// WAVES //
const totalWaves = async (ctx: any, input: z.infer<typeof surferStatSchema>) => {
  const query = await ctx.prisma.wave.count({ where: { surferSlug: input.surferSlug } })
  return { totalWaves: { label: 'Total Waves', value: queryFormat(query) } }
}

const avgWaveScore = async (ctx: any, input: z.infer<typeof surferStatSchema>) => {
  const query = await ctx.prisma.wave.aggregate({ where: { surferSlug: input.surferSlug }, _avg: { waveScore: true } })
  return { avgWaveScore: { label: 'Avg. Wave Score', value: queryRound(query._avg.waveScore) } }
}

const totalCountedWaves = async (ctx: any, input: z.infer<typeof surferStatSchema>) => {
  const query = await ctx.prisma.wave.count({ where: { surferSlug: input.surferSlug, countedWave: true } })
  return { totalCountedWaves: { label: 'Total Counted Waves', value: queryFormat(query) } }
}

const avgCountedWaveScore = async (ctx: any, input: z.infer<typeof surferStatSchema>) => {
  const query = await ctx.prisma.wave.aggregate({ where: { surferSlug: input.surferSlug, countedWave: true }, _avg: { waveScore: true } })
  return { avgCountedWaveScore: { label: 'Avg. Counted Wave Score', value: queryRound(query._avg.waveScore) } }
}

const highestWaveScore = async (ctx: any, input: z.infer<typeof surferStatSchema>) => {
  const query = await ctx.prisma.wave.aggregate({ where: { surferSlug: input.surferSlug }, _max: { waveScore: true } })
  return { highestWaveScore: { label: 'Highest Wave Score', value: queryRound(query._max.waveScore) } }
}

const excellentWaves = async (ctx: any, input: z.infer<typeof surferStatSchema>) => {
  const query = await ctx.prisma.wave.count({ where: { surferSlug: input.surferSlug, waveScore: { gte: 8 } } })
  return { excellentWaves: { label: 'Excellent Waves', value: queryFormat(query) } }
}

// OTHER
const prizeMoney = async (ctx: any, input: z.infer<typeof surferStatSchema>) => {
  const query = await ctx.prisma.eventResult.aggregate({ where: { surferSlug: input.surferSlug }, _sum: { prizeMoney: true } })
  return { prizeMoney: { label: 'Career Earnings', value: queryMoney(query._sum.prizeMoney) } }
}

// surfer
// ---------------
//   Average Season Finishing rank
//   Average Season Finishing total points
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
