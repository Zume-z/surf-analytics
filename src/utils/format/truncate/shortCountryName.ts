export const shortCountryName = (name: string) => {
  switch (name) {
    case 'United States':
      return 'USA'
    case 'United Kingdom':
      return 'UK'
    case 'New Zealand':
      return 'NZ'
    case 'French Polynesia':
      return 'PYF'
    default:
      return name
  }
}
