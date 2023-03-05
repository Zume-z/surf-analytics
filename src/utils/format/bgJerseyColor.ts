export const bgJerseyColor = (item: any, defaultColour?: string) => {
  if (item == null) return defaultColour || 'bg-gray-100'
  item = item.toString().toLowerCase()

  switch (item) {
    case 'red':
      return 'bg-red-500'
    case 'blue':
      return 'bg-blue-500'
    case 'green':
      return 'bg-green-500'
    case 'yellow':
      return 'bg-yellow-300'
    case 'orange':
      return 'bg-orange-500'
    case 'pink':
      return 'bg-pink-500'
    case 'purple':
      return 'bg-purple-500'
    case 'black':
      return 'bg-black'
    case 'white':
      return 'bg-gray-100'
    default:
      return defaultColour || 'bg-gray-100'
  }
}
