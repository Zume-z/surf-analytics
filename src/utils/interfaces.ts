import { Session } from 'next-auth'
import { Prisma, PrismaClient } from '@prisma/client'

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
  boardShaperSlug: string
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
  eventName?: string
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

// =================================================================================================
// STATS
// =================================================================================================
export interface Stats {
  // Results
  worldTitles?: { label: string; value: string | number }
  place?: { label: string; value: string | number }
  points?: { label: string; value: string | number }
  surferRank?: { label: string; value: string | number }
  surferPoints?: { label: string; value: string | number }
  avgRank?: { label: string; value: string | number }
  avgPoints?: { label: string; value: string | number }
  knockedOutBy?: { label: string; value: string | number }
  mostBeaten?: { label: string; value: string | number }
  mostBeatenBy?: { label: string; value: string | number }

  // Events
  totalEvents?: { label: string; value: string | number }
  eventWins?: { label: string; value: string | number }
  eventWinPerc?: { label: string; value: string | number }
  avgResult?: { label: string; value: string | number }
  bestResult?: { label: string; value: string | number }
  eventBreaks?: { label: string; value: string | number }

  // Heats
  heatTotal?: { label: string; value: string | number }
  heatPlace?: { label: string; value: string | number }
  totalHeats?: { label: string; value: string | number }
  heatWins?: { label: string; value: string | number }
  heatWinPerc?: { label: string; value: string | number }
  avgHeatTotal?: { label: string; value: string | number }
  heatDifferential?: { label: string; value: string | number }
  heatTotalDifferential?: { label: string; value: string | number }
  avgHeatTotalDifferential?: { label: string; value: string | number }
  highestHeatTotal?: { label: string; value: string | number }
  excellentHeats?: { label: string; value: string | number }
  combinedHeatTotal?: { label: string; value: string | number }

  // Waves
  totalWaves?: { label: string; value: string | number }
  avgWaveScore?: { label: string; value: string | number }
  totalCountedWaves?: { label: string; value: string | number }
  avgCountedWaveScore?: { label: string; value: string | number }
  highestWaveScore?: { label: string; value: string | number }
  totalTens?: { label: string; value: string | number }
  excellentWaves?: { label: string; value: string | number }
  wavesPerMinute?: { label: string; value: string | number }

  // Conditions
  breakName?: { label: string; value: string | number }
  waveType?: { label: string; value: string | number }
  waveRange?: { label: string; value: string | number }
  avgWaveRange?: { label: string; value: string | number }
  windConditions?: { label: string; value: string | number }
  avgWindConditions?: { label: string; value: string | number }

  // Other
  prizeMoney?: { label: string; value: string | number }
  totalInterferences?: { label: string; value: string | number }
}

// =================================================================================================
// TYPES
// =================================================================================================

export interface Context {
  session: Session | null
  prisma: PrismaClient<Prisma.PrismaClientOptions, never, Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined>
}

export interface RouterType {
  pathname: string
  query: any
}

export interface TourWorldTitle {
  year: number
  mensTourResult: TourResult
  womensTourResult: TourResult
}

// =================================================================================================
// ENUMS
// =================================================================================================

export const SORTDIR = ['asc', 'desc'] as const
export const GENDER = ['MALE', 'FEMALE'] as const
export const SWIPERDIR = ['NEXT', 'PREV'] as const
export const STATUS = ['CANCELED', 'UPCOMING', 'COMPLETED'] as const
