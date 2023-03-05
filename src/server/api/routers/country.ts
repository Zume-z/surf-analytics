import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { createTRPCRouter, publicProcedure } from '../trpc'
import { GENDER, SORTDIR, STATUS } from '@/utils/enums'

export const CountrySchema = z.object({
  countrySlug: z.string().optional(),
  surferYear: z.number().min(1900).max(2100).optional(),
  eventYear: z.number().min(1900).max(2100).optional(),
  gender: z.enum(GENDER).optional(),
  eventStaus: z.enum(STATUS).optional(),
  surferEventSlug: z.string().optional(),

  // Pagination
  itemsPerPage: z.number().min(1).max(100).optional(),
  offset: z.number().optional(),
})

export const countryRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.country.findMany({
      orderBy: {
        name: 'asc',
      },
    })
  }),

  getManyBySurfer: publicProcedure.input(CountrySchema).query(({ ctx, input }) => {
    const country = ctx.prisma.country.findMany({
      where: {
        surfers: {
          some: {
            tourResults: { some: { tour: { year: input.surferYear, gender: input.gender } } },
            eventResults: { some: { eventSlug: input.surferEventSlug } },
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
      take: input?.itemsPerPage,
      skip: input?.offset,
    })
    if (!country) throw new TRPCError({ code: 'NOT_FOUND' })
    return country
  }),

  getManyByEvent: publicProcedure.input(CountrySchema).query(({ ctx, input }) => {
    const country = ctx.prisma.country.findMany({
      where: {
        events: { some: { year: input.eventYear, tour: { gender: input.gender } } },
      },
      orderBy: {
        name: 'asc',
      },
      take: input?.itemsPerPage,
      skip: input?.offset,
    })
    if (!country) throw new TRPCError({ code: 'NOT_FOUND' })
    return country
  }),

  getManyIncSurfers: publicProcedure.input(CountrySchema).query(({ ctx, input }) => {
    const country = ctx.prisma.country.findMany({
      where: {
        surfers: { some: { tourResults: { some: { tour: { year: input.surferYear, gender: input.gender } } } } },
      },
      include: {
        surfers: {
          where: { tourResults: { some: { tour: { year: input.surferYear, gender: input.gender } } } },
          select: {
            name: true,
            eventResults: { where: { place: 1, AND: { event: { year: input.surferYear } } } },
            tourResults: { where: { worldTitle: true, AND: { tour: { year: input.surferYear } } }, select: { tour: { select: { year: true } } } },
          },
        },
        events: { where: { tour: { year: input.surferYear, gender: input.gender }, eventStatus: input.eventStaus } },
      },
      orderBy: {
        name: 'asc',
      },
      take: input?.itemsPerPage,
      skip: input?.offset,
    })
    if (!country) throw new TRPCError({ code: 'NOT_FOUND' })
    return country
  }),

  getOne: publicProcedure.input(CountrySchema).query(({ ctx, input }) => {
    const country = ctx.prisma.country.findUniqueOrThrow({
      where: { slug: input.countrySlug },
      include: {
        surfers: {
          where: { tourResults: { some: { tour: { year: input.surferYear, gender: input.gender } } } },
          select: { name: true, eventResults: { where: { place: 1, AND: { event: { year: input.surferYear } } } } },
        },
        events: { where: { tour: { year: input.surferYear, gender: input.gender }, eventStatus: input.eventStaus } },
      },
    })

    return country
  }),

  getCountrySurfers: publicProcedure.input(z.object({ countrySlug: z.string() })).query(({ ctx, input }) => {
    return ctx.prisma.country.findUniqueOrThrow({ where: { slug: input.countrySlug }, include: { surfers: true } })
  }),
})
