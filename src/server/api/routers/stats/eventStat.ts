import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { twoDec } from '@/utils/format/roundTwoDec'
import { getMoneyFormat } from '@/utils/format/moneyFormat'
import { createTRPCRouter, publicProcedure } from '../../trpc'
import { queryFormat, queryMoney, queryRound } from '@/utils/format/queryFormat'

const eventStatSchema = z.object({
  eventSlug: z.string(),
})

export const eventStatRouter = createTRPCRouter({
  getAll: publicProcedure.input(eventStatSchema).query(({ ctx, input }) => {
    return getAll(ctx, input)
  }),
  getResult: publicProcedure.input(eventStatSchema).query(({ ctx, input }) => {
    return getResult(ctx, input)
  }),
})

const getAll = async (ctx: any, input: z.infer<typeof eventStatSchema>) => {
  const query = {
    ...(await totalHeats(ctx, input)),
    ...(await avgHeatTotal(ctx, input)),
    ...(await avgHeatTotalDifferential(ctx, input)),
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

const getResult = async (ctx: any, input: z.infer<typeof eventStatSchema>) => {
  const query = {
    ...(await eventBreaks(ctx, input)),
    ...(await avgWaveRange(ctx, input)),
    ...(await avgWindConditions(ctx, input)),
    ...(await totalHeats(ctx, input)),
    ...(await avgHeatTotal(ctx, input)),
    ...(await highestHeatTotal(ctx, input)),
    ...(await excellentHeats(ctx, input)),
    ...(await totalWaves(ctx, input)),
    ...(await avgWaveScore(ctx, input)),
    ...(await totalCountedWaves(ctx, input)),
    ...(await avgCountedWaveScore(ctx, input)),
    ...(await excellentWaves(ctx, input)),
    ...(await prizeMoney(ctx, input)),
  }
  if (!query) throw new TRPCError({ code: 'NOT_FOUND' })
  return query
}

// FILTERS
const heatResultFilter = (input: z.infer<typeof eventStatSchema>) => ({ heat: { eventSlug: input.eventSlug, heatStatus: 'COMPLETED' } })

const avgWaveRange = async (ctx: any, input: z.infer<typeof eventStatSchema>) => {
  const query = await ctx.prisma.heat.aggregate({ where: { eventSlug: input.eventSlug }, _avg: { avgWaveHeight: true } })
  return { avgWaveRange: { label: 'Avg. Wave Size', value: queryFormat(Math.round(query._avg.avgWaveHeight) + "'") ?? '-' } }
}

const avgWindConditions = async (ctx: any, input: z.infer<typeof eventStatSchema>) => {
  const query = await ctx.prisma.heat.groupBy({ by: ['windConditions'], where: { eventSlug: input.eventSlug }, select: { _count: { select: { windConditions: true } } } })
  const averageWindConditions = query.reduce((a: { _count: { windConditions: number } }, b: { _count: { windConditions: number } }) => (a._count.windConditions > b._count.windConditions ? a : b))
  return { avgWindConditions: { label: 'Avg. Wind Conditions', value: averageWindConditions.windConditions ?? '-' } }
}

const eventBreaks = async (ctx: any, input: z.infer<typeof eventStatSchema>) => {
  const query = await ctx.prisma.heat.findMany({ where: { eventSlug: input.eventSlug }, select: { break: { select: { name: true } } }, distinct: ['breakSlug'] })
  const breaks = query.map((b: { break: { name: string } }) => b.break.name)
  const breaksString = breaks.join(', ')
  return { eventBreaks: { label: breaks.length > 1 ? 'Breaks' : 'Break', value: breaksString ?? '-' } }
}

const totalHeats = async (ctx: any, input: z.infer<typeof eventStatSchema>) => {
  const query = await ctx.prisma.heat.count({ where: { eventSlug: input.eventSlug, heatStatus: 'COMPLETED' } })
  return { totalHeats: { label: 'Total Heats', value: queryFormat(query) } }
}

const avgHeatTotal = async (ctx: any, input: z.infer<typeof eventStatSchema>) => {
  const query = await ctx.prisma.heatResult.aggregate({ where: heatResultFilter(input), _avg: { heatTotal: true } })
  return { avgHeatTotal: { label: 'Avg. Heat Total', value: queryRound(query._avg.heatTotal) } }
}

const highestHeatTotal = async (ctx: any, input: z.infer<typeof eventStatSchema>) => {
  const query = await ctx.prisma.heatResult.aggregate({ where: heatResultFilter(input), _max: { heatTotal: true } })
  return { highestHeatTotal: { label: 'Highest Heat Total', value: queryRound(query._max.heatTotal) } }
}

const avgHeatTotalDifferential = async (ctx: any, input: z.infer<typeof eventStatSchema>) => {
  const query = await ctx.prisma.heatResult.aggregate({ where: {...heatResultFilter(input), heatPlace: 1 }, _avg: { heatDifferential: true } })
  return { avgHeatTotalDifferential: { label: 'Avg. Heat Total Differential', value: queryRound(query._avg.heatDifferential) } }
}

const excellentHeats = async (ctx: any, input: z.infer<typeof eventStatSchema>) => {
  const query = await ctx.prisma.heatResult.count({ where: { ...heatResultFilter(input), heatTotal: { gte: 16 } } })
  return { excellentHeats: { label: 'Excellent Heats', value: queryFormat(query) } }
}

const totalWaves = async (ctx: any, input: z.infer<typeof eventStatSchema>) => {
  const query = await ctx.prisma.wave.count({ where: { heat: { eventSlug: input.eventSlug } } })
  return { totalWaves: { label: 'Total Waves', value: queryFormat(query) } }
}

const avgWaveScore = async (ctx: any, input: z.infer<typeof eventStatSchema>) => {
  const query = await ctx.prisma.wave.aggregate({ where: { heat: { eventSlug: input.eventSlug } }, _avg: { waveScore: true } })
  return { avgWaveScore: { label: 'Avg. Wave Score', value: queryRound(query._avg.waveScore) } }
}

const totalCountedWaves = async (ctx: any, input: z.infer<typeof eventStatSchema>) => {
  const query = await ctx.prisma.wave.count({ where: { countedWave: true, heat: { eventSlug: input.eventSlug } } })
  return { totalCountedWaves: { label: 'Counted Waves', value: queryFormat(query) } }
}

const avgCountedWaveScore = async (ctx: any, input: z.infer<typeof eventStatSchema>) => {
  const query = await ctx.prisma.wave.aggregate({ where: { countedWave: true, heat: { eventSlug: input.eventSlug } }, _avg: { waveScore: true } })
  return { avgCountedWaveScore: { label: 'Avg. Counted Wave Score', value: queryRound(query._avg.waveScore) } }
}

const highestWaveScore = async (ctx: any, input: z.infer<typeof eventStatSchema>) => {
  const query = await ctx.prisma.wave.aggregate({ where: { heat: { eventSlug: input.eventSlug } }, _max: { waveScore: true } })
  return { highestWaveScore: { label: 'Highest Wave Score', value: queryRound(query._max.waveScore) } }
}

const excellentWaves = async (ctx: any, input: z.infer<typeof eventStatSchema>) => {
  const query = await ctx.prisma.wave.count({ where: { heat: { eventSlug: input.eventSlug }, waveScore: { gte: 8 } } })
  return { excellentWaves: { label: 'Excellent Waves', value: queryFormat(query) } }
}

const prizeMoney = async (ctx: any, input: z.infer<typeof eventStatSchema>) => {
  const query = await ctx.prisma.eventResult.aggregate({ where: { eventSlug: input.eventSlug }, _sum: { prizeMoney: true } })
  return { prizeMoney: { label: 'Event Prize Money', value: queryMoney(query._sum.prizeMoney) } }
}

// Conditions
// ---------------
// Avg.wave height
// Avg.wind

// event
// ---------------
//   Total Heats
//   Average Heat Total
//   Avg.Total Differential
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
