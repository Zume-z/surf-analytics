import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc'
import { GENDER, SORTDIR } from '@/utils/enums'
import { Surfer } from '@/utils/interfaces'

export const SurferSchema = z.object({
  surferId: z.string().optional(),
  gender: z.enum(GENDER).optional(),
  countrySlug: z.string().optional(),
  year: z.number().optional(),

  // Sort
  sortName: z.enum(SORTDIR).optional(),

  // Pagination
  itemsPerPage: z.number().min(1).max(100).optional(),
  offset: z.number().optional(),
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

  getManyYear: publicProcedure.input(SurferSchema).query(({ ctx, input }) => {
    const surfer = ctx.prisma.surfer.findMany({
      where: { tourResults: { some: { tour: { year: { gte: 2010 } } } } },
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
