export const configSurferImage = (surferProfile: string, size: number) => {
  return surferProfile.replace('x=96', `x=${size}`).replace('y=96', `y=${size}`)
}