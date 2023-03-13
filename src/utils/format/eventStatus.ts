import { Event } from '../interfaces'

export const eventStatus = (item: Event) => {
  if (item.eventStatus == 'CANCELED') return 'Canceled'
  if (item.eventStatus == 'COMPLETED') return 'Completed'
  const today = new Date()
  const startDateLocal = new Date(item.startDate)
  const endDateLocal = new Date(item.endDate)
  return today < startDateLocal ? 'Upcoming' : today > endDateLocal ? 'Completed' : today > startDateLocal && today < endDateLocal ? 'In Progress' : ''
}
