import { getAgeDob } from './calcAge'
import { Stats, Surfer } from '../interfaces'

export const surferCareerStats = (statQuery?: Stats, allStatQuery?: Stats, surfer?: Surfer, statToggle?: boolean) => {
  if (statQuery == undefined || surfer == undefined) return undefined
  const { dob, heightCm, weightKg, stance, hometown } = surfer
  const surferStance = { label: 'Stance', value: stance ? stance.charAt(0) + stance.slice(1).toLocaleLowerCase() : '-' }
  const surferHeight = heightCm ? { label: 'Height', value: heightCm + 'cm', subValue: Math.floor(heightCm / 30.48) + "'" + Math.floor((heightCm % 30.48) / 2.54) + '"' } : { label: 'Height', value: '-' } //prettier-ignore
  const surferWeight = weightKg ? { label: 'Weight', value: weightKg + 'kg', subValue: Math.floor(weightKg * 2.20462) + ' lbs' } : { label: 'Weight', value: '-' }
  const surferAge = dob ? { label: 'Age', value: getAgeDob(dob).dob, subValue: getAgeDob(dob).age } : { label: 'Age', value: '-' }
  const surferHomeTown = hometown ? { label: 'Hometown', value: hometown } : { label: 'Hometown', value: '-' }
  const { surferRank, surferPoints, worldTitles, prizeMoney, totalEvents, eventWins, bestResult, avgResult } = statQuery

  if (!statToggle) {
    const bio = [surferStance, surferAge, surferHeight, surferWeight]
    const career = [surferRank, surferPoints, worldTitles, prizeMoney]
    const events = [totalEvents, eventWins, avgResult, bestResult]
    return [bio, career, events]
  }

  if (statToggle) {
    if (!allStatQuery || surfer == undefined) return undefined
    const { eventWinPerc, totalHeats, avgHeatTotal, heatWins, heatWinPerc, highestHeatTotal, excellentHeats, totalWaves, avgWaveScore, totalCountedWaves, avgCountedWaveScore, highestWaveScore, excellentWaves } = allStatQuery
    const bio = { label: 'Bio', stats: [surferStance, surferAge, surferHeight, surferWeight, surferHomeTown] }
    const career = { label: 'Career', stats: [surferRank, surferPoints, worldTitles, prizeMoney] }
    const events = { label: 'Events', stats: [totalEvents, eventWins, eventWinPerc, avgResult, bestResult] }
    const heats = { label: 'Heats', stats: [totalHeats, heatWins, heatWinPerc, avgHeatTotal, excellentHeats, highestHeatTotal] }
    const waves = { label: 'Waves', stats: [totalWaves, avgWaveScore, totalCountedWaves, avgCountedWaveScore, highestWaveScore, excellentWaves] }
    return [bio, career, events, heats, waves]
  }
}

export const surferEventStats = (statQuery?: Stats, statQueryAll?: Stats, statToggle?: boolean) => {
  if (!statToggle) {
    if (statQuery == undefined) return undefined
    const { surferRank, surferPoints, worldTitles, prizeMoney, totalEvents, eventWins, bestResult, avgResult, totalHeats, heatWins, avgHeatTotal, heatWinPerc } = statQuery
    const results = [surferRank, surferPoints, worldTitles, prizeMoney]
    const events = [totalEvents, eventWins, avgResult, bestResult]
    const heats = [totalHeats, heatWins, heatWinPerc, avgHeatTotal]
    return [results, events, heats]
  }
  if (statToggle) {
    if (!statQueryAll) return undefined
    const { surferRank, surferPoints, prizeMoney, totalEvents,  eventWins, bestResult, avgResult, eventWinPerc, totalHeats, heatWins, heatWinPerc, avgHeatTotal, highestHeatTotal, excellentHeats, totalWaves, avgWaveScore, totalCountedWaves, avgCountedWaveScore, highestWaveScore, excellentWaves} = statQueryAll //prettier-ignore
    const results = { label: 'Results', stats: [surferRank, surferPoints, prizeMoney] }
    const events = { label: 'Events', stats: [totalEvents, eventWins, eventWinPerc, avgResult, bestResult] }
    const heats = { label: 'Heats', stats: [totalHeats, heatWins, heatWinPerc, avgHeatTotal, excellentHeats, highestHeatTotal] }
    const waves = { label: 'Waves', stats: [totalWaves, avgWaveScore, totalCountedWaves, avgCountedWaveScore, highestWaveScore, excellentWaves] }
    return [results, events, heats, waves]
  }
}

