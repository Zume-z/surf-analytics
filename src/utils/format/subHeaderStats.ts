import { Surfer } from '../interfaces'
import { calcAge, dobFormat, getAgeDob,  } from './calcAge';


interface Stats {
  surferRank?: { label: string; value: string | number }
  surferPoints?: { label: string; value: string | number }
  worldTitles?: { label: string; value: string | number }
  prizeMoney?: { label: string; value: string | number }
  totalEvents?: { label: string; value: string | number }
  eventWins?: { label: string; value: string | number }
  bestResult?: { label: string; value: string | number }
  avgResult?: { label: string; value: string | number }
  totalHeats?: { label: string; value: string | number }
  heatWins?: { label: string; value: string | number }
  avgHeatTotal?: { label: string; value: string | number }
  heatWinPerc?: { label: string; value: string | number }
  totalWaves?: { label: string; value: string | number }
  avgWaveScore?: { label: string; value: string | number }
  avgCountedWaveScore?: { label: string; value: string | number }
  highestWaveScore?: { label: string; value: string | number }
  waveRange?: { label: string; value: string | number }
  windConditions?: { label: string; value: string | number }
  waveType?: { label: string; value: string | number }
  breakName?: { label: string; value: string | number }
  heatPlace?: { label: string; value: string | number }
  heatTotal?: { label: string; value: string | number }
  heatDifferential?: { label: string; value: string | number }
  excellentWaves?: { label: string; value: string | number }
  eventBreaks?: { label: string; value: string | number }
  avgWaveRange?: { label: string; value: string | number }
  avgWindConditions?: { label: string; value: string | number }
  highestHeatTotal?: { label: string; value: string | number }
  excellentHeats?: { label: string; value: string | number }
  place?: { label: string; value: string | number }
  points?: { label: string; value: string | number }
  knockedOutBy?: { label: string; value: string | number }
  event?: { label: string; value: string | number }
  combinedHeatTotal?: { label: string; value: string | number }
  avgRank?: { label: string; value: string | number }
  avgPoints?: { label: string; value: string | number }
  eventWinPerc?: { label: string; value: string | number }
}
// stance.toLowerCase().charAt(0).toUpperCase() + stance.slice(1)
export const surferCareerStats = (stats?: Stats, surfer?: Surfer) => {
  if (stats == undefined || surfer == undefined) return undefined

  const { dob, heightCm, weightKg, stance, hometown } = surfer
  // CHANGE FORMAT OF DOB
  
  const surferStance = { label: 'Stance', value: stance ? stance.charAt(0) + stance.slice(1).toLocaleLowerCase() : '-' }
  const surferHeight = heightCm ? { label: 'Height', value: heightCm + 'cm', subValue: Math.floor(heightCm / 30.48) + "'" + Math.floor((heightCm % 30.48) / 2.54) + '"' } : { label: 'Height', value: '-' } //prettier-ignore
  const surferWeight = weightKg ? { label: 'Weight', value: weightKg + 'kg', subValue: Math.floor(weightKg * 2.20462) + 'lbs' } : { label: 'Weight', value: '-' }
  const surferAge = dob ? { label: 'Age', value: getAgeDob(dob).dob, subValue: getAgeDob(dob).age } : { label: 'Age', value: '-' }
  const { surferRank, surferPoints, worldTitles, prizeMoney, totalEvents, eventWins, bestResult, avgResult } = stats
  const col1 = [surferStance, surferAge, surferHeight, surferWeight]
  const col2 = [surferRank, surferPoints, worldTitles, prizeMoney]
  const col3 = [totalEvents, eventWins, bestResult, avgResult]
  return [col1, col2, col3]
}

export const surferEventStats = (stats?: Stats) => {
  if (stats == undefined) return
  const { surferRank, surferPoints, worldTitles, prizeMoney, totalEvents, eventWins, bestResult, avgResult, totalHeats, heatWins, avgHeatTotal, heatWinPerc } = stats
  const col1 = [surferRank, surferPoints, worldTitles, prizeMoney]
  const col2 = [totalEvents, eventWins, bestResult, avgResult]
  const col3 = [totalHeats, heatWins, heatWinPerc, avgHeatTotal]
  return [col1, col2, col3]
}

