import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { getMoneyFormat } from '@/utils/format/moneyFormat'
import { ordinalSuffix } from '@/utils/format/ordinalSuffix'
import { createTRPCRouter, publicProcedure } from '../../trpc'
import { queryDifferential, queryDivide, queryFormat, queryMoney, queryPerc, queryRound, querySuffix } from '@/utils/format/queryFormat'
import { Context } from '@/utils/interfaces'
import { Status } from '@prisma/client'

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
})

const getAll = async (ctx: Context, input: z.infer<typeof surferStatSchema>) => {
  // wavesPerMinute(ctx, input)
  // const { surferRank, surferPoints, worldTitles, prizeMoney, totalEvents, eventWins, bestResult, avgResult } = statQuery
  const query = {
    // ...(await surferRank_surferPoints(ctx, input)),
    // ...(await worldTitles(ctx, input)),
    // ...(await totalEvents(ctx, input)),
    // ...(await eventWins(ctx, input)),
    // ...(await bestResult(ctx, input)),
    // ...(await avgResult(ctx, input)),
    ...(await eventWinPerc(ctx, input)),
    ...(await totalHeats(ctx, input)),
    ...(await avgHeatTotal(ctx, input)),
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
    ...(await totalTens(ctx, input)),
    ...(await excellentWaves(ctx, input)),
    // ...(await prizeMoney(ctx, input)),
    ...(await totalInterferences(ctx, input)),
    ...(await mostBeaten(ctx, input)),
    ...(await mostBeatenBy(ctx, input)),

    // ...(await totalCompletedWaves(ctx, input)),
    // ...(await avgCompletedWaveScore(ctx, input)),
    // ...(await waveCompletionPerc(ctx, input)),
  }
  if (!query) throw new TRPCError({ code: 'NOT_FOUND' })
  return query
}

