import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { createTRPCRouter, publicProcedure } from '../trpc'
import { GENDER, SORTDIR } from '@/utils/enums'

export const TourResultSchema = z.object({
  year: z.number().min(1900).max(2100).optional(),
  surferSlug: z.string().optional(),
  tourSlug: z.string().optional(),
  gender: z.enum(GENDER).optional(),
  countrySlug: z.string().optional(),

  // Sort
  sortSurferRank: z.enum(SORTDIR).optional(),
  sortYear: z.enum(SORTDIR).optional(),

  // Distinct
  distinctSurferSlug: z.boolean().optional(),

  // Pagination
  itemsPerPage: z.number().min(1).max(100).optional(),
  offset: z.number().optional(),
})

export const tourResultRouter = createTRPCRouter({
  getOne: publicProcedure.input(z.object({ surferSlug: z.string(), tourSlug: z.string() })).query(({ ctx, input }) => {
    const tourResult = ctx.prisma.tourResult.findUnique({ where: { tourSlug_surferSlug: { tourSlug: input.tourSlug, surferSlug: input.surferSlug } } })
    if (!tourResult) throw new TRPCError({ code: 'NOT_FOUND' })
    return tourResult
  }),

  getMany: publicProcedure.input(TourResultSchema).query(({ ctx, input }) => {
    const yearSort = input.sortYear ? { year: input.sortYear } : undefined
    const tourResult = ctx.prisma.tourResult.findMany({
      where: {
        surfer: {
          slug: input.surferSlug,
          countrySlug: input.countrySlug,
        },
        tour: {
          slug: input?.tourSlug,
          year: input?.year,
          gender: input?.gender,
        },
      },
      include: {
        surfer: { include: { country: true } },
        tour: true,
      },
      orderBy: {
        surferRank: input?.sortSurferRank,
        tour: yearSort,
      },
      take: input?.itemsPerPage,
      skip: input?.offset,
    })
    if (!tourResult) throw new TRPCError({ code: 'NOT_FOUND' })
    return tourResult
  }),

  getManyIndex: publicProcedure.input(TourResultSchema).query(({ ctx, input }) => {
    const yearSort = input.sortYear ? { year: input.sortYear } : undefined
    const tourResult = ctx.prisma.tourResult.findMany({
      where: {
        surfer: {
          slug: input.surferSlug,
          countrySlug: input.countrySlug,
        },
        tour: {
          slug: input?.tourSlug,
          year: input?.year,
          gender: input?.gender,
        },
      },
      select: {
        surferPoints: true,
        surferRank: true,
        surfer: { select: { name: true, slug: true, profileImage: true, country: { select: { name: true, flagLink: true } } } },
      },
      orderBy: {
        surferRank: input?.sortSurferRank,
        tour: yearSort,
      },
      take: input?.itemsPerPage,
      skip: input?.offset,
    })
    if (!tourResult) throw new TRPCError({ code: 'NOT_FOUND' })
    return tourResult
  }),

  getManyDistinct: publicProcedure.input(TourResultSchema).query(({ ctx, input }) => {
    const yearSort = input.sortYear ? { year: input.sortYear } : undefined
    const tourResult = ctx.prisma.tourResult.findMany({
      where: {
        surfer: {
          slug: input.surferSlug,
          countrySlug: input.countrySlug,
        },
        tour: {
          slug: input?.tourSlug,
          year: input?.year,
          gender: input?.gender,
        },
      },
      include: {
        surfer: { include: { country: true } },
        tour: true,
      },
      orderBy: {
        surferRank: input?.sortSurferRank,
        tour: yearSort,
      },
      distinct: ['surferSlug'],
      take: input?.itemsPerPage,
      skip: input?.offset,
    })
    if (!tourResult) throw new TRPCError({ code: 'NOT_FOUND' })
    return tourResult
  }),
})
