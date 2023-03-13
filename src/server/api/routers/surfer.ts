import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { createTRPCRouter, publicProcedure } from '../trpc'
import { GENDER, SORTDIR } from '@/utils/enums'

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

  // HeadToHead
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

  getManyHeadToHead: publicProcedure.input(SurferSchema).query(({ ctx, input }) => {
    const surfer = ctx.prisma.surfer.findMany({
      where: {
        heatResults: { some: { heat: { heatStatus: 'COMPLETED', event: { wavePoolEvent: false }, heatResults: { some: { surferSlug: input.surferSlugFilter } } } } },
        tourResults: { some: { tour: { year: { gte: 2010 } } } },
      },
      include: { country: true },
      orderBy: { name: 'asc' },
    })
    if (!surfer) throw new TRPCError({ code: 'NOT_FOUND' })
    return surfer
  }),

  getOne: publicProcedure.input(z.object({ slug: z.string() })).query(({ ctx, input }) => {
    return ctx.prisma.surfer.findUniqueOrThrow({ where: { slug: input.slug }, include: { country: true } })
  }),

  getName: publicProcedure.input(z.object({ slug: z.string().optional() })).query(({ ctx, input }) => {
    return ctx.prisma.surfer.findUniqueOrThrow({ where: { slug: input.slug }, select: { name: true } })
  }),
})
