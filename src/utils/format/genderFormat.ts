export function genderFormat(gender?: string) {
  if(!gender) return ''
  switch (gender) {
    case 'MALE':
      return 'Mens'
    case 'FEMALE':
      return 'Womens'
    default:
      return ''
  }
}
