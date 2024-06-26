import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { createTRPCRouter, publicProcedure } from '../trpc'
import { GENDER, SORTDIR, STATUS } from '@/utils/interfaces'

export const HeatSchema = z.object({
  heatSlug: z.string().optional(),
  eventSlug: z.string().optional(),
  year: z.number().min(1900).max(2100).optional(),
  tourSlug: z.string().optional(),
  countrySlug: z.string().optional(),
  surferSlug: z.string().optional(),
  gender: z.enum(GENDER).optional(),
  breakSlug: z.string().optional(),
  heatRound: z.string().optional(),
  heatNumber: z.number().optional(),
  heatStatus: z.enum(STATUS).optional(),

  // Sort
  sortRoundNumber: z.enum(SORTDIR).optional(),
  sortHeatNumber: z.enum(SORTDIR).optional(),

  // Pagination
  itemsPerPage: z.number().min(1).max(100).optional(),
  offset: z.number().optional(),

  // Matchup
  surferASlug: z.string().optional(),
  surferBSlug: z.string().optional(),
  matchupFilter: z.boolean().optional(),
})

export const heatRouter = createTRPCRouter({
  getMany: publicProcedure.input(HeatSchema).query(({ ctx, input }) => {
    const orderBy = input.sortRoundNumber && input.sortHeatNumber ? [{ roundNumber: input.sortRoundNumber }, { heatNumber: input.sortHeatNumber }] : { roundNumber: input.sortRoundNumber, heatNumber: input.sortHeatNumber }
    const heat = ctx.prisma.heat.findMany({
      where: {
        slug: input.heatSlug,
        event: {
          slug: input.eventSlug,
          country: { slug: input.countrySlug },
          tour: { slug: input.tourSlug, year: input.year },
        },
        heatResults: { some: { surfer: { slug: input.surferSlug, gender: input.gender } } },
        break: { slug: input.breakSlug },
        heatRound: input.heatRound,
        heatNumber: input.heatNumber,
        heatStatus: input.heatStatus,
      },
      select: {
        slug: true,
        heatRound: true,
        heatNumber: true,
        heatStatus: true,
        heatDate: true,
        event: { select: { name: true, year: true, heats: { select: { heatRound: true }, orderBy: { roundNumber: 'asc' } } } },
        heatResults: {
          orderBy: { heatPlace: 'asc' },
          select: {
            heatPlace: true,
            heatTotal: true,
            scoreOne: true,
            scoreTwo: true,
            interferenceOne: true,
            interferenceThree: true,
            interferenceTwo: true,
            jerseyColor: true,
            surfer: { select: { name: true, profileImage: true, country: { select: { flagLink: true, name: true } } } },
          },
        },
      },
      orderBy: orderBy,
      take: input?.itemsPerPage,
      skip: input?.offset,
    })
    if (!heat) throw new TRPCError({ code: 'NOT_FOUND' })
    return heat
  }),

  getManyMatchup: publicProcedure.input(HeatSchema).query(({ ctx, input }) => {
    const headToheadOnly = input.matchupFilter && input.surferASlug && input.surferBSlug ? { every: { surferSlug: { in: [input.surferASlug, input.surferBSlug] } } } : undefined
    const heat = ctx.prisma.heat.findMany({
      where: {
        slug: input.heatSlug,
        event: {
          slug: input.eventSlug,
          year: input.year,
          country: { slug: input.countrySlug },
          tour: { slug: input.tourSlug },
          wavePoolEvent: false,
        },
        AND: [{ heatResults: { some: { surfer: { slug: input.surferASlug, gender: input.gender } } } }, { heatResults: { some: { surfer: { slug: input.surferBSlug, gender: input.gender } } } }],
        break: { slug: input.breakSlug },
        heatRound: input.heatRound,
        heatNumber: input.heatNumber,
        heatStatus: input.heatStatus,
        heatResults: headToheadOnly,
      },
      select: {
        slug: true,
        heatRound: true,
        heatNumber: true,
        heatStatus: true,
        heatDate: true,
        eventSlug: true,
        event: { select: { name: true, year: true, heats: { select: { heatRound: true }, orderBy: { roundNumber: 'asc' } } } },
        heatResults: {
          orderBy: { heatPlace: 'asc' },
          select: {
            heatPlace: true,
            heatTotal: true,
            scoreOne: true,
            scoreTwo: true,
            interferenceOne: true,
            interferenceThree: true,
            interferenceTwo: true,
            jerseyColor: true,
            surfer: { select: { name: true, profileImage: true, country: { select: { flagLink: true, name: true } } } },
          },
        },
      },
      orderBy: { event: { year: 'desc' } },
      take: input?.itemsPerPage,
      skip: input?.offset,
    })
    if (!heat) throw new TRPCError({ code: 'NOT_FOUND' })
    return heat
  }),

  getOne: publicProcedure.input(z.object({ heatSlug: z.string().optional() })).query(({ ctx, input }) => {
    const heat = ctx.prisma.heat.findUnique({ where: { slug: input.heatSlug } })
    if (!heat) throw new TRPCError({ code: 'NOT_FOUND' })
    return heat
  }),

  getOneByEvent: publicProcedure.input(z.object({ eventSlug: z.string(), heatRound: z.string(), heatNumber: z.number() })).query(({ ctx, input }) => {
    return ctx.prisma.heat.findFirstOrThrow({
      where: { eventSlug: input.eventSlug, heatRound: input.heatRound, heatNumber: input.heatNumber },
      select: {
        heatRound: true,
        heatNumber: true,
        slug: true,
        event: { select: { name: true, wavePoolEvent: true, tour: { select: { year: true } } } },
        break: { select: { name: true, waveDirection: true, waveType: true } },
        heatResults: {
          orderBy: { heatPlace: 'asc' },
          select: {
            surferSlug: true,
            heatPlace: true,
            heatTotal: true,
            jerseyColor: true,
            interferenceOne: true,
            interferenceTwo: true,
            interferenceThree: true,
            surfer: { select: { name: true, slug: true, profileImage: true, country: { select: { flagLink: true, name: true } } } },
          },
        },
        waves: { orderBy: { waveNumber: 'asc' }, select: { waveNumber: true, waveScore: true, countedWave: true, interference: true, intPenalty: true, waveDirection: true, surferSlug: true } },
      },
    })
  }),
})
