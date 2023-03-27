import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { createTRPCRouter, publicProcedure } from '../trpc'
import { GENDER, SORTDIR } from '@/utils/interfaces'
import { Status } from '@prisma/client'

export const SurferSchema = z.object({
  surferId: z.string().optional(),
  gender: z.enum(GENDER).optional(),
  countrySlug: z.string().optional(),
  year: z.number().optional(),
  heatStatus: z.string().optional(),

  // Sort
  sortName: z.enum(SORTDIR).optional(),

  // Pagination
  itemsPerPage: z.number().min(1).max(100).optional(),
  offset: z.number().optional(),

  // Matchup
  surferSlugFilter: z.string().optional(),
})

export const surferRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx, input }) => {
    return ctx.prisma.surfer.findMany()
  }),

  getMany: publicProcedure.input(SurferSchema).query(({ ctx, input }) => {
    const surfer = ctx.prisma.surfer.findMany({
      where: {
        slug: input.surferId,
        countrySlug: input.countrySlug,
        gender: input?.gender,
        tourResults: { some: { tour: { year: input?.year } } },
      },
      include: {
        country: true,
        tourResults: { where: { tour: { year: input?.year } } },
      },
      orderBy: {
        name: input.sortName,
      },
      take: input?.itemsPerPage,
      skip: input?.offset,
    })
    if (!surfer) throw new TRPCError({ code: 'NOT_FOUND' })
    return surfer
  }),

  getManyCountries: publicProcedure.input(SurferSchema).query(({ ctx, input }) => {
    const surfers = ctx.prisma.surfer.findMany({
      where: {
        gender: input.gender,
        countrySlug: input.countrySlug,
        tourResults: { some: { tour: { year: input?.year } } },
      },
      select: {
        name: true,
        slug: true,
        profileImage: true,
        country: { select: { name: true, slug: true, flagLink: true } },
        eventResults: { where: { AND: [{ place: 1 }, { event: { tour: { year: input.year } } }] }, select: { place: true } },
        tourResults: { where: { AND: [{ worldTitle: true }, { tour: { year: input.year } }] }, select: { worldTitle: true } },
      },
      orderBy: { name: 'asc' },
    })
    if (!surfers) throw new TRPCError({ code: 'NOT_FOUND' })
    return surfers
  }),

  getManyMatchup: publicProcedure.input(SurferSchema).query(({ ctx, input }) => {
    const matchupCountFilter = input.surferSlugFilter ? { where: { heat: { heatStatus: 'COMPLETED' as Status, event: { wavePoolEvent: false }, heatResults: { some: { surferSlug: input.surferSlugFilter } } } } } : { where: { heatSlug: 'xxx' } }
    const surfer = ctx.prisma.surfer.findMany({
      where: {
        heatResults: { some: { heat: { heatStatus: 'COMPLETED', event: { wavePoolEvent: false }, heatResults: { some: { surferSlug: input.surferSlugFilter } } } } },
        tourResults: { some: { tour: { year: { gte: 2010 } } } },
      },
      select: {
        name: true,
        slug: true,
        profileImage: true,
        country: { select: { name: true, flagLink: true } },
        heatResults: matchupCountFilter,
      },
      orderBy: { name: 'asc' },
    })
    if (!surfer) throw new TRPCError({ code: 'NOT_FOUND' })
    return surfer
  }),

  getLocations: publicProcedure.input(SurferSchema).query(({ ctx, input }) => {
    const locations = ctx.prisma.location.findMany({
      where: { events: { some: { eventResults: { some: { surferSlug: input.surferId, NOT: { place: { equals: 0 } } } } } } },
      include: {
        country: true,
        events: { where: { eventResults: { some: { surferSlug: input.surferId, NOT: { place: { equals: 0 } } } } }, include: { tour: true, eventResults: { where: { surferSlug: input.surferId }, orderBy: { place: 'desc' } } } },
      },
    })
    if (!locations) throw new TRPCError({ code: 'NOT_FOUND' })
    return locations
  }),

  getOne: publicProcedure.input(z.object({ slug: z.string() })).query(({ ctx, input }) => {
    return ctx.prisma.surfer.findUniqueOrThrow({ where: { slug: input.slug }, include: { country: true } })
  }),

  getOneHeader: publicProcedure.input(z.object({ slug: z.string() })).query(({ ctx, input }) => {
    return ctx.prisma.surfer.findUniqueOrThrow({ where: { slug: input.slug }, select: { name: true, slug: true, profileImage: true, country: { select: { name: true, flagLink: true } } } })
  }),

  getName: publicProcedure.input(z.object({ slug: z.string().optional() })).query(({ ctx, input }) => {
    return ctx.prisma.surfer.findUniqueOrThrow({ where: { slug: input.slug }, select: { name: true } })
  }),
})
