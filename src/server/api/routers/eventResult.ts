import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { GENDER, SORTDIR } from '@/utils/interfaces'
import { createTRPCRouter, publicProcedure } from '../trpc'

export const EventResultSchema = z.object({
  surferSlug: z.string().optional(),
  eventSlug: z.string().optional(),
  gender: z.enum(GENDER).optional(),
  year: z.number().min(1900).max(2100).optional(),
  tourSlug: z.string().optional(),
  countrySlug: z.string().optional(),
  surferCountrySlug: z.string().optional(),
  locationSlug: z.string().optional(),

  // Filters
  excludeInjured: z.boolean().optional(),
  excludeWithdrawn: z.boolean().optional(),
  excludeNoPlace: z.boolean().optional(),

  // Sort
  sortPlace: z.enum(SORTDIR).optional(),
  sortStartDate: z.enum(SORTDIR).optional(),

  // Pagination
  itemsPerPage: z.number().min(1).max(100).optional(),
  offset: z.number().optional(),
})

export const eventResultRouter = createTRPCRouter({
  getMany: publicProcedure.input(EventResultSchema).query(({ ctx, input }) => {
    const includeInjured = input.excludeInjured ? false : undefined
    const includeWithdrawn = input.excludeWithdrawn ? false : undefined
    const excludeNoPlace = input.excludeNoPlace ? { place: 0 } : undefined
    const startDateSort = input.sortStartDate ? { startDate: input.sortStartDate } : undefined
    const surferInputs = input.surferSlug || input.gender || input.surferCountrySlug ? { slug: input.surferSlug, gender: input.gender, countrySlug: input.surferCountrySlug } : undefined // prettier-ignore
    const eventResult = ctx.prisma.eventResult.findMany({
      where: {
        surfer: surferInputs,
        event: {
          slug: input.eventSlug,
          location: { slug: input.locationSlug },
          country: { slug: input.countrySlug },
          tour: { slug: input.tourSlug, year: input.year },
        },
        injured: includeInjured,
        withdrawn: includeWithdrawn,
        NOT: excludeNoPlace,
      },
      select: {
        place: true,
        points: true,
        surfer: { select: { name: true, slug: true, profileImage: true, country: { select: { flagLink: true, name: true } } } },
      },
      orderBy: {
        place: input?.sortPlace,
        event: startDateSort,
      },
      take: input?.itemsPerPage,
      skip: input?.offset,
    })
    if (!eventResult) throw new TRPCError({ code: 'NOT_FOUND' })
    return eventResult
  }),

  getManyBySurfer: publicProcedure.input(EventResultSchema).query(({ ctx, input }) => {
    const includeInjured = input.excludeInjured ? false : undefined
    const includeWithdrawn = input.excludeWithdrawn ? false : undefined
    const excludeNoPlace = input.excludeNoPlace ? { place: 0 } : undefined
    const startDateSort = input.sortStartDate ? { startDate: input.sortStartDate } : undefined
    const surferInputs = input.surferSlug || input.gender || input.surferCountrySlug ? { slug: input.surferSlug, gender: input.gender, countrySlug: input.surferCountrySlug } : undefined // prettier-ignore
    const eventResult = ctx.prisma.eventResult.findMany({
      where: {
        surfer: surferInputs,
        event: {
          slug: input.eventSlug,
          location: { slug: input.locationSlug },
          country: { slug: input.countrySlug },
          tour: { slug: input.tourSlug, year: input.year },
        },
        injured: includeInjured,
        withdrawn: includeWithdrawn,
        NOT: excludeNoPlace,
      },

      select: {
        throwaway: true,
        wildCard: true,
        injured: true,
        withdrawn: true,
        place: true,
        points: true,
        eventSlug: true,
        event: { select: { slug: true, name: true, address: true, eventRound: true, tour: { select: { year: true } } } },
      },
      orderBy: {
        place: input?.sortPlace,
        event: startDateSort,
      },
      take: input?.itemsPerPage,
      skip: input?.offset,
    })
    if (!eventResult) throw new TRPCError({ code: 'NOT_FOUND' })
    return eventResult
  }),

  getOne: publicProcedure.input(z.object({ surferSlug: z.string(), eventSlug: z.string() })).query(({ ctx, input }) => {
    const eventResult = ctx.prisma.eventResult.findUnique({ where: { eventSlug_surferSlug: { eventSlug: input.eventSlug, surferSlug: input.surferSlug } } })
    if (!eventResult) throw new TRPCError({ code: 'NOT_FOUND' })
    return eventResult
  }),
})