export const surferHeatStats = (stats?: Stats) => {
  if (stats == undefined) return
  const { place, points, knockedOutBy, prizeMoney, totalHeats, heatWins, heatWinPerc, avgHeatTotal, totalWaves, avgWaveScore, avgCountedWaveScore, highestWaveScore } = stats
  const col1 = [place, points, prizeMoney, knockedOutBy]
  const col2 = [totalHeats, heatWins, heatWinPerc, avgHeatTotal]
  const col3 = [totalWaves, avgWaveScore, avgCountedWaveScore, highestWaveScore]
  return [col1, col2, col3]
}

export const surferWaveStats = (stats?: Stats) => {
  if (stats == undefined) return
  const { waveRange, windConditions, waveType, breakName, heatPlace, heatTotal, heatDifferential, highestWaveScore, totalWaves, avgWaveScore, avgCountedWaveScore, excellentWaves } = stats
  const col1 = [breakName, waveRange, windConditions, waveType]
  const col2 = [heatPlace, heatTotal, heatDifferential, highestWaveScore]
  const col3 = [totalWaves, avgWaveScore, avgCountedWaveScore, excellentWaves]
  return [col1, col2, col3]
}

export const eventResultStats = (stats?: Stats) => {
  if (stats == undefined) return
  const { eventBreaks, avgWaveRange, avgWindConditions, totalHeats, avgHeatTotal, highestHeatTotal, excellentHeats, totalWaves, avgWaveScore, avgCountedWaveScore, excellentWaves, prizeMoney } = stats
  const col1 = [eventBreaks, avgWaveRange, avgWindConditions, prizeMoney]
  const col2 = [totalHeats, avgHeatTotal, highestHeatTotal, excellentHeats]
  const col3 = [totalWaves, avgWaveScore, avgCountedWaveScore, excellentWaves]
  return [col1, col2, col3]
}

export const eventWaveStats = (stats?: Stats) => {
  if (stats == undefined) return
  const { waveRange, windConditions, waveType, breakName, combinedHeatTotal, avgHeatTotal, heatDifferential, totalWaves, avgWaveScore, avgCountedWaveScore, highestWaveScore, excellentWaves } = stats
  const col1 = [breakName, waveRange, windConditions, waveType]
  const col2 = [avgHeatTotal, heatDifferential, highestWaveScore, combinedHeatTotal]
  const col3 = [totalWaves, avgWaveScore, avgCountedWaveScore, excellentWaves]
  return [col1, col2, col3]
}

export const countrySurferStats = (stats?: Stats) => {
  if (stats == undefined) return
  const { avgRank, avgPoints, worldTitles, prizeMoney, totalEvents, eventWins, avgResult, eventWinPerc, totalHeats, heatWins, heatWinPerc, avgHeatTotal } = stats
  const col1 = [worldTitles, avgRank, avgPoints, prizeMoney]
  const col2 = [totalEvents, eventWins, avgResult, eventWinPerc]
  const col3 = [totalHeats, heatWins, heatWinPerc, avgHeatTotal]
  return [col1, col2, col3]
}

export const countryEventStats = (stats?: Stats) => {
  if (stats == undefined) return
  const { totalEvents, avgWaveRange, avgWindConditions, totalHeats, avgHeatTotal, highestHeatTotal, excellentHeats, totalWaves, avgWaveScore, avgCountedWaveScore, excellentWaves, prizeMoney } = stats
  const col1 = [totalEvents, avgWaveRange, avgWindConditions, prizeMoney]
  const col2 = [totalHeats, avgHeatTotal, highestHeatTotal, excellentHeats]
  const col3 = [totalWaves, avgWaveScore, avgCountedWaveScore, excellentWaves]
  return [col1, col2, col3]
}
