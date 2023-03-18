import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { createTRPCRouter, publicProcedure } from '../trpc'
import { GENDER, SORTDIR, STATUS } from '@/utils/enums'

export const TourSchema = z.object({
  year: z.number().min(1900).max(2100).optional(),
  surferSlug: z.string().optional(),
  tourSlug: z.string().optional(),
  gender: z.enum(GENDER).optional(),
  countrySlugSurfer: z.string().optional(),
  countrySlugEvent: z.string().optional(),
  eventStatus: z.enum(STATUS).optional(),

  // Sort
  sortYear: z.enum(SORTDIR).optional(),

  // Pagination
  itemsPerPage: z.number().min(1).max(100).optional(),
  offset: z.number().optional(),
})

export const tourRouter = createTRPCRouter({
  getMany: publicProcedure.input(TourSchema).query(({ ctx, input }) => {
    const tour = ctx.prisma.tour.findMany({
      where: {
        slug: input.tourSlug,
        year: input.year,
        gender: input.gender,
      },

      orderBy: {
        year: input.sortYear,
      },
      take: input?.itemsPerPage,
      skip: input?.offset,
    })
    if (!tour) throw new TRPCError({ code: 'NOT_FOUND' })
    return tour
  }),

  getOne: publicProcedure.input(z.object({ surferSlug: z.string(), tourSlug: z.string() })).query(({ ctx, input }) => {
    return ctx.prisma.tour.findUniqueOrThrow({ where: { slug: input.tourSlug } })
  }),

  getEventYears: publicProcedure.input(TourSchema).query(({ ctx, input }) => {
    const query = ctx.prisma.tour.findMany({
      where: {
        gender: input.gender,
        tourResults: { some: { surfer: { countrySlug: input.countrySlugSurfer } } },
        events: { some: { countrySlug: input.countrySlugEvent, eventStatus: input.eventStatus } },
      },
      distinct: ['year'],
      select: { year: true },
      orderBy: {
        year: input.sortYear,
      },
      take: input?.itemsPerPage,
      skip: input?.offset,
    })
    if (!query) throw new TRPCError({ code: 'NOT_FOUND' })
    return query
  }),
  getSurferYears: publicProcedure.input(TourSchema).query(({ ctx, input }) => {
    const query = ctx.prisma.tour.findMany({
      where: {
        gender: input.gender,
        tourResults: { some: { surfer: { countrySlug: input.countrySlugSurfer } } },
      },
      distinct: ['year'],
      select: { year: true },
      orderBy: {
        year: input.sortYear,
      },
      take: input?.itemsPerPage,
      skip: input?.offset,
    })
    if (!query) throw new TRPCError({ code: 'NOT_FOUND' })
    return query
  }),
})