export const surferHeatStats = (statQuery?: Stats, statQueryAll?: Stats, statToggle?: boolean) => {
  if (!statToggle) {
    if (statQuery == undefined) return
    const { place, points, knockedOutBy, prizeMoney, totalHeats, heatWins, heatWinPerc, avgHeatTotal, totalWaves, avgWaveScore, avgCountedWaveScore, highestWaveScore } = statQuery
    const results = [place, points, prizeMoney, knockedOutBy]
    const heats = [totalHeats, heatWins, heatWinPerc, avgHeatTotal]
    const waves = [totalWaves, avgWaveScore, avgCountedWaveScore, highestWaveScore]
    return [results, heats, waves]
  }
  if (statToggle) {
    if (!statQueryAll) return undefined
    const { place, points, knockedOutBy, prizeMoney, totalHeats, heatWins, heatWinPerc, avgHeatTotal, highestHeatTotal, excellentHeats, totalWaves, avgWaveScore, totalCountedWaves, avgCountedWaveScore, highestWaveScore, excellentWaves } = statQueryAll //prettier-ignore
    const results = { label: 'Results', stats: [place, points, prizeMoney, knockedOutBy] }
    const heats = { label: 'Heats', stats: [totalHeats, heatWins, heatWinPerc, avgHeatTotal, excellentHeats, highestHeatTotal] }
    const waves = { label: 'Waves', stats: [totalWaves, avgWaveScore, totalCountedWaves, avgCountedWaveScore, highestWaveScore, excellentWaves] }
    return [results, heats, waves]
  }
}

export const surferWaveStats = (statQuery?: Stats, statQueryAll?: Stats, statToggle?: boolean) => {
  if (!statToggle) {
    if (statQuery == undefined) return
    const { waveRange, windConditions, waveType, breakName, heatPlace, heatTotal, heatDifferential, highestWaveScore, totalWaves, avgWaveScore, avgCountedWaveScore, excellentWaves } = statQuery
    const conditions = [breakName, waveRange, windConditions, waveType]
    const results = [heatPlace, heatTotal, heatDifferential, highestWaveScore]
    const waves = [totalWaves, avgWaveScore, avgCountedWaveScore, excellentWaves]
    return [conditions, results, waves]
  }
  if (statToggle) {
    if (!statQueryAll) return undefined
    const { waveRange, windConditions, waveType, breakName, heatPlace, heatTotal, heatDifferential, highestWaveScore, totalWaves, avgWaveScore, totalCountedWaves, avgCountedWaveScore, excellentWaves } = statQueryAll //prettier-ignore
    const conditions = { label: 'Conditions', stats: [breakName, waveRange, windConditions, waveType] }
    const results = { label: 'Result', stats: [heatPlace, heatTotal, heatDifferential] }
    const waves = { label: 'Waves', stats: [totalWaves, avgWaveScore, totalCountedWaves, avgCountedWaveScore, highestWaveScore, excellentWaves] }
    return [conditions, results, waves]
  }
}

export const surferLocationStats = (statQuery?: Stats, statQueryAll?: Stats, statToggle?: boolean) => {
  if (!statToggle) {
    if (statQuery == undefined) return
    const { totalEvents, eventWins, bestResult, avgResult, excellentHeats, totalHeats, heatWins, avgHeatTotal, totalWaves, avgWaveScore, avgCountedWaveScore, excellentWaves } = statQuery
    const results = [totalEvents, eventWins, avgResult, bestResult]
    const heats = [totalHeats, heatWins, excellentHeats, avgHeatTotal]
    const waves = [totalWaves, excellentWaves, avgWaveScore, avgCountedWaveScore]
    return [results, heats, waves]
  }
  if (statToggle) {
    if (!statQueryAll) return undefined
    const { totalEvents, eventWins, bestResult, avgResult, eventWinPerc, excellentHeats, totalHeats, heatWins, heatWinPerc, avgHeatTotal, highestHeatTotal, totalWaves, avgWaveScore, totalCountedWaves, avgCountedWaveScore, highestWaveScore, excellentWaves, prizeMoney } = statQueryAll //prettier-ignore
    const results = { label: 'Results', stats: [totalEvents, eventWins, eventWinPerc, avgResult, bestResult, prizeMoney] }
    const heats = { label: 'Heats', stats: [totalHeats, heatWins, heatWinPerc, avgHeatTotal, excellentHeats, highestHeatTotal] }
    const waves = { label: 'Waves', stats: [totalWaves, avgWaveScore, totalCountedWaves, avgCountedWaveScore, highestWaveScore, excellentWaves] }
    return [results, heats, waves]
  }
}

export const eventResultStats = (statQuery?: Stats, statQueryAll?: Stats, statToggle?: boolean) => {
  if (!statToggle) {
    if (statQuery == undefined) return
    const { eventBreaks, avgWaveRange, avgWindConditions, totalHeats, avgHeatTotal, highestHeatTotal, excellentHeats, totalWaves, avgWaveScore, avgCountedWaveScore, excellentWaves, prizeMoney } = statQuery
    const event = [eventBreaks, avgWaveRange, avgWindConditions, prizeMoney]
    const heats = [totalHeats, avgHeatTotal, highestHeatTotal, excellentHeats]
    const waves = [totalWaves, avgWaveScore, avgCountedWaveScore, excellentWaves]
    return [event, heats, waves]
  }
  if (statToggle) {
    if (!statQueryAll) return undefined
    const { eventBreaks, avgWaveRange, avgWindConditions, totalHeats, avgHeatTotal, highestHeatTotal, excellentHeats, totalWaves, avgWaveScore, totalCountedWaves, avgCountedWaveScore, excellentWaves, prizeMoney } = statQueryAll //prettier-ignore
    const event = { label: 'Event', stats: [eventBreaks, avgWaveRange, avgWindConditions, prizeMoney] }
    const heats = { label: 'Heats', stats: [totalHeats, avgHeatTotal, highestHeatTotal, excellentHeats] }
    const waves = { label: 'Waves', stats: [totalWaves, avgWaveScore, totalCountedWaves, avgCountedWaveScore, excellentWaves] }
    return [event, heats, waves]
  }
}

