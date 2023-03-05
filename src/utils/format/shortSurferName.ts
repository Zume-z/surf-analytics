export const shortSurferName = (name: string) => {
  const splitName = name.split(' ')
  return splitName[0]!.charAt(0) + '. ' + splitName[1]
}