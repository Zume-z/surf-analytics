export const waitingPeriod = (item: any) => {
  const startDate = new Date(item.startDate).toDateString().split(' ')
  const endDate = new Date(item.endDate).toDateString().split(' ')
  if (startDate[1] === endDate[1]) {
    return `${startDate[1]} ${startDate[2]} - ${endDate[2]}`
  } else {
    return `${startDate[1]} ${startDate[2]} - ${endDate[1]} ${endDate[2]}`
  }
}