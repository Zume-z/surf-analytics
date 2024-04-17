export const configFlagImage = (flagImageLink: string, size: number) => {
  const y = size
  const x = size * 1.5

  return flagImageLink.replace('x=60', `x=${x}`).replace('y=40', `y=${y}`)
}
