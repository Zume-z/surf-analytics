import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { createTRPCRouter, publicProcedure } from '../../trpc'
import { queryDifferential, queryFormat, queryMoney, queryPerc, queryRound, querySuffix } from '@/utils/format/queryFormat'
import { Context } from '@/utils/interfaces'
import { Status } from '@prisma/client'

const eventResultStatSchema = z.object({
  eventSlug: z.string(),
  surferSlug: z.string(),
})
const eventResultAnalyticSchema = z.object({
  surferSlug: z.string(),
  eventArr: z.array(z.string()),
})

export const eventResultStatRouter = createTRPCRouter({
  getAll: publicProcedure.input(eventResultStatSchema).query(({ ctx, input }) => {
    return getAll(ctx, input)
  }),

  getHeats: publicProcedure.input(eventResultStatSchema).query(({ ctx, input }) => {
    return getHeats(ctx, input)
  }),

  getAnalytics: publicProcedure.input(eventResultAnalyticSchema).query(({ ctx, input }) => {
    const queries = input.eventArr.map((eventSlug) => getAnalytics(ctx, { eventSlug, surferSlug: input.surferSlug }))
    return Promise.all(queries)
  }),
})

const getAll = async (ctx: Context, input: z.infer<typeof eventResultStatSchema>) => {
  const query = {
    ...(await eventPlace_eventPoints_knockedOutBy(ctx, input)),
    ...(await totalHeats(ctx, input)),
    ...(await avgHeatTotal(ctx, input)),
    ...(await heatWins(ctx, input)),
    ...(await heatWinPerc(ctx, input)),
    ...(await highestHeatTotal(ctx, input)),
    ...(await excellentHeats(ctx, input)),
    ...(await totalWaves(ctx, input)),
    ...(await avgWaveScore(ctx, input)),
    ...(await totalCountedWaves(ctx, input)),
    ...(await avgCountedWaveScore(ctx, input)),

    ...(await avgHeatTotalDifferential(ctx, input)),
    ...(await highestWaveScore(ctx, input)),
    ...(await totalTens(ctx, input)),
    ...(await excellentWaves(ctx, input)),
    ...(await prizeMoney(ctx, input)),
    ...(await totalInterferences(ctx, input)),

    // (..{await totalCompletedWaves(ctx, input)),
    // (..{await avgCompletedWaveScore(ctx, input)),
    // (..{await waveCompletionPerc(ctx, input)),
  }
  if (!query) throw new TRPCError({ code: 'NOT_FOUND' })
  return query
}

const getAnalytics = async (ctx: Context, input: z.infer<typeof eventResultStatSchema>) => {
  const event = { event: { label: 'Event', value: input.eventSlug } }
  const query = {
    ...event,
    ...(await eventPlace_eventPoints_knockedOutBy(ctx, input)),
    ...(await totalHeats(ctx, input)),
    ...(await avgHeatTotal(ctx, input)),
    ...(await heatWins(ctx, input)),
    ...(await heatWinPerc(ctx, input)),
    ...(await highestHeatTotal(ctx, input)),
    ...(await excellentHeats(ctx, input)),
    ...(await totalWaves(ctx, input)),
    ...(await avgWaveScore(ctx, input)),
    ...(await totalCountedWaves(ctx, input)),
    ...(await avgCountedWaveScore(ctx, input)),

    ...(await avgHeatTotalDifferential(ctx, input)),
    ...(await highestWaveScore(ctx, input)),
    ...(await excellentWaves(ctx, input)),
    ...(await prizeMoney(ctx, input)),

    // (..{await totalCompletedWaves(ctx, input)),
    // (..{await avgCompletedWaveScore(ctx, input)),
    // (..{await waveCompletionPerc(ctx, input)),
  }
  if (!query) throw new TRPCError({ code: 'NOT_FOUND' })
  return query
}

const getHeats = async (ctx: Context, input: z.infer<typeof eventResultStatSchema>) => {
  const query = {
    ...(await eventPlace_eventPoints_knockedOutBy(ctx, input)),
    ...(await totalHeats(ctx, input)),
    ...(await avgHeatTotal(ctx, input)),
    ...(await heatWins(ctx, input)),
    ...(await heatWinPerc(ctx, input)),
    ...(await totalWaves(ctx, input)),
    ...(await avgWaveScore(ctx, input)),
    ...(await avgCountedWaveScore(ctx, input)),
    ...(await highestWaveScore(ctx, input)),
    ...(await prizeMoney(ctx, input)),
  }
  if (!query) throw new TRPCError({ code: 'NOT_FOUND' })
  return query
}

