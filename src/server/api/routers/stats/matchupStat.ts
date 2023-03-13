import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { twoDec } from '@/utils/format/roundTwoDec'
import { Context, Status } from '@/utils/interfaces'
import { createTRPCRouter, publicProcedure } from '../../trpc'
import { queryFormat, queryRound } from '@/utils/format/queryFormat'

const matchupStatSchema = z.object({
  surferASlug: z.string(),
  surferBSlug: z.string(),
  matchupFilter: z.boolean().optional(),
})

export const matchupStatRouter = createTRPCRouter({
  getAll: publicProcedure.input(matchupStatSchema).query(({ ctx, input }) => {
    return getAll(ctx, input)
  }),
})

const getAll = async (ctx: Context, input: z.infer<typeof matchupStatSchema>) => {
  const query = [
    await matchupWin(ctx, input),
    await avgHeatTotal(ctx, input),
    await maxHeatTotal(ctx, input),
    await heatTotalDifferential(ctx, input),
    await totalWaves(ctx, input),
    await avgWaveScore(ctx, input),
    await maxWaveScore(ctx, input),
    await avgCountedWaveScore(ctx, input),
    await interferences(ctx, input),
  ]
  if (!query) throw new TRPCError({ code: 'NOT_FOUND' })
  return query
}

const filterHeatResults = (input: z.infer<typeof matchupStatSchema>) => {
  const matchupOnly = input.matchupFilter && input.surferASlug && input.surferBSlug ? { every: { surferSlug: { in: [input.surferASlug, input.surferBSlug] } } } : undefined

  return {
    event: { wavePoolEvent: false },
    heatStatus: 'COMPLETED' as Status,
    AND: [{ heatResults: { some: { surfer: { slug: input.surferASlug } } } }, { heatResults: { some: { surfer: { slug: input.surferBSlug } } } }],
    heatResults: matchupOnly,
  }
}

// QUERYS
const matchupBaseStats = async (ctx: Context, input: z.infer<typeof matchupStatSchema>) => {
  const query = await ctx.prisma.heat.findMany({
    where: filterHeatResults(input),
    include: { heatResults: { include: { beatenBy: true, surfer: true } } },
  })
  const surferAHeatResults = query.map((heat) => heat.heatResults.find((result) => result.surfer.slug === input.surferASlug))
  const surferABeatenBy = surferAHeatResults.map((result) => result?.beatenBy)
  const surferABeatenBySlugs = surferABeatenBy.map((heat) => heat?.map((result) => result.surferBeatenBySlug))
  const surferBWins = surferABeatenBySlugs.filter((heat) => heat?.includes(input.surferBSlug)).length
  const surferBHeatResults = query.map((heat) => heat.heatResults.find((result) => result.surfer.slug === input.surferBSlug))
  const surferBBeatenBy = surferBHeatResults.map((result) => result?.beatenBy)
  const surferBBeatenBySlugs = surferBBeatenBy.map((heat) => heat?.map((result) => result.surferBeatenBySlug))
  const surferAWins = surferBBeatenBySlugs.filter((heat) => heat?.includes(input.surferASlug)).length
  return { surferA: surferAWins, surferB: surferBWins }
}

const matchupWin = async (ctx: Context, input: z.infer<typeof matchupStatSchema>) => {
  const query = await ctx.prisma.heat.findMany({
    where: filterHeatResults(input),
    include: { heatResults: { include: { beatenBy: true } } },
  })
  const surferAHeatResults = query.map((heat) => heat.heatResults.find((result) => result.surferSlug === input.surferASlug))
  const surferABeatenBy = surferAHeatResults.map((result) => result?.beatenBy)
  const surferABeatenBySlugs = surferABeatenBy.map((heat) => heat?.map((result) => result.surferBeatenBySlug))
  const surferBWins = surferABeatenBySlugs.filter((heat) => heat?.includes(input.surferBSlug)).length
  const surferBHeatResults = query.map((heat) => heat.heatResults.find((result) => result.surferSlug === input.surferBSlug))
  const surferBBeatenBy = surferBHeatResults.map((result) => result?.beatenBy)
  const surferBBeatenBySlugs = surferBBeatenBy.map((heat) => heat?.map((result) => result.surferBeatenBySlug))
  const surferAWins = surferBBeatenBySlugs.filter((heat) => heat?.includes(input.surferASlug)).length

  return { label: 'Heat Wins', surferA: queryFormat(surferAWins), surferB: queryFormat(surferBWins) }
}

