export const capitalizeFirst = (string: string) => {
  string = string.toLowerCase()
  return `${string.slice(0, 1).toUpperCase()}${string.slice(1)}`
}
