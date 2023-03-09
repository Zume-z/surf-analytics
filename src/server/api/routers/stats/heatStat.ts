import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { createTRPCRouter, publicProcedure } from '../../trpc'
import { queryFormat, queryRound } from '@/utils/format/queryFormat'
import { capitalizeFirst } from '@/utils/format/capitalizeFirst'
import { Context } from '@/utils/interfaces'

const heatStatSchema = z.object({
  heatSlug: z.string(),
})

export const heatStatRouter = createTRPCRouter({
  getAll: publicProcedure.input(heatStatSchema).query(({ ctx, input }) => {
    return getAll(ctx, input)
  }),
  getWaves: publicProcedure.input(heatStatSchema).query(({ ctx, input }) => {
    return getWaves(ctx, input)
  }),
})

const getAll = async (ctx: Context, input: z.infer<typeof heatStatSchema>) => {
  const query = {
    ...(await conditions(ctx, input)),
    ...(await avgHeatTotal(ctx, input)),
    ...(await heatDifferential(ctx, input)),
    ...(await combinedHeatTotal(ctx, input)),
    ...(await totalWaves(ctx, input)),
    ...(await avgWaveScore(ctx, input)),
    ...(await totalCountedWaves(ctx, input)),
    ...(await avgCountedWaveScore(ctx, input)),
    ...(await highestWaveScore(ctx, input)),
    ...(await excellentWaves(ctx, input)),
  }
  if (!query) throw new TRPCError({ code: 'NOT_FOUND' })
  return query
}

const getWaves = async (ctx: Context, input: z.infer<typeof heatStatSchema>) => {
  const query = {
    ...(await conditions(ctx, input)),
    ...(await combinedHeatTotal(ctx, input)),
    ...(await totalWaves(ctx, input)),
    ...(await avgHeatTotal(ctx, input)),
    ...(await heatDifferential(ctx, input)),
    ...(await avgWaveScore(ctx, input)),
    ...(await avgCountedWaveScore(ctx, input)),
    ...(await highestWaveScore(ctx, input)),
    ...(await excellentWaves(ctx, input)),
  }
  if (!query) throw new TRPCError({ code: 'NOT_FOUND' })
  return query
}

const conditions = async (ctx: Context, input: z.infer<typeof heatStatSchema>) => {
  const query = await ctx.prisma.heat.findUniqueOrThrow({ where: { slug: input.heatSlug }, select: { waveRange: true, windConditions: true, break: { select: { waveType: true, name: true } } } }) // prettier-ignore
  const { waveRange,windConditions, break: { waveType, name }} = query // prettier-ignore
  return {
    waveRange: { label: 'Wave Range', value: waveRange || '-' },
    windConditions: { label: 'Wind Conditions', value: windConditions || '-' },
    waveType: { label: 'Wave Type', value: waveType ? capitalizeFirst(waveType) : '-' },
    breakName: { label: 'Break', value: name || '-' },
  }
}

const combinedHeatTotal = async (ctx: Context, input: z.infer<typeof heatStatSchema>) => {
  const query = await ctx.prisma.heatResult.aggregate({ where: { heatSlug: input.heatSlug }, _sum: { heatTotal: true } })
  return { combinedHeatTotal: { label: 'Combined Heat Total', value: queryRound(query._sum.heatTotal) } }
}

const avgHeatTotal = async (ctx: Context, input: z.infer<typeof heatStatSchema>) => {
  const query = await ctx.prisma.heatResult.aggregate({ where: { heatSlug: input.heatSlug }, _avg: { heatTotal: true } })
  return { avgHeatTotal: { label: 'Avg. Heat Total', value: queryRound(query._avg.heatTotal) } }
}

const heatDifferential = async (ctx: Context, input: z.infer<typeof heatStatSchema>) => {
  const query = await ctx.prisma.heat.findUnique({ where: { slug: input.heatSlug } })
  return { heatDifferential: { label: 'Heat Total Differential', value: queryRound(query && query.heatDifferential) } }
}

const totalWaves = async (ctx: Context, input: z.infer<typeof heatStatSchema>) => {
  const query = await ctx.prisma.wave.count({ where: { heatSlug: input.heatSlug } })
  return { totalWaves: { label: 'Total Waves', value: queryFormat(query) } }
}

const avgWaveScore = async (ctx: Context, input: z.infer<typeof heatStatSchema>) => {
  const query = await ctx.prisma.wave.aggregate({ where: { heatSlug: input.heatSlug }, _avg: { waveScore: true } })
  return { avgWaveScore: { label: 'Avg. Wave Score', value: queryRound(query._avg.waveScore) } }
}

const totalCountedWaves = async (ctx: Context, input: z.infer<typeof heatStatSchema>) => {
  const query = await ctx.prisma.wave.count({ where: { heatSlug: input.heatSlug, countedWave: true } })
  return { totalCountedWaves: { label: 'Total Counted Waves', value: queryFormat(query) } }
}

const avgCountedWaveScore = async (ctx: Context, input: z.infer<typeof heatStatSchema>) => {
  const query = await ctx.prisma.wave.aggregate({ where: { heatSlug: input.heatSlug, countedWave: true }, _avg: { waveScore: true } })
  return { avgCountedWaveScore: { label: 'Avg. Counted Wave Score', value: queryRound(query._avg.waveScore) } }
}

const highestWaveScore = async (ctx: Context, input: z.infer<typeof heatStatSchema>) => {
  const query = await ctx.prisma.wave.aggregate({ where: { heatSlug: input.heatSlug }, _max: { waveScore: true } })
  return { highestWaveScore: { label: 'Highest Wave Score', value: queryRound(query._max.waveScore) } }
}

const excellentWaves = async (ctx: Context, input: z.infer<typeof heatStatSchema>) => {
  const query = await ctx.prisma.wave.count({ where: { heatSlug: input.heatSlug, waveScore: { gte: 8 } } })
  return { excellentWaves: { label: 'Excellent Waves', value: queryFormat(query) } }
}

// heat
// ---------------
// conditions
//   Place
//   Heat Total
//   Heat Total Differential
//   Total Waves
//   Average Wave Score
//   Total Counted Waves
//   Avgerage Counted Wave Score
//   Highest Wave Score
//   Excellent Waves
//   Boards Broken