const avgHeatTotal = async (ctx: Context, input: z.infer<typeof matchupStatSchema>) => {
  const query = await ctx.prisma.heat.findMany({
    where: filterHeatResults(input),
    include: { heatResults: true },
  })
  const surferAHeatResults = query.map((heat) => heat.heatResults.find((result) => result.surferSlug === input.surferASlug))
  const surferAHeatTotals = surferAHeatResults.map((heatResult) => heatResult?.heatTotal).reduce((a: any, b) => a + b, 0)
  const surferAAvgHeatTotal = surferAHeatTotals ? twoDec(surferAHeatTotals / surferAHeatResults.length) : '-'

  const surferBHeatResults = query.map((heat) => heat.heatResults.find((result) => result.surferSlug === input.surferBSlug))
  const surferBHeatTotals = surferBHeatResults.map((heatResult) => heatResult?.heatTotal).reduce((a: any, b) => a + b, 0)
  const surferBAvgHeatTotal = surferBHeatTotals ? twoDec(surferBHeatTotals / surferBHeatResults.length) : '-'

  return { label: 'Avg. Heat Total', surferA: queryRound(surferAAvgHeatTotal), surferB: queryRound(surferBAvgHeatTotal) }
}

const maxHeatTotal = async (ctx: Context, input: z.infer<typeof matchupStatSchema>) => {
  const query = await ctx.prisma.heat.findMany({
    where: filterHeatResults(input),
    include: { heatResults: true },
  })
  const surferAHeatResults = query.map((heat) => heat.heatResults.find((result) => result.surferSlug === input.surferASlug))
  const surferAHeatTotals = surferAHeatResults.map((heatResult) => heatResult?.heatTotal)
  const surferAMaxHeatTotal = surferAHeatTotals ? Math.max(...(surferAHeatTotals as number[])) : '-'
  const surferBHeatResults = query.map((heat) => heat.heatResults.find((result) => result.surferSlug === input.surferBSlug))
  const surferBHeatTotals = surferBHeatResults.map((heatResult) => heatResult?.heatTotal)
  const surferBMaxHeatTotal = surferBHeatTotals ? Math.max(...(surferBHeatTotals as number[])) : '-'
  return { label: 'Max Heat Total', surferA: queryRound(surferAMaxHeatTotal), surferB: queryRound(surferBMaxHeatTotal) }
}

const heatTotalDifferential = async (ctx: Context, input: z.infer<typeof matchupStatSchema>) => {
  const query = await ctx.prisma.heat.findMany({
    where: filterHeatResults(input),
    include: { heatResults: { include: { beatenBy: true } } },
  })
  const surferAHeatResults = query.map((heat) => heat.heatResults.find((result) => result.surferSlug === input.surferASlug))
  const surferAFiltered = surferAHeatResults.map((result) => result?.beatenBy?.filter((result) => result.surferBeatenBySlug === input.surferBSlug))
  const surferAHds = surferAFiltered.map((heat) => heat?.map((result) => result.beatenByDifferential))
  const surferATotalHd = surferAHds.map((heat) => heat?.reduce((a: any, b) => a + b, 0)).reduce((a: any, b) => a + b, 0)

  const surferBHeatResults = query.map((heat) => heat.heatResults.find((result) => result.surferSlug === input.surferBSlug))
  const surferBFiltered = surferBHeatResults.map((result) => result?.beatenBy?.filter((result) => result.surferBeatenBySlug === input.surferASlug))
  const surferBHds = surferBFiltered.map((heat) => heat?.map((result) => result.beatenByDifferential))
  const surferBTotalHd = surferBHds.map((heat) => heat?.reduce((a: any, b) => a + b, 0)).reduce((a: any, b) => a + b, 0)

  let surferAHd = surferATotalHd && twoDec(surferBTotalHd - surferATotalHd)
  let surferBHd = surferBTotalHd && twoDec(surferATotalHd - surferBTotalHd)

  // DELETE LATER
  if (!surferAHd && surferBHd) {
    surferAHd = Math.abs(surferBHd)
  }
  if (!surferBHd && surferAHd) {
    surferBHd = -Math.abs(surferAHd)
  }

  return { label: 'Heat Total Differential', surferA: queryRound(surferAHd), surferB: queryRound(surferBHd) }
}

