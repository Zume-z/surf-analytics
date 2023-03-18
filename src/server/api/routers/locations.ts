import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { createTRPCRouter, publicProcedure } from '../trpc'
import { GENDER, SORTDIR } from '@/utils/enums'

export const LocationSchema = z.object({
  slug: z.string().optional(),
  surferSlug: z.string().optional(),
  countrySlug: z.string().optional(),

  // Sort
  sortName: z.enum(SORTDIR).optional(),

  // Pagination
  itemsPerPage: z.number().min(1).max(100).optional(),
  offset: z.number().optional(),
})

export const locationRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx, input }) => {
    return ctx.prisma.location.findMany()
  }),

  getMany: publicProcedure.input(LocationSchema).query(({ ctx, input }) => {
    const location = ctx.prisma.location.findMany({
      where: {
        slug: input.slug,
        countrySlug: input.countrySlug,
      },
      orderBy: {
        name: input.sortName,
      },
      take: input?.itemsPerPage,
      skip: input?.offset,
    })
    if (!location) throw new TRPCError({ code: 'NOT_FOUND' })
    return location
  }),

  getManyBySurfer: publicProcedure.input(LocationSchema).query(({ ctx, input }) => {
    const locations = ctx.prisma.location.findMany({
      where: { events: { some: { eventResults: { some: { surferSlug: input.surferSlug, place: { not: 0 } } } } } },
      select: {
        name: true,
        slug: true,
        eventName: true,
        country: { select: { name: true, slug: true, flagLink: true } },
        events: {
          where: { eventResults: { some: { surferSlug: input.surferSlug, place: { not: 0 } } } },
          select: { name: true, address: true, tour: { select: { year: true } }, eventResults: { where: { surferSlug: input.surferSlug }, select: { place: true, surferSlug: true }, orderBy: { place: 'desc' } } },
        },
      },
    })
    if (!locations) throw new TRPCError({ code: 'NOT_FOUND' })
    return locations
  }),

  getOne: publicProcedure.input(z.object({ slug: z.string() })).query(({ ctx, input }) => {
    return ctx.prisma.location.findUniqueOrThrow({ where: { slug: input.slug }, include: { country: true } })
  }),

  getName: publicProcedure.input(z.object({ slug: z.string() })).query(({ ctx, input }) => {
    return ctx.prisma.location.findUniqueOrThrow({ where: { slug: input.slug }, select: { name: true, eventName: true } })
  }),
})