// FILTERS

const heatResultFilter = (input: z.infer<typeof eventResultStatSchema>) => ({ surferSlug: input.surferSlug, heat: { heatStatus: 'COMPLETED' as Status, event: { slug: input.eventSlug } } })
const waveFilter = (input: z.infer<typeof eventResultStatSchema>) => ({ surferSlug: input.surferSlug, heat: { event: { slug: input.eventSlug } } })

const eventPlace_eventPoints_knockedOutBy = async (ctx: Context, input: z.infer<typeof eventResultStatSchema>) => {
  const query = await ctx.prisma.eventResult.findUnique({ where: { eventSlug_surferSlug: { eventSlug: input.eventSlug, surferSlug: input.surferSlug } }, select: { place: true, points: true, knockedOutBy: true },}) // prettier-ignore
  if (!query) {
    return {
      place: { label: 'Place', value: '-' },
      points: { label: 'Points', value: '-' },
      knockedOutBy: { label: 'Knocked Out By', value: '-' },
    }
  }
  const { place, points, knockedOutBy } = query
  const KOBSurfer = knockedOutBy ? await ctx.prisma.surfer.findUnique({ where: { slug: knockedOutBy.slug }, select: { name: true } }) : undefined
  return {
    place: { label: 'Place', value: querySuffix(place) },
    points: { label: 'Points', value: queryFormat(points) },
    knockedOutBy: { label: 'Knocked Out By', value: KOBSurfer?.name ?? '-' },
  }
}

const eventPlace = async (ctx: Context, input: z.infer<typeof eventResultStatSchema>) => {
  const query = await ctx.prisma.eventResult.findUnique({ where: { eventSlug_surferSlug: { eventSlug: input.eventSlug, surferSlug: input.surferSlug } }, select: { place: true } })
  return { place: querySuffix(query?.place) }
}

const eventPoints = async (ctx: Context, input: z.infer<typeof eventResultStatSchema>) => {
  const query = await ctx.prisma.eventResult.findUnique({ where: { eventSlug_surferSlug: { eventSlug: input.eventSlug, surferSlug: input.surferSlug } }, select: { points: true } })
  return { points: queryFormat(query?.points) }
}

const knockedOutBy = async (ctx: Context, input: z.infer<typeof eventResultStatSchema>) => {
  const query = await ctx.prisma.eventResult.findUnique({ where: { eventSlug_surferSlug: { eventSlug: input.eventSlug, surferSlug: input.surferSlug } }, select: { knockedOutBy: true } })
  const KOBSurfer = query?.knockedOutBy ? await ctx.prisma.surfer.findUnique({ where: { slug: query.knockedOutBy.slug }, select: { name: true } }) : undefined
  return { knockedOutBy: KOBSurfer?.name ?? '-' }
}

// Heats //
const totalHeats = async (ctx: Context, input: z.infer<typeof eventResultStatSchema>) => {
  const query = await ctx.prisma.heatResult.count({ where: { ...heatResultFilter(input), NOT: { heatTotal: null } } })
  return { totalHeats: { label: 'Total Heats', value: query ?? '-' } }
}

const heatWins = async (ctx: Context, input: z.infer<typeof eventResultStatSchema>) => {
  const query = await ctx.prisma.heatResult.count({ where: { ...heatResultFilter(input), heatPlace: 1, NOT: { heatTotal: null } } })
  return { heatWins: { label: 'Heat Wins', value: query ?? '-' } }
}

const heatWinPerc = async (ctx: Context, input: z.infer<typeof eventResultStatSchema>) => {
  const totalHeatsQ = await totalHeats(ctx, input)
  const totalHeatWinsQ = await heatWins(ctx, input)
  if (!totalHeatsQ.totalHeats || !totalHeatWinsQ.heatWins) throw new TRPCError({ code: 'NOT_FOUND' })
  return { heatWinPerc: { label: 'Heat Win %', value: queryPerc(totalHeatWinsQ.heatWins.value, totalHeatsQ.totalHeats.value) } }
}

const avgHeatTotal = async (ctx: Context, input: z.infer<typeof eventResultStatSchema>) => {
  const query = await ctx.prisma.heatResult.aggregate({
    where: { ...heatResultFilter(input), NOT: { heatTotal: null } },
    _avg: { heatTotal: true },
  })
  return { avgHeatTotal: { label: 'Avg. Heat Total', value: queryRound(query._avg.heatTotal) } }
}