const totalWaves = async (ctx: Context, input: z.infer<typeof matchupStatSchema>) => {
  const query = await ctx.prisma.heat.findMany({
    where: filterHeatResults(input),
    include: { waves: true },
  })
  const surferAWaves = query.map((heat) => heat.waves.filter((wave) => wave.surferSlug === input.surferASlug))
  const surferAWaveCount = surferAWaves.map((heat) => heat.length).reduce((a: any, b) => a + b, 0)
  const surferBWaves = query.map((heat) => heat.waves.filter((wave) => wave.surferSlug === input.surferBSlug))
  const surferBWaveCount = surferBWaves.map((heat) => heat.length).reduce((a: any, b) => a + b, 0)

  return { label: 'Total Waves', surferA: surferAWaveCount, surferB: surferBWaveCount }
}

const avgWaveScore = async (ctx: Context, input: z.infer<typeof matchupStatSchema>) => {
  const query = await ctx.prisma.heat.findMany({
    where: filterHeatResults(input),
    include: { waves: true },
  })
  const surferAWaveFilter = query.map((heat) => heat.waves.filter((wave) => wave.surferSlug === input.surferASlug))
  const surferAWaveScores = surferAWaveFilter.map((heat) => heat.map((wave) => wave.waveScore))
  const allSurferAWaves = surferAWaveScores.reduce((a: any, b) => a.concat(b), [])
  const surferAAvgWaveScore = allSurferAWaves ? twoDec(allSurferAWaves.reduce((a: number, b: number) => a + b, 0) / allSurferAWaves.length) : '-'

  const surferBWaveFilter = query.map((heat) => heat.waves.filter((wave) => wave.surferSlug === input.surferBSlug))
  const surferBWaveScores = surferBWaveFilter.map((heat) => heat.map((wave) => wave.waveScore))
  const allSurferBWaves = surferBWaveScores.reduce((a: any, b) => a.concat(b), [])
  const surferBAvgWaveScore = allSurferBWaves ? twoDec(allSurferBWaves.reduce((a: number, b: number) => a + b, 0) / allSurferBWaves.length) : '-'

  return { label: 'Avg. Wave Score', surferA: queryFormat(surferAAvgWaveScore), surferB: queryFormat(surferBAvgWaveScore) }
}

const maxWaveScore = async (ctx: Context, input: z.infer<typeof matchupStatSchema>) => {
  const query = await ctx.prisma.heat.findMany({
    where: filterHeatResults(input),
    include: { waves: true },
  })
  const surferAWavesFilter = query.map((heat) => heat.waves.filter((wave) => wave.surferSlug === input.surferASlug))
  const surferAWaveScores = surferAWavesFilter.map((heat) => heat.map((wave) => wave.waveScore))
  const allSurferAWaves = surferAWaveScores.reduce((a: any, b) => a.concat(b), [])
  const surferAMaxWaveScore = allSurferAWaves ? twoDec(Math.max(...allSurferAWaves)) : '-'

  const surferBWavesFilter = query.map((heat) => heat.waves.filter((wave) => wave.surferSlug === input.surferBSlug))
  const surferBWaveScores = surferBWavesFilter.map((heat) => heat.map((wave) => wave.waveScore))
  const allSurferBWaves = surferBWaveScores.reduce((a: any, b) => a.concat(b), [])
  const surferBMaxWaveScore = allSurferBWaves ? twoDec(Math.max(...allSurferBWaves)) : '-'

  return { label: 'Max Wave Score', surferA: queryRound(surferAMaxWaveScore), surferB: queryRound(surferBMaxWaveScore) }
}

