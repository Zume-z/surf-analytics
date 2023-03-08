import { formatInTimeZone } from 'date-fns-tz'
import { Event } from '../interfaces'

export const eventStatus = (item: Event) => {
  if (item.eventStatus == 'CANCELED') return 'Canceled'
  if (item.eventStatus == 'COMPLETED') return 'Completed'

  const today = new Date().toISOString()
  const startDate = new Date(item.startDate).toISOString()
  const endDate = new Date(item.endDate).toISOString()

  const startDateFormatted = formatInTimeZone(item.startDate.toISOString(), item.timeZone, 'yyyy-MM-dd HH:mm:ssXXX')
  const endDateFormatted = formatInTimeZone(item.endDate.toISOString(), item.timeZone, 'yyyy-MM-dd HH:mm:ssXXX')

  // console.log(`
  // EventName: ${item.name}
  // Today: ${today}
  // StartDate: ${item.startDate}
  // EndDate: ${item.endDate}
  // StartDateISO: ${startDate}
  // EndDateISO: ${endDate}
  // StartDateFormatted: ${startDateFormatted}
  // EndDateFormatted: ${endDateFormatted}
  // TimeZone: ${item.timeZone}
  // `)

  
  

  return today < startDate ? 'Upcoming' : today > endDate ? 'Completed' : today > startDate && today < endDate ? 'In Progress' : ''
}
