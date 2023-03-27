import { formatInTimeZone } from 'date-fns-tz'

export const waitingPeriod = (item: any) => {
  const startDateToLocalTime = formatInTimeZone(item.startDate, item?.timeZone!, 'yyyy-MM-dd HH:mm:ss')
  const endDateToLocalTime = formatInTimeZone(item.endDate, item?.timeZone!, 'yyyy-MM-dd HH:mm:ss')
  const formatStart = new Date(startDateToLocalTime).toString().split(' ')
  const formatEnd = new Date(endDateToLocalTime).toString().split(' ')

  if (formatStart[1] === formatEnd[1]) {
    return `${formatStart[1]} ${formatStart[2]} - ${formatEnd[2]}`
  } else {
    return `${formatStart[1]} ${formatStart[2]} - ${formatEnd[1]} ${formatEnd[2]}`
  }
}
