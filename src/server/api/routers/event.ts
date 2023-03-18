import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { createTRPCRouter, publicProcedure } from '../trpc'
import { GENDER, SORTDIR, STATUS } from '@/utils/enums'

export const EventSchema = z.object({
  slug: z.string().optional(),
  linkedEvent: z.number().optional(),
  year: z.number().min(1900).max(2100).optional(),
  eventStatus: z.enum(STATUS).optional(),
  tourSlug: z.string().optional(),
  countrySlug: z.string().optional(),
  locationSlug: z.string().optional(),
  gender: z.enum(GENDER).optional(),

  // Sort
  sortStartDate: z.enum(SORTDIR).optional(),
  sortEventRound: z.enum(SORTDIR).optional(),

  // Pagination
  itemsPerPage: z.number().min(1).max(100).optional(),
  offset: z.number().optional(),
})

export const eventRouter = createTRPCRouter({
  getMany: publicProcedure.input(EventSchema).query(({ ctx, input }) => {
    const event = ctx.prisma.event.findMany({
      where: {
        slug: input.slug,
        linkedEvent: input.linkedEvent,
        eventStatus: input.eventStatus,
        tour: { slug: input.tourSlug, gender: input.gender, year: input.year },
        countrySlug: input.countrySlug,
        locationSlug: input.locationSlug,
      },
      include: {
        eventResults: { where: { place: 1 }, include: { surfer: { include: { country: true } } } },
        tour: true,
        country: true,
      },
      orderBy: {
        startDate: input.sortStartDate,
        eventRound: input.sortEventRound,
      },
      take: input.itemsPerPage,
      skip: input.offset,
    })
    if (!event) throw new TRPCError({ code: 'NOT_FOUND' })
    return event
  }),

  getManyIndex: publicProcedure.input(EventSchema).query(({ ctx, input }) => {
    const event = ctx.prisma.event.findMany({
      where: {
        slug: input.slug,
        linkedEvent: input.linkedEvent,
        eventStatus: input.eventStatus,
        tour: { slug: input.tourSlug, gender: input.gender, year: input.year },
        countrySlug: input.countrySlug,
        locationSlug: input.locationSlug,
      },
      select: {
        name: true,
        slug: true,
        startDate: true,
        endDate: true,
        address: true,
        country: { select: { flagLink: true, name: true } },
      },
      orderBy: {
        startDate: input.sortStartDate,
        eventRound: input.sortEventRound,
      },
      take: input.itemsPerPage,
      skip: input.offset,
    })
    if (!event) throw new TRPCError({ code: 'NOT_FOUND' })
    return event
  }),

  getManyLocation: publicProcedure.input(EventSchema).query(({ ctx, input }) => {
    const event = ctx.prisma.event.findMany({
      where: {
        slug: input.slug,
        linkedEvent: input.linkedEvent,
        eventStatus: input.eventStatus,
        tour: { slug: input.tourSlug, gender: input.gender, year: input.year },
        countrySlug: input.countrySlug,
        locationSlug: input.locationSlug,
      },
      include: {
        eventResults: { where: { place: { lte: 2 } }, include: { surfer: { include: { country: true } } } },
        tour: true,
        country: true,
      },
      orderBy: {
        startDate: input.sortStartDate,
        eventRound: input.sortEventRound,
      },
      take: input.itemsPerPage,
      skip: input.offset,
    })
    if (!event) throw new TRPCError({ code: 'NOT_FOUND' })
    return event
  }),

  getOne: publicProcedure.input(z.object({ slug: z.string() })).query(({ ctx, input }) => {
    const event = ctx.prisma.event.findUnique({
      where: { slug: input.slug },
      include: { country: true, tour: true, eventResults: { select: { surfer: true } } },
    })
    if (!event) throw new TRPCError({ code: 'NOT_FOUND' })
    return event
  }),

  getName: publicProcedure.input(z.object({ slug: z.string() })).query(({ ctx, input }) => {
    const event = ctx.prisma.event.findUnique({ where: { slug: input.slug }, select: { name: true } })
    if (!event) throw new TRPCError({ code: 'NOT_FOUND' })
    return event
  }),
})
