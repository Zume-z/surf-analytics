import { formatInTimeZone } from 'date-fns-tz'

export const eventStatus = (item: any) => {
  if(item.eventStatus == 'CANCELED') return 'Canceled' 
  if(item.eventStatus == 'COMPLETED') return 'Completed'

  const today = new Date().toISOString()
  // const startDate = new Date(item.startDate).toDateString()
  // const endDate = new Date(item.endDate).toDateString()
  const startDate = formatInTimeZone(item.startDate, item.timeZone, 'yyyy-MM-dd HH:mm:ssXXX')
  const endDate = formatInTimeZone(item.endDate, item.timeZone, 'yyyy-MM-dd HH:mm:ssXXX')

  console.log(item.timeZone)
  console.log('Today: ' ,today)
  console.log('Start Date: ' ,item.startDate)
  console.log('Start Date Formatted: ' ,startDate)
  console.log('End Date: ' ,item.endDate)
  console.log('End Date Formatted: ' ,endDate)
  return today < startDate ? 'Upcoming' : today > endDate ? 'Completed' : today > startDate && today < endDate ? 'In Progress' : ''
}