const getCareer = async (ctx: Context, input: z.infer<typeof surferStatSchema>) => {
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
const eventResultFilter = (input: z.infer<typeof surferStatSchema>) => ({ surferSlug: input.surferSlug, injured: false, withdrawn: false, NOT: { place: 0 }, event: { eventStatus: 'COMPLETED' as Status } })
const heatResultFilter = (input: z.infer<typeof surferStatSchema>) => ({ surferSlug: input.surferSlug, heat: { heatStatus: 'COMPLETED' as Status } })

// SURFER STATS QUERYS //
const surferRank_surferPoints = async (ctx: Context, input: z.infer<typeof surferStatSchema>) => {
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

const worldTitles = async (ctx: Context, input: z.infer<typeof surferStatSchema>) => {
  const query = await ctx.prisma.tourResult.count({ where: { surferSlug: input.surferSlug, worldTitle: true } })
  return { worldTitles: { label: 'World Titles', value: queryFormat(query) } }
}

// EVENTS //
const totalEvents = async (ctx: Context, input: z.infer<typeof surferStatSchema>) => {
  const query = await ctx.prisma.eventResult.count({ where: eventResultFilter(input) })
  return { totalEvents: { label: 'Ct. Events', value: queryFormat(query) } }
}

const eventWins = async (ctx: Context, input: z.infer<typeof surferStatSchema>) => {
  const query = await ctx.prisma.eventResult.count({ where: { surferSlug: input.surferSlug, place: 1 } })
  return { eventWins: { label: 'Ct. Event Wins', value: queryFormat(query) } }
}

const bestResult = async (ctx: Context, input: z.infer<typeof surferStatSchema>) => {
  const query = await ctx.prisma.eventResult.aggregate({ where: { surferSlug: input.surferSlug, NOT: { place: 0 } }, _min: { place: true } })
  return { bestResult: { label: 'Best Result', value: querySuffix(query._min.place) } }
}

const avgResult = async (ctx: Context, input: z.infer<typeof surferStatSchema>) => {
  const query = await ctx.prisma.eventResult.aggregate({ where: eventResultFilter(input), _avg: { place: true } })
  const avgResult = query._avg && query._avg.place ? ordinalSuffix(Math.round(query._avg.place)) : '-'
  return { avgResult: { label: 'Avg. Event Result', value: avgResult } }
}

const eventWinPerc = async (ctx: Context, input: z.infer<typeof surferStatSchema>) => {
  const totalEventsQuery = await totalEvents(ctx, input)
  const eventWinsQuery = await eventWins(ctx, input)
  return { eventWinPerc: { label: 'Event Win %', value: queryPerc(eventWinsQuery.eventWins.value, totalEventsQuery.totalEvents.value) } }
}

// HEATS //
const totalHeats = async (ctx: Context, input: z.infer<typeof surferStatSchema>) => {
  const query = await ctx.prisma.heatResult.count({ where: { ...heatResultFilter(input), NOT: { heatTotal: null } } })
  return { totalHeats: { label: 'Total Heats', value: queryFormat(query) } }
}

const heatWins = async (ctx: Context, input: z.infer<typeof surferStatSchema>) => {
  const query = await ctx.prisma.heatResult.count({ where: { ...heatResultFilter(input), heatPlace: 1, NOT: { heatTotal: null } } })
  return { heatWins: { label: 'Heat Wins', value: queryFormat(query) } }
}

const heatWinPerc = async (ctx: Context, input: z.infer<typeof surferStatSchema>) => {
  const totalHeatsQ = await totalHeats(ctx, input)
  const totalHeatWinsQ = await heatWins(ctx, input)
  return { heatWinPerc: { label: 'Heat Win %', value: queryPerc(totalHeatWinsQ.heatWins.value, totalHeatsQ.totalHeats.value) } }
}

const avgHeatTotal = async (ctx: Context, input: z.infer<typeof surferStatSchema>) => {
  const query = await ctx.prisma.heatResult.aggregate({ where: { ...heatResultFilter(input), NOT: { heatTotal: null } }, _avg: { heatTotal: true } })
  return { avgHeatTotal: { label: 'Avg. Heat Total', value: queryRound(query._avg.heatTotal) } }
}

const highestHeatTotal = async (ctx: Context, input: z.infer<typeof surferStatSchema>) => {
  const query = await ctx.prisma.heatResult.aggregate({ where: heatResultFilter(input), _max: { heatTotal: true } })
  return { highestHeatTotal: { label: 'Highest Heat Total', value: queryRound(query._max.heatTotal) } }
}

// const heatTotalDifferential = async (ctx: Context, input: z.infer<typeof surferStatSchema>) => {
//   const query = await ctx.prisma.heatResult.aggregate({ where: heatResultFilter(input), _sum: { heatDifferential: true } })
//   return { heatTotalDifferential: { label: 'Heat Total Differential', value: queryDifferential(query._sum.heatDifferential) } }
// }

const avgHeatTotalDifferential = async (ctx: Context, input: z.infer<typeof surferStatSchema>) => {
  const query = await ctx.prisma.heatResult.aggregate({ where: heatResultFilter(input), _avg: { heatDifferential: true } })
  return { avgHeatTotalDifferential: { label: 'Avg. Heat Differential', value: queryDifferential(query._avg.heatDifferential) } }
}

const excellentHeats = async (ctx: Context, input: z.infer<typeof surferStatSchema>) => {
  const query = await ctx.prisma.heatResult.count({ where: { ...heatResultFilter(input), heatTotal: { gte: 16 } } })
  return { excellentHeats: { label: 'Excellent Heats', value: queryFormat(query) } }
}

// WAVES //
const totalWaves = async (ctx: Context, input: z.infer<typeof surferStatSchema>) => {
  const query = await ctx.prisma.wave.count({ where: { surferSlug: input.surferSlug } })
  return { totalWaves: { label: 'Total Waves', value: queryFormat(query) } }
}

const avgWaveScore = async (ctx: Context, input: z.infer<typeof surferStatSchema>) => {
  const query = await ctx.prisma.wave.aggregate({ where: { surferSlug: input.surferSlug }, _avg: { waveScore: true } })
  return { avgWaveScore: { label: 'Avg. Wave Score', value: queryRound(query._avg.waveScore) } }
}

const avgWavesPerEvent = async (ctx: Context, input: z.infer<typeof surferStatSchema>) => {
  const totalEventsQ = await totalEvents(ctx, input)
  const totalWavesQ = await totalWaves(ctx, input)
  return { avgWavesPerEvent: { label: 'Avg. Waves Per Event', value: queryDivide(totalWavesQ.totalWaves.value, totalEventsQ.totalEvents.value) } }
}

const avgWavesPerHeat = async (ctx: Context, input: z.infer<typeof surferStatSchema>) => {
  const totalHeatsQ = await totalHeats(ctx, input)
  const totalWavesQ = await totalWaves(ctx, input)
  return { avgWavesPerHeat: { label: 'Avg. Waves Per Heat', value: queryDivide(totalWavesQ.totalWaves.value, totalHeatsQ.totalHeats.value) } }
}

// const wavesPerMinute = async (ctx: Context, input: z.infer<typeof surferStatSchema>) => {
//   const totalWavesX = await ctx.prisma.wave.count({ where: { surferSlug: input.surferSlug, heat: { heatDuration: {not: null}}} })
//   // const totalMinutes = await ctx.prisma.
//   // console.log(totalWavesQ)
//   // console.log(totalWavesX)

// }

const totalCountedWaves = async (ctx: Context, input: z.infer<typeof surferStatSchema>) => {
  const query = await ctx.prisma.wave.count({ where: { surferSlug: input.surferSlug, countedWave: true } })
  return { totalCountedWaves: { label: 'Total Counted Waves', value: queryFormat(query) } }
}

const avgCountedWaveScore = async (ctx: Context, input: z.infer<typeof surferStatSchema>) => {
  const query = await ctx.prisma.wave.aggregate({ where: { surferSlug: input.surferSlug, countedWave: true }, _avg: { waveScore: true } })
  return { avgCountedWaveScore: { label: 'Avg. Counted Wave Score', value: queryRound(query._avg.waveScore) } }
}

const highestWaveScore = async (ctx: Context, input: z.infer<typeof surferStatSchema>) => {
  const query = await ctx.prisma.wave.aggregate({ where: { surferSlug: input.surferSlug }, _max: { waveScore: true } })
  return { highestWaveScore: { label: 'Highest Wave Score', value: queryRound(query._max.waveScore) } }
}

const totalTens = async (ctx: Context, input: z.infer<typeof surferStatSchema>) => {
  const query = await ctx.prisma.wave.count({ where: { surferSlug: input.surferSlug, waveScore: 10 } })
  return { totalTens: { label: 'Ten Point Waves', value: queryFormat(query) } }
}

const excellentWaves = async (ctx: Context, input: z.infer<typeof surferStatSchema>) => {
  const query = await ctx.prisma.wave.count({ where: { surferSlug: input.surferSlug, waveScore: { gte: 8 } } })
  return { excellentWaves: { label: 'Excellent Waves', value: queryFormat(query) } }
}

const midRangeWaves = async (ctx: Context, input: z.infer<typeof surferStatSchema>) => {
  const query = await ctx.prisma.wave.count({ where: { surferSlug: input.surferSlug, waveScore: { gte: 4, lt: 8 } } })
  return { midRangeWaves: { label: 'Mid-Range Waves', value: queryFormat(query) } }
}

const lowRangeWaves = async (ctx: Context, input: z.infer<typeof surferStatSchema>) => {
  const query = await ctx.prisma.wave.count({ where: { surferSlug: input.surferSlug, waveScore: { lt: 4 } } })
  return { lowRangeWaves: { label: 'Low-Range Waves', value: queryFormat(query) } }
}

// OTHER
const prizeMoney = async (ctx: Context, input: z.infer<typeof surferStatSchema>) => {
  const query = await ctx.prisma.eventResult.aggregate({ where: { surferSlug: input.surferSlug }, _sum: { prizeMoney: true } })
  return { prizeMoney: { label: 'Career Earnings', value: queryMoney(query._sum.prizeMoney) } }
}

const totalInterferences = async (ctx: Context, input: z.infer<typeof surferStatSchema>) => {
  const query = await ctx.prisma.heatResult.aggregate({ where: { ...heatResultFilter(input), OR: [{ interferenceOne: { gte: 1 } }, { interferenceTwo: { gte: 1 } }, { interferenceThree: { gte: 1 } }] }, _sum: { interferenceOne: true, interferenceTwo: true, interferenceThree: true } }) //prettier-ignore
  const totalInt = (query._sum.interferenceOne ? query._sum.interferenceOne : 0) + (query._sum.interferenceTwo ? query._sum.interferenceTwo : 0) + (query._sum.interferenceThree ? query._sum.interferenceThree : 0)
  return { totalInterferences: { label: 'Interferences', value: queryFormat(totalInt) } }
}

const mostBeaten = async (ctx: Context, input: z.infer<typeof surferStatSchema>) => {
  const query = await ctx.prisma.heatBeatenBy.findMany({ where: { surferBeatenBySlug: input.surferSlug }, select: { heatResult: { select: { surfer: { select: { name: true } } } } } })
  const queryMap = query.map((item) => item.heatResult.surfer.name)
  const queryCount = queryMap.reduce((acc: any, cur) => {
    typeof acc[cur] == 'undefined' ? (acc[cur] = 1) : (acc[cur] += 1)
    return acc
  }, {})
  const querySort = Object.entries(queryCount).sort((a: any, b: any) => b[1] - a[1])
  const mostBeatenSurfers = querySort.filter((item: any) => item[1] === querySort[0]![1])
  const mostBeatenCount = mostBeatenSurfers[0]![1]
  const mostBeatenNames = mostBeatenSurfers.length > 2 ? mostBeatenSurfers.map((item: any) => item[0]).slice(0, 2).join(', ') + '...' : mostBeatenSurfers.map((item: any) => item[0]).join(', ') // prettier-ignore
  return { mostBeaten: { label: 'Most Beaten', value: mostBeatenNames, subValue: mostBeatenCount } }
}

const mostBeatenBy = async (ctx: Context, input: z.infer<typeof surferStatSchema>) => {
  const query = await ctx.prisma.heatBeatenBy.findMany({ where: { surferSlug: input.surferSlug }, select: { surferBeatenBy: { select: { name: true } } } })
  const queryMap = query.map((item) => item.surferBeatenBy.name)
  const queryCount = queryMap.reduce((acc: any, cur) => {
    typeof acc[cur] == 'undefined' ? (acc[cur] = 1) : (acc[cur] += 1)
    return acc
  }, {})
  const querySort = Object.entries(queryCount).sort((a: any, b: any) => b[1] - a[1])
  const mostBeatenBySurfers = querySort.filter((item: any) => item[1] === querySort[0]![1])
  const mostBeatenByNames = mostBeatenBySurfers.length > 2 ? mostBeatenBySurfers.map((item: any) => item[0]).slice(0, 2).join(', ') + '...' : mostBeatenBySurfers.map((item: any) => item[0]).join(', ') // prettier-ignore
  const mostBeatenByCount = mostBeatenBySurfers[0]![1]
  return { mostBeatenBy: { label: 'Most Beaten By', value: mostBeatenByNames, subValue: mostBeatenByCount } }
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
