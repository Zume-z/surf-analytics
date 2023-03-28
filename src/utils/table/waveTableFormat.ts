import { HeatResult, Wave } from '../interfaces'

export const getWaveTableCol = (heatResults: any, waves: any, wavePoolEvent?: boolean | null) => {
  // CHANGE

  if (!wavePoolEvent) {
    const tableColumns: any = [{ value: 'Wave', key: 'wave' }]
    heatResults.forEach((heatResult: HeatResult) => tableColumns.push({ value: heatResult, key: heatResult.surfer.slug }))
    return tableColumns
  }

  if (wavePoolEvent) {
    // Get heatResult with most waves
    const waveCounts: any = []
    heatResults.forEach((heatResult: HeatResult) => {
      const surferWaves = waves.filter((wave: Wave) => wave.surferSlug === heatResult.surferSlug)
      waveCounts.push({ heatResult: heatResult, waves: surferWaves })
    })
    waveCounts.sort((a: any, b: any) => b.waves.length - a.waves.length)
    if (waveCounts.length === 0) return []
    console.log(waveCounts[0].waves)
    const tableColumns: any = [{ value: 'SURFERS', key: 'surfer' }]
    const surferWaves = waveCounts[0].waves
    surferWaves.forEach((wave: Wave) => tableColumns.push({ value: `${wave.waveDirection} ${wave.waveNumber}`, key: wave.waveNumber }))
    return tableColumns
  }
}

export const getWaveTableData = (heatResults: any[], waves: any[], wavePoolEvent?: boolean | null) => {
  // CHANGE

  if (!wavePoolEvent) {
    const waveArray = []
    const waveCounts: any = []
    const surferData = heatResults.map((heatResult: HeatResult) => {
      const surferWaves = waves.filter((wave: Wave) => wave.surferSlug === heatResult.surferSlug)
      return { surfer: heatResult.surferSlug, waves: surferWaves }
    })

    // surferData.forEach((surfer: any) => waveCounts.push(surfer.waves[surfer.waves.length - 1].waveNumber))
    surferData.forEach((surfer: any) => waveCounts.push(surfer.waves.length))

    waveCounts.sort()
    const rowLength = waveCounts[waveCounts.length - 1]
    for (let i = 0; i < rowLength; i++) {
      let waveObject = { wave: i + 1 }
      for (const surfer of surferData) {
        if (surfer.waves[i]) {
          waveObject = { ...waveObject, [surfer.surfer]: surfer.waves[i] }
        } else {
          waveObject = { ...waveObject, [surfer.surfer]: null }
        }
      }
      waveArray.push(waveObject)
    }
    return waveArray
  } else {
    const surferData = heatResults.map((heatResult: HeatResult) => {
      const surferWaves = waves.filter((wave: Wave) => wave.surferSlug === heatResult.surferSlug)
      return { surfer: heatResult, waves: surferWaves }
    })

    return surferData
  }
}
