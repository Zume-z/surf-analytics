import { RouterOutputs } from './api'
import { Prisma, PrismaClient } from '@prisma/client'
import { Session } from 'next-auth'

export interface Context {
  session: Session | null
  prisma: PrismaClient<Prisma.PrismaClientOptions, never, Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined>
}

export interface RouterType {
  pathname: string
  query: any
}

// =================================================================================================
// SCHEMA
// =================================================================================================

export interface Surfer {
  id: string
  slug: string
  name: string
  dob?: string

  heightCm?: number
  weightKg?: number
  stance: Stance
  hometown?: string
  profileImage: string
  gender: Gender
  tourResults: TourResult[]
  eventResults: EventResult[]
  heatResults: HeatResult[]
  waves: Wave[]
  country: Country
  countrySlug: string
  surfersKnockedOut: EventResult[]
}

export interface Tour {
  id: string
  slug: string
  canceled?: boolean
  tourType: TourType
  year: number
  gender: Gender
  tourResults: TourResult[]
  events: Event[]
}

export interface TourResult {
  surferRank: number
  surferPoints: number
  worldTitle?: boolean
  surfer: Surfer
  surferSlug: string
  tour: Tour
  tourSlug: string
}

export interface Event {
  id: string
  slug: string
  name: string
  eventRound: number
  address: string
  linkedEvent: number
  linkedEventSlug?: string
  timeZone: string
  startDate: Date
  endDate: Date
  year: number
  canceled?: boolean
  eventStatus?: Status
  tour: Tour
  tourSlug: string
  country: Country
  countrySlug: string
  location: Location
  locationSlug: string
  eventResults: EventResult[]
  heats: Heat[]
}

export interface EventResult {
  place: number
  points: number
  prizeMoney: number
  wildCard: boolean
  injured: boolean
  replacement: boolean
  throwaway: boolean
  withdrawn: boolean
  knockedOutBySlug?: string
  surfer: Surfer
  surferSlug: string
  event: Event
  eventSlug: string
}

export interface Heat {
  id: string
  slug: string
  heatNumber: number
  heatRound: string
  roundNumber: number
  waveRange?: string
  avgWaveHeight?: number
  windConditions?: string
  heatDuration?: number
  heatDate?: string
  heatStatus?: Status
  waves: Wave[]
  heatResults: HeatResult[]
  break: Break
  breakSlug: string
  event: Event
  eventSlug: string
}

export interface HeatResult {
  heatPlace: number
  heatTotal?: number
  heatDifferential?: number
  scoreOne?: number
  scoreTwo?: number
  interferenceOne?: number
  interferenceTwo?: number
  interferenceThree?: number
  jerseyColor?: string
  surfer: Surfer
  surferSlug: string
  heat: Heat
  heatSlug: string
  boardShaperSlug: String
  boardShaper: Shaper
}

export interface Wave {
  id: string
  slug: string
  waveScore: number
  waveNumber: number
  waveDirection?: WaveDirection
  interference?: Interference
  intPenalty?: InterferencePenalty
  waveComplete?: boolean
  brokenBoard?: boolean
  countedWave: boolean
  surfer: Surfer
  surferSlug: string
  heat: Heat
  heatSlug: string
}

export interface Shaper {
  id: string
  slug: string
  name: string
  heatResults: HeatResult[]
}

export interface Country {
  id: string
  slug: string
  name: string
  iso: string
  flagLink: string
  surfers: Surfer[]
  events: Event[]
  breaks: Break[]
  locations: Location[]
}

export interface Break {
  id: string
  slug: string
  name: string
  waveType: WaveType
  waveDirection: WaveDirection
  heats: Heat[]
  country: Country
  countrySlug: string
}

export interface Location {
  id: string
  slug: string
  name: string
  events: Event[]
  country: Country
  countrySlug: string
}

export type TourType = 'CHAMPIONSHIPTOUR' | 'CHALLENGERSERIES' | 'QUALIFYINGSERIES' | 'BIGWAVE' | 'LONGBOARDTOUR' | 'JUNIORTOUR' | 'SPECIALITYEVENTS' | 'VANSTRIPLECROWN'
export type Status = 'CANCELED' | 'UPCOMING' | 'COMPLETED'
export type WaveType = 'BEACHBREAK' | 'POINTBREAK' | 'REEFBREAK' | 'WAVEPOOL'
export type Interference = 'PENALTYONE' | 'PENALTYTWO' | 'PENALTYTHREE'
export type InterferencePenalty = 'HALVED_ONE' | 'ZEROED_TWO' | 'ZEROED_THREE' | 'ZEROED_MULTI' | undefined
export type WaveDirection = 'LEFT' | 'RIGHT' | 'BOTH' | undefined
export type Gender = 'MALE' | 'FEMALE'
export type Stance = 'REGULAR' | 'GOOFY'