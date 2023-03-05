export const placeFormat = (value: number) => {
  switch (value) {
    case 1:
      return 'First'
    case 2:
      return 'Second'
    case 3:
      return 'Third'
    case 4:
      return 'Fourth'
    default:
      return 'Error'
  }
}
