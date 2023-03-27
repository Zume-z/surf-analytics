import { z } from 'zod'
import { GENDER } from '@/utils/interfaces'
import { TRPCError } from '@trpc/server'
import { twoDec } from '@/utils/format/roundTwoDec'
import { queryDifferential, queryFormat } from '@/utils/format/queryFormat'
import { getMoneyFormat } from '@/utils/format/moneyFormat'
import { createTRPCRouter, publicProcedure } from '../../trpc'
import { Prisma, PrismaClient, Status } from '@prisma/client'
import { Session } from 'next-auth'
import { Context } from '@/utils/interfaces'

const countryStatSchema = z.object({
  countrySlug: z.string().optional(),
  gender: z.enum(GENDER).optional(),
  year: z.number().min(1900).max(2100).optional(),
})

export const countryEventStatRouter = createTRPCRouter({
  getAll: publicProcedure.input(countryStatSchema).query(({ ctx, input }) => {
    return getAll(ctx, input)
  }),
  getCountryEvents: publicProcedure.input(countryStatSchema).query(({ ctx, input }) => {
    return getCountryEvents(ctx, input)
  }),
})

const getAll = async (ctx: { session: Session | null; prisma: PrismaClient<Prisma.PrismaClientOptions, never, Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined> }, input: z.infer<typeof countryStatSchema>) => {
  const query = {
    ...(await totalEvents(ctx, input)),
    ...(await avgWaveRange(ctx, input)),
    ...(await avgWindConditions(ctx, input)),
    ...(await totalHeats(ctx, input)),
    ...(await avgHeatTotal(ctx, input)),
    ...(await highestHeatTotal(ctx, input)),
    ...(await avgHeatTotalDifferential(ctx, input)),
    ...(await totalTens(ctx, input)),
    ...(await excellentHeats(ctx, input)),
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
const getCountryEvents = async (ctx: Context, input: z.infer<typeof countryStatSchema>) => {
  const query = {
    ...(await totalEvents(ctx, input)),
    ...(await avgWaveRange(ctx, input)),
    ...(await avgWindConditions(ctx, input)),
    ...(await totalHeats(ctx, input)),
    ...(await avgHeatTotal(ctx, input)),
    ...(await highestHeatTotal(ctx, input)),
    ...(await excellentHeats(ctx, input)),
    ...(await totalWaves(ctx, input)),
    ...(await avgWaveScore(ctx, input)),
    ...(await avgCountedWaveScore(ctx, input)),
    ...(await highestWaveScore(ctx, input)),
    ...(await excellentWaves(ctx, input)),
    ...(await prizeMoney(ctx, input)),
  }
  if (!query) throw new TRPCError({ code: 'NOT_FOUND' })
  return query
}

// Filters
const eventFilter = (input: z.infer<typeof countryStatSchema>) => ({ eventStatus: 'COMPLETED' as Status, countrySlug: input.countrySlug, tour: { year: input.year, gender: input.gender } })

// COUNTRY EVENT STATS QUERYS //
const totalEvents = async (ctx: Context, input: z.infer<typeof countryStatSchema>) => {
  const query = await ctx.prisma.event.count({ where: eventFilter(input) })
  const queryFormat = query !== undefined ? query.toLocaleString('en-US') : '-'
  return { totalEvents: { label: 'Total Events', value: queryFormat } }
}

const avgWaveRange = async (ctx: Context, input: z.infer<typeof countryStatSchema>) => {
  const query = await ctx.prisma.heat.aggregate({ where: { event: eventFilter(input) }, _avg: { avgWaveHeight: true } })
  return { avgWaveRange: { label: 'Avg. Wave Size', value: queryFormat(query._avg.avgWaveHeight && Math.round(query._avg.avgWaveHeight) + "'") ?? '-' } }
}

const avgWindConditions = async (ctx: Context, input: z.infer<typeof countryStatSchema>) => {
  const query = await ctx.prisma.heat.groupBy({ by: ['windConditions'], where: { event: eventFilter(input), NOT: { windConditions: '-' } }, _count: { windConditions: true } })
  const averageWindConditions = query.reduce((a, b) => (a._count.windConditions > b._count.windConditions ? a : b))
  return { avgWindConditions: { label: 'Avg. Wind Conditions', value: averageWindConditions.windConditions ?? '-' } }
}

const totalHeats = async (ctx: Context, input: z.infer<typeof countryStatSchema>) => {
  const query = await ctx.prisma.heat.count({ where: { heatStatus: 'COMPLETED', event: eventFilter(input) } })
  const queryFormat = query !== undefined ? query.toLocaleString('en-US') : '-'
  return { totalHeats: { label: 'Total Heats', value: queryFormat } }
}

const avgHeatTotal = async (ctx: Context, input: z.infer<typeof countryStatSchema>) => {
  const query = await ctx.prisma.heatResult.aggregate({ where: { heat: { heatStatus: 'COMPLETED', event: eventFilter(input) } }, _avg: { heatTotal: true } })
  const queryRound = query._avg.heatTotal !== undefined ? twoDec(query._avg.heatTotal) : '-'
  return { avgHeatTotal: { label: 'Avg. Heat Total', value: queryRound } }
}

const highestHeatTotal = async (ctx: Context, input: z.infer<typeof countryStatSchema>) => {
  const query = await ctx.prisma.heatResult.aggregate({ where: { heat: { heatStatus: 'COMPLETED', event: eventFilter(input) } }, _max: { heatTotal: true } })
  const queryRound = query._max.heatTotal !== undefined ? twoDec(query._max.heatTotal) : '-'
  return { highestHeatTotal: { label: 'Highest Heat Total', value: queryRound } }
}

// const totalHeatDifferential = async (ctx: Context, input: z.infer<typeof countryStatSchema>) => {
//   const query = await ctx.prisma.heat.aggregate({ where: { heatStatus: 'COMPLETED', event: eventFilter(input) }, _sum: { heatDifferential: true } })
//   const queryRound = query._sum.heatDifferential !== undefined ? twoDec(query._sum.heatDifferential) : '-'
//   return { totalHeatDifferential: { label: 'Total Heat Differential', value: queryRound } }
// }

const avgHeatTotalDifferential = async (ctx: Context, input: z.infer<typeof countryStatSchema>) => {
  const query = await ctx.prisma.heat.aggregate({ where: { heatStatus: 'COMPLETED', event: eventFilter(input) }, _avg: { heatDifferential: true } })
  const queryRound = query._avg.heatDifferential !== undefined ? twoDec(query._avg.heatDifferential) : '-'
  return { avgHeatTotalDifferential: { label: 'Avg. Heat Differential', value: queryDifferential(query._avg.heatDifferential) } }
}

const excellentHeats = async (ctx: Context, input: z.infer<typeof countryStatSchema>) => {
  const query = await ctx.prisma.heatResult.count({ where: { heat: { heatStatus: 'COMPLETED', event: eventFilter(input) }, heatTotal: { gte: 16 } } })
  const queryFormat = query !== undefined ? query.toLocaleString('en-US') : '-'
  return { excellentHeats: { label: 'Excellent Heats', value: queryFormat } }
}

const totalWaves = async (ctx: Context, input: z.infer<typeof countryStatSchema>) => {
  const query = await ctx.prisma.wave.count({ where: { heat: { event: eventFilter(input) } } })
  const queryFormat = query !== undefined ? query.toLocaleString('en-US') : '-'
  return { totalWaves: { label: 'Total Waves', value: queryFormat } }
}

const avgWaveScore = async (ctx: Context, input: z.infer<typeof countryStatSchema>) => {
  const query = await ctx.prisma.wave.aggregate({ where: { heat: { event: eventFilter(input) } }, _avg: { waveScore: true } })
  const queryRound = query._avg.waveScore !== undefined ? twoDec(query._avg.waveScore) : '-'
  return { avgWaveScore: { label: 'Avg. Wave Score', value: queryRound } }
}

const totalCountedWaves = async (ctx: Context, input: z.infer<typeof countryStatSchema>) => {
  const query = await ctx.prisma.wave.count({ where: { countedWave: true, heat: { event: eventFilter(input) } } })
  const queryFormat = query !== undefined ? query.toLocaleString('en-US') : '-'
  return { totalCountedWaves: { label: 'Counted Waves', value: queryFormat } }
}

const avgCountedWaveScore = async (ctx: Context, input: z.infer<typeof countryStatSchema>) => {
  const query = await ctx.prisma.wave.aggregate({ where: { countedWave: true, heat: { event: eventFilter(input) } }, _avg: { waveScore: true } })
  const queryRound = query._avg.waveScore !== undefined ? twoDec(query._avg.waveScore) : '-'
  return { avgCountedWaveScore: { label: 'Avg. Counted Wave Score', value: queryRound } }
}

const highestWaveScore = async (ctx: Context, input: z.infer<typeof countryStatSchema>) => {
  const query = await ctx.prisma.wave.aggregate({ where: { heat: { event: eventFilter(input) } }, _max: { waveScore: true } })
  const queryRound = query._max.waveScore !== undefined ? twoDec(query._max.waveScore) : '-'
  return { highestWaveScore: { label: 'Highest Wave Score', value: queryRound } }
}

const totalTens = async (ctx: Context, input: z.infer<typeof countryStatSchema>) => {
  const query = await ctx.prisma.wave.count({ where: { heat: { event: eventFilter(input) }, waveScore: { gte: 10 } } })
  return { totalTens: { label: 'Ten Point Waves', value: queryFormat(query) } }
}

const excellentWaves = async (ctx: Context, input: z.infer<typeof countryStatSchema>) => {
  const query = await ctx.prisma.wave.count({ where: { heat: { event: eventFilter(input) }, waveScore: { gte: 8 } } })
  const queryFormat = query !== undefined ? query.toLocaleString('en-US') : '-'
  return { excellentWaves: { label: 'Excellent Waves', value: queryFormat } }
}

const prizeMoney = async (ctx: Context, input: z.infer<typeof countryStatSchema>) => {
  const query = await ctx.prisma.eventResult.aggregate({ where: { event: eventFilter(input) }, _sum: { prizeMoney: true } })
  const prizeMoney = query._sum.prizeMoney !== undefined ? getMoneyFormat(query._sum.prizeMoney) : '-'
  return { prizeMoney: { label: 'Total Prize Money', value: prizeMoney } }
}

const totalInterferences = async (ctx: Context, input: z.infer<typeof countryStatSchema>) => {
  const query = await ctx.prisma.heatResult.aggregate({ where: { heat: { event: eventFilter(input) }, OR: [{ interferenceOne: { gte: 1 } }, { interferenceTwo: { gte: 1 } }, { interferenceThree: { gte: 1 } }] }, _sum: { interferenceOne: true, interferenceTwo: true, interferenceThree: true } }) //prettier-ignore
  const totalInt = (query._sum.interferenceOne ? query._sum.interferenceOne : 0) + (query._sum.interferenceTwo ? query._sum.interferenceTwo : 0) + (query._sum.interferenceThree ? query._sum.interferenceThree : 0)
  return { totalInterferences: { label: 'Interferences', value: queryFormat(totalInt) } }
}

// Country Events
// ---------------
//   Total Events
//   Total Heats
//   Average Heat Total
//   Avg.Total Differential
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

// Avg.Wave Range
// Avg.Wave Height