const avgCountedWaveScore = async (ctx: Context, input: z.infer<typeof matchupStatSchema>) => {
  const query = await ctx.prisma.heat.findMany({
    where: filterHeatResults(input),
    include: { waves: { where: { countedWave: true } } },
  })

  const surferAWavesFilter = query.map((heat) => heat.waves.filter((wave) => wave.surferSlug === input.surferASlug))
  const surferAWaveScores = surferAWavesFilter.map((heat) => heat.map((wave) => wave.waveScore))
  const allSurferAWaves = surferAWaveScores.reduce((a: any, b) => a.concat(b), [])
  const surferAAvgWaveScore = allSurferAWaves ? twoDec(allSurferAWaves.reduce((a: number, b: number) => a + b, 0) / allSurferAWaves.length) : '-'

  const surferBWavesFilter = query.map((heat) => heat.waves.filter((wave) => wave.surferSlug === input.surferBSlug))
  const surferBWaveScores = surferBWavesFilter.map((heat) => heat.map((wave) => wave.waveScore))
  const allSurferBWaves = surferBWaveScores.reduce((a: any, b) => a.concat(b), [])
  const surferBAvgWaveScore = allSurferBWaves ? twoDec(allSurferBWaves.reduce((a: number, b: number) => a + b, 0) / allSurferBWaves.length) : '-'

  return { label: 'Avg. Counted Wave Score', surferA: queryRound(surferAAvgWaveScore), surferB: queryRound(surferBAvgWaveScore) }
}

const interferences = async (ctx: Context, input: z.infer<typeof matchupStatSchema>) => {
  const query = await ctx.prisma.heat.findMany({
    where: filterHeatResults(input),
    include: { heatResults: { where: { OR: [{ interferenceOne: { gte: 1 } }, { interferenceTwo: { gte: 1 } }, { interferenceThree: { gte: 1 } }] } } },
  })

  const surferAHeatResults = query.map((heat) => heat.heatResults.filter((heatResult) => heatResult.surferSlug === input.surferASlug))
  const surferAInterferences = surferAHeatResults.map((heat) =>
    heat.map((heatResult) => (heatResult.interferenceOne ? heatResult.interferenceOne : 0) + (heatResult.interferenceTwo ? heatResult.interferenceTwo : 0) + (heatResult.interferenceThree ? heatResult.interferenceThree : 0)),
  )
  const surferATotalInterferences = surferAInterferences.map((heat) => heat.reduce((a: any, b) => a + b, 0)).reduce((a: any, b) => a + b, 0)

  const surferBHeatResults = query.map((heat) => heat.heatResults.filter((heatResult) => heatResult.surferSlug === input.surferBSlug))
  const surferBInterferences = surferBHeatResults.map((heat) =>
    heat.map((heatResult) => (heatResult.interferenceOne ? heatResult.interferenceOne : 0) + (heatResult.interferenceTwo ? heatResult.interferenceTwo : 0) + (heatResult.interferenceThree ? heatResult.interferenceThree : 0)),
  )
  const surferBTotalInterferences = surferBInterferences.map((heat) => heat.reduce((a: any, b) => a + b, 0)).reduce((a: any, b) => a + b, 0)

  return { label: 'Interferences', surferA: queryFormat(surferATotalInterferences), surferB: queryFormat(surferBTotalInterferences) }
}
// Direct Compare Stats
// ---------------------
// Heat Wins
// Avg. Heat Total
// Max. Heat Total
// Heat Total Differential
// Total Waves
// Avg. Wave Score
// Max. Wave Score
// Avg. Counted Wave Score
// Interferences

// Compare All Stats
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
