import { HeatResult, Wave } from '../interfaces'

export const getWaveTableCol = (heatResults: any) => {
  const tableColumns: any = [{ value: 'Wave', key: 'wave' }]
  heatResults.forEach((heatResult: HeatResult) => tableColumns.push({ value: heatResult, key: heatResult.surfer.slug }))
  return tableColumns
}

export const getWaveTableData = (heatResults: any[], waves: any[]) => {
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
}
