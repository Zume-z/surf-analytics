export const shortEventAddress = (address: string) => {
  if (!address) return ''
  const splitAddress = address.split(',')
  const formatAddress = splitAddress[1] + ', ' + splitAddress[splitAddress.length - 1]
  if(formatAddress.length > 30) return splitAddress[0]
  return formatAddress
}