export const eventWaveStats = (statQuery?: Stats, statQueryAll?: Stats, statToggle?: boolean) => {
  if (!statToggle) {
    if (statQuery == undefined) return
    const { waveRange, windConditions, waveType, breakName, combinedHeatTotal, avgHeatTotal, heatDifferential, totalWaves, avgWaveScore, avgCountedWaveScore, highestWaveScore, excellentWaves } = statQuery
    const conditions = [breakName, waveRange, windConditions, waveType]
    const heats = [avgHeatTotal, heatDifferential, highestWaveScore, combinedHeatTotal]
    const waves = [totalWaves, avgWaveScore, avgCountedWaveScore, excellentWaves]
    return [conditions, heats, waves]
  }
  if (statToggle) {
    if (!statQueryAll) return undefined
    const { waveRange, windConditions, waveType, breakName, combinedHeatTotal, avgHeatTotal, heatDifferential, totalWaves, avgWaveScore, totalCountedWaves, avgCountedWaveScore, highestWaveScore, excellentWaves } = statQueryAll //prettier-ignore
    const conditions = { label: 'Conditions', stats: [breakName, waveRange, windConditions, waveType] }
    const heats = { label: 'Heats', stats: [avgHeatTotal, heatDifferential, highestWaveScore, combinedHeatTotal] }
    const waves = { label: 'Waves', stats: [totalWaves, avgWaveScore, totalCountedWaves, avgCountedWaveScore, excellentWaves] }
    return [conditions, heats, waves]
  }
}

export const countrySurferStats = (statQuery?: Stats, statQueryAll?: Stats, statToggle?: boolean) => {
  if (!statToggle) {
    if (statQuery == undefined) return
    const { avgRank, avgPoints, worldTitles, prizeMoney, totalEvents, eventWins, avgResult, eventWinPerc, totalHeats, heatWins, heatWinPerc, avgHeatTotal } = statQuery
    const results = [worldTitles, avgRank, avgPoints, prizeMoney]
    const events = [totalEvents, eventWins, avgResult, eventWinPerc]
    const heats = [totalHeats, heatWins, heatWinPerc, avgHeatTotal]
    return [results, events, heats]
  }
  if (statToggle) {
    if (!statQueryAll) return undefined
    const { avgRank, avgPoints, worldTitles, prizeMoney, totalEvents, eventWins, avgResult, eventWinPerc, totalHeats, heatWins, heatWinPerc, avgHeatTotal } = statQueryAll //prettier-ignore
    const results = { label: 'Results', stats: [worldTitles, avgRank, avgPoints, prizeMoney] }
    const events = { label: 'Events', stats: [totalEvents, eventWins, avgResult, eventWinPerc] }
    const heats = { label: 'Heats', stats: [totalHeats, heatWins, heatWinPerc, avgHeatTotal] }
    return [results, events, heats]
  }
}

export const countryEventStats = (statQuery?: Stats, statQueryAll?: Stats, statToggle?: boolean) => {
  if (!statToggle) {
    if (statQuery == undefined) return
    const { totalEvents, avgWaveRange, avgWindConditions, totalHeats, avgHeatTotal, highestHeatTotal, excellentHeats, totalWaves, avgWaveScore, avgCountedWaveScore, excellentWaves, prizeMoney } = statQuery
    const events = [totalEvents, avgWaveRange, avgWindConditions, prizeMoney]
    const heats = [totalHeats, avgHeatTotal, highestHeatTotal, excellentHeats]
    const waves = [totalWaves, avgWaveScore, avgCountedWaveScore, excellentWaves]
    return [events, heats, waves]
  }
  if (statToggle) {
    if (!statQueryAll) return undefined
    const { totalEvents, avgWaveRange, avgWindConditions, totalHeats, avgHeatTotal, highestHeatTotal, excellentHeats, totalWaves, avgWaveScore, totalCountedWaves, avgCountedWaveScore, excellentWaves, prizeMoney } = statQueryAll //prettier-ignore
    const events = { label: 'Events', stats: [totalEvents, avgWaveRange, avgWindConditions, prizeMoney] }
    const heats = { label: 'Heats', stats: [totalHeats, avgHeatTotal, highestHeatTotal, excellentHeats] }
    const waves = { label: 'Waves', stats: [totalWaves, avgWaveScore, totalCountedWaves, avgCountedWaveScore, excellentWaves] }
    return [events, heats, waves]
  }
}
