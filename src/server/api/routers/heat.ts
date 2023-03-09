import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { createTRPCRouter, publicProcedure } from '../trpc'
import { GENDER, SORTDIR, STATUS } from '@/utils/enums'

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

  // Head to Head
  surferASlug: z.string().optional(),
  surferBSlug: z.string().optional(),
})

export const heatRouter = createTRPCRouter({
  getMany: publicProcedure.input(HeatSchema).query(({ ctx, input }) => {
    const orderBy = input.sortRoundNumber && input.sortHeatNumber ? [{ roundNumber: input.sortRoundNumber }, { heatNumber: input.sortHeatNumber }] : { roundNumber: input.sortRoundNumber, heatNumber: input.sortHeatNumber }

    const heat = ctx.prisma.heat.findMany({
      where: {
        slug: input.heatSlug,
        event: {
          slug: input.eventSlug,
          year: input.year,
          country: { slug: input.countrySlug },
          tour: { slug: input.tourSlug },
        },
        heatResults: { some: { surfer: { slug: input.surferSlug, gender: input.gender } } },
        break: { slug: input.breakSlug },
        heatRound: input.heatRound,
        heatNumber: input.heatNumber,
        heatStatus: input.heatStatus,
      },
      include: {
        event: { select: { name: true, year: true, heats: { select: { heatRound: true }, orderBy: { roundNumber: 'asc' } } } },

        heatResults: { orderBy: { heatPlace: 'asc' }, include: { surfer: { include: { country: true } } } },
      },
      orderBy: orderBy,
      take: input?.itemsPerPage,
      skip: input?.offset,
    })
    if (!heat) throw new TRPCError({ code: 'NOT_FOUND' })
    return heat
  }),

  getManyHeadToHead: publicProcedure.input(HeatSchema).query(({ ctx, input }) => {
    

    // Filter only heats with both surfers
    // heatResults: {every: { surferSlug: { in:  ['kelly-slater', 'kanoa-igarashi']} } },

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
      },
      include: {
        event: { select: { name: true, year: true, heats: { select: { heatRound: true }, orderBy: { roundNumber: 'asc' } } } },
        heatResults: { orderBy: { heatPlace: 'asc' }, include: { surfer: { include: { country: true } } } },
      },
      orderBy: {event: {year: 'desc'}},
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
      include: {
        event: true,
        break: true,
        heatResults: { orderBy: { heatPlace: 'asc' }, include: { surfer: { include: { country: true } } } },
        waves: { orderBy: { waveNumber: 'asc' }, include: { surfer: { include: { country: true } } } },
      },
    })
  }),
})