const avgHeatTotalDifferential = async (ctx: Context, input: z.infer<typeof eventResultStatSchema>) => {
  const query = await ctx.prisma.heatResult.aggregate({ where: heatResultFilter(input), _avg: { heatDifferential: true } })
  return { avgHeatTotalDifferential: { label: 'Avg. Heat Differential', value: queryDifferential(query._avg.heatDifferential) } }
}

const highestHeatTotal = async (ctx: Context, input: z.infer<typeof eventResultStatSchema>) => {
  const query = await ctx.prisma.heatResult.aggregate({ where: { ...heatResultFilter(input) }, _max: { heatTotal: true } })
  return { highestHeatTotal: { label: 'Highest Heat Total', value: queryRound(query._max.heatTotal) } }
}

const excellentHeats = async (ctx: Context, input: z.infer<typeof eventResultStatSchema>) => {
  const query = await ctx.prisma.heatResult.count({ where: { ...heatResultFilter(input), heatTotal: { gte: 16 } } })
  return { excellentHeats: { label: 'Excellent Heats', value: query ?? '-' } }
}

// Waves //
const totalWaves = async (ctx: Context, input: z.infer<typeof eventResultStatSchema>) => {
  const query = await ctx.prisma.wave.count({ where: waveFilter(input) })
  return { totalWaves: { label: 'Total Waves', value: query ?? '-' } }
}

const avgWaveScore = async (ctx: Context, input: z.infer<typeof eventResultStatSchema>) => {
  const query = await ctx.prisma.wave.aggregate({ where: waveFilter(input), _avg: { waveScore: true } })
  return { avgWaveScore: { label: 'Avg. Wave Score', value: queryRound(query._avg.waveScore) } }
}

const totalCountedWaves = async (ctx: Context, input: z.infer<typeof eventResultStatSchema>) => {
  const query = await ctx.prisma.wave.count({ where: { ...waveFilter(input), countedWave: true } })
  return { totalCountedWaves: { label: 'Total Counted Waves', value: query ?? '-' } }
}

const avgCountedWaveScore = async (ctx: Context, input: z.infer<typeof eventResultStatSchema>) => {
  const query = await ctx.prisma.wave.aggregate({ where: { ...waveFilter(input), countedWave: true }, _avg: { waveScore: true } })
  return { avgCountedWaveScore: { label: 'Avg. Counted Wave Score', value: queryRound(query._avg.waveScore) } }
}

const highestWaveScore = async (ctx: Context, input: z.infer<typeof eventResultStatSchema>) => {
  const query = await ctx.prisma.wave.aggregate({ where: waveFilter(input), _max: { waveScore: true } })
  return { highestWaveScore: { label: 'Highest Wave Score', value: queryRound(query._max.waveScore) } }
}

const totalTens = async (ctx: Context, input: z.infer<typeof eventResultStatSchema>) => {
  const query = await ctx.prisma.wave.count({ where: { ...waveFilter(input), waveScore: 10 } })
  return { totalTens: { label: 'Total Tens', value: query ?? '-' } }
}

const excellentWaves = async (ctx: Context, input: z.infer<typeof eventResultStatSchema>) => {
  const query = await ctx.prisma.wave.count({ where: { ...waveFilter(input), waveScore: { gte: 8 } } })
  return { excellentWaves: { label: 'Excellent Waves', value: query ?? '-' } }
}

// Other
const prizeMoney = async (ctx: Context, input: z.infer<typeof eventResultStatSchema>) => {
  const query = await ctx.prisma.eventResult.aggregate({ where: { surferSlug: input.surferSlug, event: { slug: input.eventSlug } }, _sum: { prizeMoney: true } })
  return { prizeMoney: { label: 'Prize Money', value: queryMoney(query._sum.prizeMoney) } }
}

const totalInterferences = async (ctx: Context, input: z.infer<typeof eventResultStatSchema>) => {
  const query = await ctx.prisma.heatResult.aggregate({where: { ...heatResultFilter(input), OR: [{ interferenceOne: { gte: 1 } }, { interferenceTwo: { gte: 1 } }, { interferenceThree: { gte: 1 } }] }, _sum: { interferenceOne: true, interferenceTwo: true, interferenceThree: true } }) // prettier-ignore
  const totalInt = (query._sum.interferenceOne ? query._sum.interferenceOne : 0) + (query._sum.interferenceTwo ? query._sum.interferenceTwo : 0) + (query._sum.interferenceThree ? query._sum.interferenceThree : 0)
  return { totalInterferences: { label: 'Interferences', value: queryFormat(totalInt) } }
}

// eventResult
// ---------------
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
