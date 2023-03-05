export const getHeatDifferential = async (prisma: any, heatId: string, surferId: string) => {
  const heatResults = await prisma.heatResult.findMany({ where: { heatId: heatId } })

  // if surferId is not passed in
  if (!surferId) {
    const firstSurfer = heatResults.filter((heatResult: { heatPlace: number }) => heatResult.heatPlace === 1)
    const secondSurfer = heatResults.filter((heatResult: { heatPlace: number }) => heatResult.heatPlace === 2)
    const firstSurfetHeatTotal = firstSurfer[0].heatTotal
    const secondSurfetHeatTotal = secondSurfer[0].heatTotal
    if (firstSurfetHeatTotal && secondSurfetHeatTotal) {
      const heatDifferential = firstSurfetHeatTotal - secondSurfetHeatTotal
      console.log(heatDifferential)
    }
  }

  // if surferId is passed in
  if (surferId && heatId) {
    const thisSurfer = heatResults.filter((heatResult: { surferId: string }) => heatResult.surferId === surferId)
    const otherSurfers = heatResults.filter((heatResult: { surferId: string }) => heatResult.surferId != surferId)
    if (thisSurfer[0].heatPlace != 1) {
      const firstSurfer = otherSurfers.filter((otherSurfer: { heatPlace: number }) => otherSurfer.heatPlace === 1)
      const firstSurfetHeatTotal = firstSurfer[0].heatTotal
      const thisSurferHeatTotal = thisSurfer[0].heatTotal
      if (thisSurferHeatTotal && firstSurfetHeatTotal) {
        const heatDifferential = firstSurfetHeatTotal - thisSurferHeatTotal
        console.log(heatDifferential)
      }
    }
    if (thisSurfer[0].heatPlace === 1) {
      const secondSurfer = otherSurfers.filter((otherSurfer: { heatPlace: number }) => otherSurfer.heatPlace === 2)
      const secondSurfetHeatTotal = secondSurfer[0].heatTotal
      const thisSurferHeatTotal = thisSurfer[0].heatTotal
      if (thisSurferHeatTotal && secondSurfetHeatTotal) {
        const heatDifferential = thisSurferHeatTotal - secondSurfetHeatTotal
        console.log(heatDifferential)
      }
    }
  }
}