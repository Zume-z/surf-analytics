import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { createTRPCRouter, publicProcedure } from '../../trpc'
import { ordinalSuffix } from '@/utils/format/ordinalSuffix'
import { twoDec } from '@/utils/format/roundTwoDec'
import { queryFormat, queryRound, querySuffix } from '@/utils/format/queryFormat'
import { capitalizeFirst } from '@/utils/format/capitalizeFirst'
import { Context } from '@/utils/interfaces'

const heatResultStatSchema = z.object({
  surferSlug: z.string(),
  heatSlug: z.string(),
})

export const heatResultStatRouter = createTRPCRouter({
  getAll: publicProcedure.input(heatResultStatSchema).query(({ ctx, input }) => {
    return getAll(ctx, input)
  }),
  getWaves: publicProcedure.input(heatResultStatSchema).query(({ ctx, input }) => {
    return getWaves(ctx, input)
  }),
})

const getAll = async (ctx: Context, input: z.infer<typeof heatResultStatSchema>) => {
  const query = {
    ...(await heatPlace_heatTotal_heatDifferential(ctx, input)),
    ...(await conditions(ctx, input)),
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

const getWaves = async (ctx: Context, input: z.infer<typeof heatResultStatSchema>) => {
  const query = {
    ...(await heatPlace_heatTotal_heatDifferential(ctx, input)),
    ...(await conditions(ctx, input)),
    ...(await totalWaves(ctx, input)),
    ...(await avgWaveScore(ctx, input)),
    ...(await avgCountedWaveScore(ctx, input)),
    ...(await highestWaveScore(ctx, input)),
    ...(await excellentWaves(ctx, input)),
  }
  if (!query) throw new TRPCError({ code: 'NOT_FOUND' })
  return query
}

// FILTERS
const waveFilter = (input: z.infer<typeof heatResultStatSchema>) => ({ surferSlug: input.surferSlug, heatSlug: input.heatSlug })

const heatPlace_heatTotal_heatDifferential = async (ctx: Context, input: z.infer<typeof heatResultStatSchema>) => {
  const query = await ctx.prisma.heatResult.findUniqueOrThrow({ where: { heatSlug_surferSlug: { heatSlug: input.heatSlug, surferSlug: input.surferSlug } }, select: { heatPlace: true, heatTotal: true, heatDifferential: true }}) // prettier-ignore
  return {
    heatPlace: { label: 'Place', value: querySuffix(query.heatPlace) },
    heatTotal: { label: 'Heat Total', value: queryRound(query.heatTotal) },
    heatDifferential: { label: 'Heat Differential', value: queryRound(query.heatDifferential) },
  }
}

const conditions = async (ctx: Context, input: z.infer<typeof heatResultStatSchema>) => {
  const query = await ctx.prisma.heatResult.findUniqueOrThrow({ where: { heatSlug_surferSlug: { heatSlug: input.heatSlug, surferSlug: input.surferSlug } }, select: { heat: { select: { waveRange: true, windConditions: true, break: { select: { waveType: true, name: true } } } } } }) // prettier-ignore
  const { waveRange,windConditions, break: { waveType, name }} = query.heat // prettier-ignore
  return {
    waveRange: { label: 'Wave Range', value: waveRange || '-' },
    windConditions: { label: 'Wind Conditions', value: windConditions || '-' },
    waveType: { label: 'Wave Type', value: waveType ? capitalizeFirst(waveType) : '-' },
    breakName: { label: 'Break', value: name || '-' },
  }
}

const totalWaves = async (ctx: Context, input: z.infer<typeof heatResultStatSchema>) => {
  const query = await ctx.prisma.wave.count({ where: waveFilter(input) })
  return { totalWaves: { label: 'Total Waves', value: queryFormat(query) } }
}

const avgWaveScore = async (ctx: Context, input: z.infer<typeof heatResultStatSchema>) => {
  const query = await ctx.prisma.wave.aggregate({ where: waveFilter(input), _avg: { waveScore: true } })
  return { avgWaveScore: { label: 'Avg. Wave Score', value: queryRound(query._avg.waveScore) } }
}

const totalCountedWaves = async (ctx: Context, input: z.infer<typeof heatResultStatSchema>) => {
  const query = await ctx.prisma.wave.count({ where: { ...waveFilter(input), countedWave: true } })
  return { totalCountedWaves: { label: 'Total Counted Waves', value: queryFormat(query) } }
}

const avgCountedWaveScore = async (ctx: Context, input: z.infer<typeof heatResultStatSchema>) => {
  const query = await ctx.prisma.wave.aggregate({ where: { ...waveFilter(input), countedWave: true }, _avg: { waveScore: true } })
  return { avgCountedWaveScore: { label: 'Avg. Counted Wave Score', value: queryRound(query._avg.waveScore) } }
}

const highestWaveScore = async (ctx: Context, input: z.infer<typeof heatResultStatSchema>) => {
  const query = await ctx.prisma.wave.aggregate({ where: waveFilter(input), _max: { waveScore: true } })
  return { highestWaveScore: { label: 'Highest Wave Score', value: queryRound(query._max.waveScore) } }
}

const excellentWaves = async (ctx: Context, input: z.infer<typeof heatResultStatSchema>) => {
  const query = await ctx.prisma.wave.count({ where: { ...waveFilter(input), waveScore: { gte: 8 } } })
  return { excellentWaves: { label: 'Excellent Waves', value: queryFormat(query) } }
}

// heatResult
// ---------------
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
